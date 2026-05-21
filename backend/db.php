<?php

define('DB_HOST', 'localhost');
define('DB_NAME', 'identity_health_care');
define('DB_USER', 'root');
define('DB_PASS', 'Sadh@112255');
define('API_SECRET', 'identityhealthcare_secret');

function getPDO()
{
    static $pdo;
    if ($pdo) {
        return $pdo;
    }

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed.']);
        exit;
    }
}
