<?php

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

    // GET all blogs or by ID
    if ($method === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM blogs WHERE id = ? LIMIT 1");
            $stmt->execute([$id]);
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$data) {
                sendJson(['error' => 'Blog not found'], 404);
            }
            
            sendJson($data);
        }
        
        $stmt = $pdo->prepare("SELECT * FROM blogs ORDER BY id DESC");
        $stmt->execute();
        sendJson($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    // CREATE new blog (requires auth)
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

        if (empty($data['title']) || empty($data['description']) || empty($data['content'])) {
            sendJson(['error' => 'Missing required fields: title, description, content'], 422);
        }

        $stmt = $pdo->prepare("
            INSERT INTO blogs (title, description, content, media_url, created_at) 
            VALUES (?, ?, ?, ?, NOW())
        ");

        $stmt->execute([
            $data['title'],
            $data['description'],
            $data['content'],
            $data['media_url'] ?? ''
        ]);

        sendJson(['success' => true, 'message' => 'Blog created', 'id' => $pdo->lastInsertId()], 201);
    }

    // UPDATE blog (requires auth)
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
            sendJson(['error' => 'Blog ID is required'], 422);
        }

        $stmt = $pdo->prepare("
            UPDATE blogs SET 
                title = ?, 
                description = ?, 
                content = ?, 
                media_url = ? 
            WHERE id = ?
        ");

        $stmt->execute([
            $data['title'],
            $data['description'],
            $data['content'],
            $data['media_url'] ?? '',
            $data['id']
        ]);

        sendJson(['success' => true, 'message' => 'Blog updated'], 200);
    }

    // DELETE blog (requires auth)
    if ($method === 'DELETE') {
        $headers = getallheaders();
        $auth = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        if (empty($auth) || !str_starts_with($auth, 'Bearer ')) {
            sendJson(['error' => 'Unauthorized'], 401);
        }

        if (!$id) {
            sendJson(['error' => 'Blog ID is required'], 422);
        }

        $stmt = $pdo->prepare("DELETE FROM blogs WHERE id = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            sendJson(['error' => 'Blog not found'], 404);
        }

        sendJson(['success' => true, 'message' => 'Blog deleted'], 200);
    }

    // Method not allowed
    sendJson(['error' => 'Method not allowed'], 405);

} catch (Exception $e) {
    error_log('Blogs API Error: ' . $e->getMessage());
    sendJson(['error' => 'Server error'], 500);
}
