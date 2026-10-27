<?php
/**
 * NaijaChop - Food Items API Endpoint
 * GET: Returns active food items with categories, prices, spice levels
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/security.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $category_id = isset($_GET['category']) ? intval($_GET['category']) : null;
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $only_specials = isset($_GET['specials']) && $_GET['specials'] === '1';

    $sql = "
        SELECT 
            f.id,
            f.category_id,
            c.name AS category_name,
            f.item_code,
            f.name,
            f.description,
            f.price_kobo,
            (f.price_kobo / 100) AS price_naira,
            f.image_url,
            f.preparation_time,
            f.spice_level,
            f.is_available,
            f.is_special,
            f.rating,
            f.calories
        FROM food_items f
        JOIN food_categories c ON f.category_id = c.id
        WHERE f.is_available = 1
    ";
    $params = [];

    if ($category_id) {
        $sql .= " AND f.category_id = :category_id";
        $params[':category_id'] = $category_id;
    }

    if (!empty($search)) {
        $sql .= " AND (f.name LIKE :search OR f.description LIKE :search)";
        $params[':search'] = '%' . $search . '%';
    }

    if ($only_specials) {
        $sql .= " AND f.is_special = 1";
    }

    $sql .= " ORDER BY c.display_order ASC, f.is_special DESC, f.name ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $foods = $stmt->fetchAll();

    // Fetch categories
    $catStmt = $pdo->query("SELECT id, name, slug, description FROM food_categories WHERE is_active = 1 ORDER BY display_order ASC");
    $categories = $catStmt->fetchAll();

    json_response([
        'success'    => true,
        'count'      => count($foods),
        'categories' => $categories,
        'data'       => $foods
    ]);
} catch (\Exception $e) {
    json_response(['success' => false, 'message' => 'Failed to load food menu: ' . $e->getMessage()], 500);
}
