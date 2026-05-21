<?php

require_once __DIR__ . '/../db.php';

// CORS Headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

function sendJson($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function getRequestBody() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?? [];
}

function generateToken($username) {
    $payload = ['user' => $username, 'iat' => time(), 'exp' => time() + 3600];
    $data = base64_encode(json_encode($payload));
    $signature = hash_hmac('sha256', $data, API_SECRET);
    return $data . '.' . $signature;
}

function validateToken($token) {
    if (!$token) {
        return false;
    }
    
    $parts = explode('.', $token);
    if (count($parts) !== 2) {
        return false;
    }
    
    list($data, $signature) = $parts;
    
    if (!hash_equals(hash_hmac('sha256', $data, API_SECRET), $signature)) {
        return false;
    }
    
    $payload = json_decode(base64_decode($data), true);
    return is_array($payload) && isset($payload['exp']) && $payload['exp'] >= time();
}

try {
    // LOGIN endpoint - POST only
    if ($method !== 'POST') {
        sendJson(['error' => 'Method not allowed'], 405);
    }

    $data = getRequestBody();
    
    if (empty($data)) {
        sendJson(['error' => 'Request body is empty'], 400);
    }

    if (empty($data['username']) || empty($data['password'])) {
        sendJson(['error' => 'Username and password are required'], 422);
    }

    $pdo = getPDO();
    $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = ? LIMIT 1");
    $stmt->execute([$data['username']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($data['password'], $user['password'])) {
        sendJson(['error' => 'Invalid credentials'], 401);
    }

    $token = generateToken($user['username']);
    sendJson(['success' => true, 'token' => $token, 'username' => $user['username']], 200);

} catch (Exception $e) {
    error_log('Login API Error: ' . $e->getMessage());
    sendJson(['error' => 'Server error'], 500);
}
