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

    // GET all hero slides or by ID
    if ($method === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM hero_slides WHERE id = ? LIMIT 1");
            $stmt->execute([$id]);
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$data) {
                sendJson(['error' => 'Slide not found'], 404);
            }
            
            sendJson([$data]);
        }
        
        $stmt = $pdo->prepare("SELECT * FROM hero_slides ORDER BY id DESC");
        $stmt->execute();
        sendJson($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    // CREATE new hero slide
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

        if (empty($data['badge_text']) || empty($data['title']) || empty($data['background_image'])) {
            sendJson(['error' => 'Missing required fields'], 422);
        }

        $stmt = $pdo->prepare("
            INSERT INTO hero_slides 
            (badge_text, title, subtitle, background_image, button1_text, button2_text) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $data['badge_text'],
            $data['title'],
            $data['subtitle'] ?? '',
            $data['background_image'],
            $data['button1_text'] ?? '',
            $data['button2_text'] ?? ''
        ]);

        sendJson(['success' => true, 'message' => 'Slide created', 'id' => $pdo->lastInsertId()], 201);
    }

    // UPDATE hero slide
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
            sendJson(['error' => 'Slide ID is required'], 422);
        }

        $stmt = $pdo->prepare("
            UPDATE hero_slides SET
                badge_text = ?,
                title = ?,
                subtitle = ?,
                background_image = ?,
                button1_text = ?,
                button2_text = ?
            WHERE id = ?
        ");

        $stmt->execute([
            $data['badge_text'],
            $data['title'],
            $data['subtitle'] ?? '',
            $data['background_image'],
            $data['button1_text'] ?? '',
            $data['button2_text'] ?? '',
            $data['id']
        ]);

        sendJson(['success' => true, 'message' => 'Slide updated'], 200);
    }

    // DELETE hero slide
    if ($method === 'DELETE') {
        $headers = getallheaders();
        $auth = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        if (empty($auth) || !str_starts_with($auth, 'Bearer ')) {
            sendJson(['error' => 'Unauthorized'], 401);
        }

        if (!$id) {
            sendJson(['error' => 'Slide ID is required'], 422);
        }

        $stmt = $pdo->prepare("DELETE FROM hero_slides WHERE id = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            sendJson(['error' => 'Slide not found'], 404);
        }

        sendJson(['success' => true, 'message' => 'Slide deleted'], 200);
    }

    // Method not allowed
    sendJson(['error' => 'Method not allowed'], 405);

} catch (Exception $e) {
    error_log('Hero API Error: ' . $e->getMessage());
    sendJson(['error' => 'Server error'], 500);
}

