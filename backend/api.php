<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$script = $_SERVER['SCRIPT_NAME'];
$path = preg_replace('#^' . preg_quote(dirname($script), '#') . '#', '', $path);
$path = trim($path, '/');
$path = preg_replace('#^api\.php#', '', $path);
$path = trim($path, '/');
$segments = explode('/', $path);
$resource = $segments[0] ?? '';
$id = $segments[1] ?? null;
$method = $_SERVER['REQUEST_METHOD'];

function sendJson($data, $status = 200)
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}


function getRequestData()
{
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function getBearerToken()
{
    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
    } else {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (strpos($name, 'HTTP_') === 0) {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
    }

    if (!isset($headers['Authorization'])) {
        return null;
    }
    $parts = explode(' ', $headers['Authorization']);
    return $parts[0] === 'Bearer' ? trim($parts[1]) : null;
}

function generateToken($username)
{
    $payload = ['user' => $username, 'exp' => time() + 3600];
    $data = base64_encode(json_encode($payload));
    $signature = hash_hmac('sha256', $data, API_SECRET);
    return $data . '.' . $signature;
}

function validateToken($token)
{
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

function requireAuth()
{
    $token = getBearerToken();
    if (!validateToken($token)) {
        sendJson(['error' => 'Unauthorized'], 401);
    }
}

function handleList($table)
{
    $pdo = getPDO();
    $stmt = $pdo->prepare('SELECT * FROM ' . $table . ' ORDER BY id DESC');
    $stmt->execute();
    return $stmt->fetchAll();
}

function handleGetById($table, $id)
{
    $pdo = getPDO();
    $stmt = $pdo->prepare('SELECT * FROM ' . $table . ' WHERE id = ?');
    $stmt->execute([$id]);
    return $stmt->fetch();
}

switch ($resource) {
    case 'login':
        if ($method !== 'POST') {
            sendJson(['error' => 'Method not allowed'], 405);
        }
        $data = getRequestData();
        if (empty($data['username']) || empty($data['password'])) {
            sendJson(['error' => 'Username and password are required.'], 422);
        }
        $pdo = getPDO();
        $stmt = $pdo->prepare('SELECT * FROM admin_users WHERE username = ? LIMIT 1');
        $stmt->execute([$data['username']]);
        $user = $stmt->fetch();
        if (!$user || !password_verify($data['password'], $user['password'])) {
            sendJson(['error' => 'Invalid credentials.'], 401);
        }
        sendJson(['token' => generateToken($user['username'])]);
        break;

    case 'appointments':
        if ($method === 'GET') {
            requireAuth();
            sendJson(handleList('appointments'));
        }
        if ($method === 'POST') {
            $data = getRequestData();
            $required = ['name', 'phone', 'email', 'date', 'time', 'service'];
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    sendJson(['error' => 'Missing field: ' . $field], 422);
                }
            }
            $pdo = getPDO();
            $stmt = $pdo->prepare('INSERT INTO appointments (name, phone, email, date, time, service, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())');
            $stmt->execute([$data['name'], $data['phone'], $data['email'], $data['date'], $data['time'], $data['service'], $data['message'] ?? '']);
            sendJson(['success' => true, 'message' => 'Appointment booked successfully.'], 201);
        }
        break;

    case 'blogs':
        if ($method === 'GET') {
            if ($id) {
                $blog = handleGetById('blogs', $id);
                if (!$blog) {
                    sendJson(['error' => 'Blog not found.'], 404);
                }
                sendJson($blog);
            }
            sendJson(handleList('blogs'));
        }
        if ($method === 'POST') {
            requireAuth();
            $data = getRequestData();
            $required = ['title', 'description', 'content', 'media_url'];
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    sendJson(['error' => 'Missing field: ' . $field], 422);
                }
            }
            $pdo = getPDO();
            $stmt = $pdo->prepare('INSERT INTO blogs (title, description, content, media_url, created_at) VALUES (?, ?, ?, ?, NOW())');
            $stmt->execute([$data['title'], $data['description'], $data['content'], $data['media_url']]);
            sendJson(['success' => true, 'message' => 'Blog created.'], 201);
        }
        if ($method === 'PUT' && $id) {
            requireAuth();
            $data = getRequestData();
            $pdo = getPDO();
            $stmt = $pdo->prepare('UPDATE blogs SET title = ?, description = ?, content = ?, media_url = ? WHERE id = ?');
            $stmt->execute([$data['title'], $data['description'], $data['content'], $data['media_url'], $id]);
            sendJson(['success' => true, 'message' => 'Blog updated.']);
        }
        if ($method === 'DELETE' && $id) {
            requireAuth();
            $pdo = getPDO();
            $stmt = $pdo->prepare('DELETE FROM blogs WHERE id = ?');
            $stmt->execute([$id]);
            sendJson(['success' => true, 'message' => 'Blog deleted.']);
        }
        break;

    case 'testimonials':
        if ($method === 'GET') {
            sendJson(handleList('testimonials'));
        }
        if ($method === 'POST') {
            requireAuth();
            $data = getRequestData();
            if (empty($data['name']) || empty($data['message']) || empty($data['rating'])) {
                sendJson(['error' => 'Name, message, and rating are required.'], 422);
            }
            $pdo = getPDO();
            $stmt = $pdo->prepare('INSERT INTO testimonials (name, message, rating) VALUES (?, ?, ?)');
            $stmt->execute([$data['name'], $data['message'], $data['rating']]);
            sendJson(['success' => true, 'message' => 'Testimonial added.'], 201);
        }
        if ($method === 'PUT' && $id) {
            requireAuth();
            $data = getRequestData();
            $pdo = getPDO();
            $stmt = $pdo->prepare('UPDATE testimonials SET name = ?, message = ?, rating = ? WHERE id = ?');
            $stmt->execute([$data['name'], $data['message'], $data['rating'], $id]);
            sendJson(['success' => true, 'message' => 'Testimonial updated.']);
        }
        if ($method === 'DELETE' && $id) {
            requireAuth();
            $pdo = getPDO();
            $stmt = $pdo->prepare('DELETE FROM testimonials WHERE id = ?');
            $stmt->execute([$id]);
            sendJson(['success' => true, 'message' => 'Testimonial deleted.']);
        }
        break;

    case 'gallery':
        if ($method === 'GET') {
            sendJson(handleList('gallery'));
        }
        if ($method === 'POST') {
            requireAuth();
            $data = getRequestData();
            if (empty($data['media_url']) || empty($data['type'])) {
                sendJson(['error' => 'Media URL and type are required.'], 422);
            }
            $pdo = getPDO();
            $stmt = $pdo->prepare('INSERT INTO gallery (media_url, type) VALUES (?, ?)');
            $stmt->execute([$data['media_url'], $data['type']]);
            sendJson(['success' => true, 'message' => 'Gallery item added.'], 201);
        }
        if ($method === 'PUT' && $id) {
            requireAuth();
            $data = getRequestData();
            $pdo = getPDO();
            $stmt = $pdo->prepare('UPDATE gallery SET media_url = ?, type = ? WHERE id = ?');
            $stmt->execute([$data['media_url'], $data['type'], $id]);
            sendJson(['success' => true, 'message' => 'Gallery item updated.']);
        }
        if ($method === 'DELETE' && $id) {
            requireAuth();
            $pdo = getPDO();
            $stmt = $pdo->prepare('DELETE FROM gallery WHERE id = ?');
            $stmt->execute([$id]);
            sendJson(['success' => true, 'message' => 'Gallery item deleted.']);
        }
        break;

    default:
        sendJson(['error' => 'Resource not found.'], 404);
}
