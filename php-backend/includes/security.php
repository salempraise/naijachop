<?php
/**
 * NaijaChop - Security & Helper Functions
 * CSRF protection, sanitization, authentication checking, response helpers
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start([
        'cookie_httponly' => true,
        'cookie_samesite' => 'Lax',
    ]);
}

/**
 * Generate or retrieve CSRF token
 */
function get_csrf_token(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verify CSRF token
 */
function verify_csrf_token(?string $token): bool {
    if (empty($token) || empty($_SESSION['csrf_token'])) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Clean string for safe HTML output (prevents XSS)
 */
function e(?string $string): string {
    return htmlspecialchars($string ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Send JSON Response
 */
function json_response(array $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

/**
 * Format Kobo into formatted Naira string (e.g. ₦4,500.00)
 */
function format_naira(int $kobo): string {
    return '₦' . number_format($kobo / 100, 2);
}

/**
 * Require logged in customer
 */
function require_auth(): array {
    if (empty($_SESSION['user_id'])) {
        json_response(['success' => false, 'message' => 'Authentication required'], 401);
    }
    return $_SESSION['user'];
}

/**
 * Require logged in administrator
 */
function require_admin(): array {
    if (empty($_SESSION['admin_id'])) {
        json_response(['success' => false, 'message' => 'Admin authorization required'], 403);
    }
    return $_SESSION['admin'];
}
