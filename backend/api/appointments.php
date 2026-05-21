<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once __DIR__ . '/../db.php';

// CORS Headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

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

try {
    $pdo = getPDO();

    // GET all appointments (requires auth)
    if ($method === 'GET') {
        $headers = getallheaders();
        $auth = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        if (empty($auth) || !str_starts_with($auth, 'Bearer ')) {
            sendJson(['error' => 'Unauthorized'], 401);
        }

        $stmt = $pdo->prepare("SELECT * FROM appointments ORDER BY id DESC");
        $stmt->execute();
        sendJson($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    // CREATE new appointment (public)
    if ($method === 'POST') {
        $data = getRequestBody();
        
        if (empty($data)) {
            sendJson(['error' => 'Request body is empty'], 400);
        }

        $required = ['name', 'phone', 'email', 'date', 'time', 'service'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                sendJson(['error' => 'Missing required field: ' . $field], 422);
            }
        }

        $stmt = $pdo->prepare("
            INSERT INTO appointments (name, phone, email, date, time, service, message, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        ");

        $stmt->execute([
            $data['name'],
            $data['phone'],
            $data['email'],
            $data['date'],
            $data['time'],
            $data['service'],
            $data['message'] ?? ''
        ]);

        sendJson(['success' => true, 'message' => 'Appointment booked successfully', 'id' => $pdo->lastInsertId()], 201);
    }

    // Method not allowed
    sendJson(['error' => 'Method not allowed'], 405);

} catch (Exception $e) {
    error_log('Appointments API Error: ' . $e->getMessage());
    sendJson(['error' => 'Server error'], 500);
}
