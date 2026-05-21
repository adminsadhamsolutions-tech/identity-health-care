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
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

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

    // GET all gallery items or by ID
    if ($method === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM gallery WHERE id = ? LIMIT 1");
            $stmt->execute([$id]);
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$data) {
                sendJson(['error' => 'Gallery item not found'], 404);
            }
            
            sendJson([$data]);
        }
        
        $stmt = $pdo->prepare("SELECT * FROM gallery ORDER BY id DESC");
        $stmt->execute();
        sendJson($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    // CREATE new gallery item (requires auth)
    if ($method === 'POST') {
        $headers = getallheaders();
        $auth = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        if (empty($auth) || !str_starts_with($auth, 'Bearer ')) {
            sendJson(['error' => 'Unauthorized'], 401);
        }

        $data = getRequestBody();
        
        if (empty($data)) {
            sendJson(['error' => 'Request body is empty'], 400);
        }

        if (empty($data['media_url']) || empty($data['type'])) {
            sendJson(['error' => 'Missing required fields: media_url, type'], 422);
        }

        $stmt = $pdo->prepare("
            INSERT INTO gallery (media_url, type) 
            VALUES (?, ?)
        ");

        $stmt->execute([
            $data['media_url'],
            $data['type']
        ]);

        sendJson(['success' => true, 'message' => 'Gallery item added', 'id' => $pdo->lastInsertId()], 201);
    }

    // UPDATE gallery item (requires auth)
    if ($method === 'PUT') {
        $headers = getallheaders();
        $auth = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        if (empty($auth) || !str_starts_with($auth, 'Bearer ')) {
            sendJson(['error' => 'Unauthorized'], 401);
        }

        $data = getRequestBody();
        
        if (empty($data)) {
            sendJson(['error' => 'Request body is empty'], 400);
        }

        if (empty($data['id'])) {
            sendJson(['error' => 'Gallery item ID is required'], 422);
        }

        $stmt = $pdo->prepare("
            UPDATE gallery SET 
                media_url = ?, 
                type = ? 
            WHERE id = ?
        ");

        $stmt->execute([
            $data['media_url'],
            $data['type'],
            $data['id']
        ]);

        sendJson(['success' => true, 'message' => 'Gallery item updated'], 200);
    }

    // DELETE gallery item (requires auth)
    if ($method === 'DELETE') {
        $headers = getallheaders();
        $auth = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        if (empty($auth) || !str_starts_with($auth, 'Bearer ')) {
            sendJson(['error' => 'Unauthorized'], 401);
        }

        if (!$id) {
            sendJson(['error' => 'Gallery item ID is required'], 422);
        }

        $stmt = $pdo->prepare("DELETE FROM gallery WHERE id = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            sendJson(['error' => 'Gallery item not found'], 404);
        }

        sendJson(['success' => true, 'message' => 'Gallery item deleted'], 200);
    }

    // Method not allowed
    sendJson(['error' => 'Method not allowed'], 405);

} catch (Exception $e) {
    error_log('Gallery API Error: ' . $e->getMessage());
    sendJson(['error' => 'Server error'], 500);
}
