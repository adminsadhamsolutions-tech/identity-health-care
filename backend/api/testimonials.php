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

    // GET all testimonials or by ID
    if ($method === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM testimonials WHERE id = ? LIMIT 1");
            $stmt->execute([$id]);
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$data) {
                sendJson(['error' => 'Testimonial not found'], 404);
            }
            
            sendJson([$data]);
        }
        
        $stmt = $pdo->prepare("SELECT * FROM testimonials ORDER BY id DESC");
        $stmt->execute();
        sendJson($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    // CREATE new testimonial (requires auth)
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

        if (empty($data['name']) || empty($data['message']) || empty($data['rating'])) {
            sendJson(['error' => 'Missing required fields: name, message, rating'], 422);
        }

        $stmt = $pdo->prepare("
            INSERT INTO testimonials (name, message, rating) 
            VALUES (?, ?, ?)
        ");

        $stmt->execute([
            $data['name'],
            $data['message'],
            $data['rating']
        ]);

        sendJson(['success' => true, 'message' => 'Testimonial added', 'id' => $pdo->lastInsertId()], 201);
    }

    // UPDATE testimonial (requires auth)
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
            sendJson(['error' => 'Testimonial ID is required'], 422);
        }

        $stmt = $pdo->prepare("
            UPDATE testimonials SET 
                name = ?, 
                message = ?, 
                rating = ? 
            WHERE id = ?
        ");

        $stmt->execute([
            $data['name'],
            $data['message'],
            $data['rating'],
            $data['id']
        ]);

        sendJson(['success' => true, 'message' => 'Testimonial updated'], 200);
    }

    // DELETE testimonial (requires auth)
    if ($method === 'DELETE') {
        $headers = getallheaders();
        $auth = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        if (empty($auth) || !str_starts_with($auth, 'Bearer ')) {
            sendJson(['error' => 'Unauthorized'], 401);
        }

        if (!$id) {
            sendJson(['error' => 'Testimonial ID is required'], 422);
        }

        $stmt = $pdo->prepare("DELETE FROM testimonials WHERE id = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            sendJson(['error' => 'Testimonial not found'], 404);
        }

        sendJson(['success' => true, 'message' => 'Testimonial deleted'], 200);
    }

    // Method not allowed
    sendJson(['error' => 'Method not allowed'], 405);

} catch (Exception $e) {
    error_log('Testimonials API Error: ' . $e->getMessage());
    sendJson(['error' => 'Server error'], 500);
}


