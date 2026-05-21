<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

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
    $method = $_SERVER['REQUEST_METHOD'];

    // GET
    if ($method === 'GET') {
        $stmt = $pdo->prepare("SELECT * FROM about_section ORDER BY id DESC LIMIT 1");
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            sendJson(['error' => 'Not found'], 404);
        }

        sendJson([$data]);
    }

    // PUT
    if ($method === 'PUT') {

        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? '';

        if (!$auth || strpos($auth, 'Bearer ') !== 0) {
            sendJson(['error' => 'Unauthorized'], 401);
        }

        $data = getRequestBody();

        if (!$data) {
            sendJson(['error' => 'Empty body'], 400);
        }

        $stmt = $pdo->prepare("
            UPDATE about_section SET
                owner_name = ?,
                owner_photo = ?,
                badge_text = ?,
                title = ?,
                subtitle = ?,
                card1_title = ?,
                card1_desc = ?,
                card2_title = ?,
                card2_desc = ?,
                card3_title = ?,
                card3_desc = ?
            WHERE id = 1
        ");

        $stmt->execute([
            $data['owner_name'] ?? '',
            $data['owner_photo'] ?? '',
            $data['badge_text'] ?? '',
            $data['title'] ?? '',
            $data['subtitle'] ?? '',
            $data['card1_title'] ?? '',
            $data['card1_desc'] ?? '',
            $data['card2_title'] ?? '',
            $data['card2_desc'] ?? '',
            $data['card3_title'] ?? '',
            $data['card3_desc'] ?? ''
        ]);

        sendJson(['success' => true, 'message' => 'Updated']);
    }

    sendJson(['error' => 'Method not allowed'], 405);

} catch (Exception $e) {
    error_log($e->getMessage());
    sendJson(['error' => 'Server error'], 500);
}