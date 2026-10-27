<?php
/**
 * NaijaChop - Customer Registration Endpoint
 * Validates full name, email, phone number, hashes password using BCRYPT.
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/security.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'message' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

$name     = trim($input['name'] ?? '');
$email    = filter_var(trim($input['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone    = trim($input['phone'] ?? '');
$password = $input['password'] ?? '';

if (empty($name) || strlen($name) < 3) {
    json_response(['success' => false, 'message' => 'Please enter your full name.'], 400);
}

if (!$email) {
    json_response(['success' => false, 'message' => 'Please enter a valid email address.'], 400);
}

if (empty($phone) || strlen($phone) < 10) {
    json_response(['success' => false, 'message' => 'Please enter a valid phone number (+234...)'], 400);
}

if (strlen($password) < 6) {
    json_response(['success' => false, 'message' => 'Password must be at least 6 characters long.'], 400);
}

try {
    // Check if email already registered
    $chkStmt = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
    $chkStmt->execute([':email' => $email]);
    if ($chkStmt->fetch()) {
        json_response(['success' => false, 'message' => 'This email is already registered. Please log in.'], 409);
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("
        INSERT INTO users (full_name, email, phone, password_hash)
        VALUES (:name, :email, :phone, :hash)
    ");
    $stmt->execute([
        ':name'  => $name,
        ':email' => $email,
        ':phone' => $phone,
        ':hash'  => $hash,
    ]);
    $user_id = $pdo->lastInsertId();

    session_regenerate_id(true);
    $_SESSION['user_id'] = $user_id;
    $_SESSION['user'] = [
        'id'    => $user_id,
        'name'  => $name,
        'email' => $email,
        'phone' => $phone,
        'role'  => 'customer',
    ];

    json_response([
        'success' => true,
        'user'    => $_SESSION['user'],
        'message' => 'Account created successfully! Welcome to NaijaChop.'
    ], 201);
} catch (\Exception $e) {
    json_response(['success' => false, 'message' => 'Registration error: ' . $e->getMessage()], 500);
}
