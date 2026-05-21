<?php

require_once __DIR__ . '/../db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

function send($data, $status = 200)
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function body()
{
    return json_decode(file_get_contents("php://input"), true);
}

try {

    $pdo = getPDO();

    // GET ABOUT DATA
    if ($method === 'GET') {

        $stmt = $pdo->prepare("
            SELECT * FROM about_section
            ORDER BY id DESC
            LIMIT 1
        ");

        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        send($data);
    }

    // UPDATE ABOUT DATA
    if ($method === 'PUT') {

        $data = body();

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

            $data['owner_name'],
            $data['owner_photo'],
            $data['badge_text'],
            $data['title'],
            $data['subtitle'],

            $data['card1_title'],
            $data['card1_desc'],

            $data['card2_title'],
            $data['card2_desc'],

            $data['card3_title'],
            $data['card3_desc']

        ]);

        send([
            'success' => true,
            'message' => 'About section updated'
        ]);
    }

} catch (Exception $e) {

    send([
        'error' => $e->getMessage()
    ], 500);

}