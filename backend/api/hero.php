<?php

require_once __DIR__ . '/../db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$pdo = getPDO();

$method = $_SERVER['REQUEST_METHOD'];

$id = $_GET['id'] ?? null;

function body() {
    return json_decode(file_get_contents("php://input"), true);
}

if ($method === 'GET') {

    $stmt = $pdo->prepare("
        SELECT * FROM hero_slides
        ORDER BY id DESC
    ");

    $stmt->execute();

    echo json_encode(
        $stmt->fetchAll(PDO::FETCH_ASSOC)
    );

}

if ($method === 'POST') {

    $data = body();

    $stmt = $pdo->prepare("
        INSERT INTO hero_slides
        (
            badge_text,
            title,
            subtitle,
            background_image,
            button1_text,
            button2_text
        )
        VALUES
        (?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([

        $data['badge_text'],
        $data['title'],
        $data['subtitle'],
        $data['background_image'],
        $data['button1_text'],
        $data['button2_text']

    ]);

    echo json_encode([
        'success' => true
    ]);

}

if ($method === 'PUT') {

    $data = body();

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
        $data['subtitle'],
        $data['background_image'],
        $data['button1_text'],
        $data['button2_text'],
        $data['id']

    ]);

    echo json_encode([
        'success' => true
    ]);

}

if ($method === 'DELETE') {

    $stmt = $pdo->prepare("
        DELETE FROM hero_slides
        WHERE id = ?
    ");

    $stmt->execute([$id]);

    echo json_encode([
        'success' => true
    ]);

}