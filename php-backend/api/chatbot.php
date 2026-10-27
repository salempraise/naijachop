<?php
/**
 * NaijaChop - Assistant Chatbot API Endpoint
 * Analyzes conversational queries, matches culinary preferences & FAQ database,
 * and returns structured suggestions, quick actions, and meal cards.
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/security.php';

header('Content-Type: application/json; charset=utf-8');

$input = json_decode(file_get_contents('php://input'), true);
$message = strtolower(trim($input['message'] ?? ''));

if (empty($message)) {
    json_response([
        'reply' => 'Welcome to NaijaChop! What authentic Nigerian meal are you craving today? Try asking for "Party Jollof", "Egusi with Pounded Yam", or "Suya".',
        'quick_actions' => [
            ['label' => 'Party Jollof Rice', 'action' => 'order_jollof'],
            ['label' => 'Egusi & Pounded Yam', 'action' => 'order_egusi'],
            ['label' => 'Beef Suya Skewers', 'action' => 'order_suya'],
            ['label' => 'Delivery Hours & Areas', 'action' => 'faq_delivery'],
        ]
    ]);
}

try {
    // 1. Check FAQ Database
    $faqs = $pdo->query("SELECT * FROM chatbot_faqs")->fetchAll();
    foreach ($faqs as $faq) {
        $keywords = array_map('trim', explode(',', strtolower($faq['keywords'])));
        foreach ($keywords as $kw) {
            if (!empty($kw) && strpos($message, $kw) !== false) {
                json_response([
                    'reply' => $faq['response_text'],
                    'intent' => $faq['intent_name'],
                    'quick_actions' => [
                        ['label' => 'Browse Full Menu', 'action' => 'browse_menu'],
                        ['label' => 'Order Jollof Rice', 'action' => 'order_jollof'],
                    ]
                ]);
            }
        }
    }

    // 2. Meal Intent Recognition
    if (strpos($message, 'jollof') !== false || strpos($message, 'rice') !== false) {
        $stmt = $pdo->prepare("SELECT * FROM food_items WHERE name LIKE '%Jollof%' LIMIT 1");
        $stmt->execute();
        $food = $stmt->fetch();

        json_response([
            'reply' => "Our signature Party Jollof Rice with Peppered Chicken is smoky, aromatic, and cooked to perfection! How many plates would you like?",
            'food_recommendation' => $food,
            'quick_actions' => [
                ['label' => '1 Plate (₦4,500)', 'action' => 'add_item', 'payload' => ['id' => $food['id'], 'name' => $food['name'], 'qty' => 1]],
                ['label' => '2 Plates (₦9,000)', 'action' => 'add_item', 'payload' => ['id' => $food['id'], 'name' => $food['name'], 'qty' => 2]],
                ['label' => 'Add Chilled Zobo Drink', 'action' => 'add_drink'],
            ]
        ]);
    }

    if (strpos($message, 'egusi') !== false || strpos($message, 'yam') !== false || strpos($message, 'soup') !== false || strpos($message, 'swallow') !== false) {
        $stmt = $pdo->prepare("SELECT * FROM food_items WHERE name LIKE '%Egusi%' LIMIT 1");
        $stmt->execute();
        $food = $stmt->fetch();

        json_response([
            'reply' => "Nothing beats Rich Egusi Soup with Fluffy Pounded Yam! Made with ground melon seeds, stockfish, and tender beef. Would you like to add this to your tray?",
            'food_recommendation' => $food,
            'quick_actions' => [
                ['label' => 'Add to Cart (₦5,800)', 'action' => 'add_item', 'payload' => ['id' => $food['id'], 'name' => $food['name'], 'qty' => 1]],
                ['label' => 'Switch to Amala', 'action' => 'custom_swallow'],
            ]
        ]);
    }

    if (strpos($message, 'suya') !== false || strpos($message, 'grill') !== false || strpos($message, 'meat') !== false) {
        $stmt = $pdo->prepare("SELECT * FROM food_items WHERE name LIKE '%Suya%' LIMIT 1");
        $stmt->execute();
        $food = $stmt->fetch();

        json_response([
            'reply' => "Authentic Northern Beef Suya skewers grilled over hot coals with original Kano Yaji pepper and crisp red onions. Perfect evening bite!",
            'food_recommendation' => $food,
            'quick_actions' => [
                ['label' => 'Add Suya (₦3,800)', 'action' => 'add_item', 'payload' => ['id' => $food['id'], 'name' => $food['name'], 'qty' => 1]],
                ['label' => 'Pair with Chapman', 'action' => 'add_drink'],
            ]
        ]);
    }

    if (strpos($message, 'human') !== false || strpos($message, 'agent') !== false || strpos($message, 'support') !== false || strpos($message, 'help') !== false) {
        json_response([
            'reply' => "Connecting you to our Lagos support team. You can also reach our dispatch desk on +234 800 NAIJACHOP (0800 6245 22467) or WhatsApp at +234 803 123 4567.",
            'quick_actions' => [
                ['label' => 'Call Dispatch', 'action' => 'call_support'],
                ['label' => 'Back to Menu', 'action' => 'browse_menu'],
            ]
        ]);
    }

    // Default polite response
    json_response([
        'reply' => "I hear you! At NaijaChop we serve hot Party Jollof, Rich Egusi with Pounded Yam, fiery Beef Suya, Efo Riro, and chilled Zobo. What sounds delicious to you right now?",
        'quick_actions' => [
            ['label' => 'See Rice Dishes', 'action' => 'filter_rice'],
            ['label' => 'See Soups & Swallows', 'action' => 'filter_soups'],
            ['label' => 'Check Suya & Grills', 'action' => 'filter_grills'],
            ['label' => 'Track Existing Order', 'action' => 'track_order'],
        ]
    ]);
} catch (\Exception $e) {
    json_response(['reply' => 'I am here to assist your order! What delicious meal would you like?'], 200);
}
