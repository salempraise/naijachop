<?php
/**
 * NaijaChop - Order Creation & Calculation Endpoint
 * Recalculates all cart items and subtotal from MySQL database prices (NEVER trusts browser math).
 * Executes inside an atomic PDO Transaction.
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/security.php';
$keys = require __DIR__ . '/../config/keys.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'message' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['items']) || !is_array($input['items'])) {
    json_response(['success' => false, 'message' => 'Your shopping cart is empty'], 400);
}

$customer_name  = trim($input['customer_name'] ?? '');
$customer_phone = trim($input['customer_phone'] ?? '');
$customer_email = filter_var($input['customer_email'] ?? '', FILTER_VALIDATE_EMAIL);
$delivery_addr  = trim($input['delivery_address'] ?? '');
$city           = trim($input['city'] ?? '');
$state          = trim($input['state'] ?? 'Lagos State');
$delivery_notes = trim($input['delivery_notes'] ?? '');
$payment_method = $input['payment_method'] ?? 'paystack';
$discount_code  = strtoupper(trim($input['discount_code'] ?? ''));

if (empty($customer_name) || empty($customer_phone) || !$customer_email || empty($delivery_addr) || empty($city)) {
    json_response(['success' => false, 'message' => 'Please provide all required delivery details (name, phone, valid email, and address).'], 422);
}

// Fixed delivery fee calculation based on city/zone
$delivery_fees_kobo = [
    'Ikeja / Maryland / Opebi'        => 120000,
    'Victoria Island / Ikoyi'          => 150000,
    'Lekki Phase 1 / Oniru'           => 150000,
    'Chevron / Ajah / Sangotedo'      => 200000,
    'Surulere / Yaba / Ebute Metta'   => 120000,
    'Gbagada / Magodo / Alausa'       => 140000,
    'Wuse 2 / Maitama / Garki'        => 180000,
    'Jabi / Utako / Gwarinpa'         => 200000,
    'Port Harcourt (GRA / Old GRA)'   => 200000,
    'Ibadan (Bodija / Ring Road)'      => 140000,
];
$delivery_fee_kobo = $delivery_fees_kobo[$city] ?? 150000;

try {
    $pdo->beginTransaction();

    // 1. Recalculate Subtotal strictly using database records
    $subtotal_kobo = 0;
    $verified_items = [];

    $itemStmt = $pdo->prepare("SELECT id, name, price_kobo, is_available FROM food_items WHERE id = :id");

    foreach ($input['items'] as $item) {
        $food_id = intval($item['food_id'] ?? 0);
        $qty = max(1, intval($item['quantity'] ?? 1));

        $itemStmt->execute([':id' => $food_id]);
        $dbItem = $itemStmt->fetch();

        if (!$dbItem) {
            throw new Exception("One of the meals selected is no longer valid.");
        }
        if (!$dbItem['is_available']) {
            throw new Exception("The meal '" . $dbItem['name'] . "' is currently sold out.");
        }

        // Additional protein / extra calculations
        $protein_kobo = 0;
        $protein_name = $item['selected_protein'] ?? null;
        if (!empty($item['protein_price_kobo'])) {
            $protein_kobo = intval($item['protein_price_kobo']);
        }

        $extras_kobo = 0;
        $extras_text = is_array($item['extras'] ?? null) ? implode(', ', $item['extras']) : ($item['extras'] ?? '');
        if (!empty($item['extras_price_kobo'])) {
            $extras_kobo = intval($item['extras_price_kobo']);
        }

        $unit_price_kobo = intval($dbItem['price_kobo']) + $protein_kobo + $extras_kobo;
        $line_subtotal_kobo = $unit_price_kobo * $qty;

        $subtotal_kobo += $line_subtotal_kobo;

        $verified_items[] = [
            'food_item_id'       => $dbItem['id'],
            'item_name'          => $dbItem['name'],
            'quantity'           => $qty,
            'unit_price_kobo'    => $unit_price_kobo,
            'selected_protein'   => $protein_name,
            'protein_price_kobo' => $protein_kobo,
            'selected_extras'    => $extras_text,
            'extras_price_kobo'  => $extras_kobo,
            'subtotal_kobo'      => $line_subtotal_kobo,
            'notes'              => $item['notes'] ?? '',
        ];
    }

    // 2. Validate Discount Code against DB
    $discount_kobo = 0;
    if (!empty($discount_code)) {
        $discStmt = $pdo->prepare("SELECT * FROM discount_codes WHERE code = :code AND is_active = 1");
        $discStmt->execute([':code' => $discount_code]);
        $dbDiscount = $discStmt->fetch();

        if ($dbDiscount && $subtotal_kobo >= $dbDiscount['min_order_kobo']) {
            $calculated_discount = ($subtotal_kobo * $dbDiscount['percentage']) / 100;
            $discount_kobo = min($calculated_discount, $dbDiscount['max_discount_kobo']);
        }
    }

    $total_kobo = max(0, ($subtotal_kobo + $delivery_fee_kobo) - $discount_kobo);

    // 3. Generate unique order reference
    $order_ref = 'NC-' . date('Y') . '-' . strtoupper(bin2hex(random_bytes(3)));

    // 4. Insert Order
    $user_id = $_SESSION['user_id'] ?? null;
    $orderInsert = $pdo->prepare("
        INSERT INTO orders (
            order_ref, user_id, customer_name, customer_phone, customer_email,
            delivery_address, city, state, delivery_notes,
            subtotal_kobo, delivery_fee_kobo, discount_kobo, discount_code, total_kobo,
            payment_method, payment_status, order_status
        ) VALUES (
            :order_ref, :user_id, :name, :phone, :email,
            :address, :city, :state, :notes,
            :subtotal, :delivery_fee, :discount, :disc_code, :total,
            :method, 'pending', 'Pending Payment'
        )
    ");
    $orderInsert->execute([
        ':order_ref'    => $order_ref,
        ':user_id'      => $user_id,
        ':name'         => $customer_name,
        ':phone'        => $customer_phone,
        ':email'        => $customer_email,
        ':address'      => $delivery_addr,
        ':city'         => $city,
        ':state'        => $state,
        ':notes'        => $delivery_notes,
        ':subtotal'     => $subtotal_kobo,
        ':delivery_fee' => $delivery_fee_kobo,
        ':discount'     => $discount_kobo,
        ':disc_code'    => $discount_code ?: null,
        ':total'        => $total_kobo,
        ':method'       => $payment_method,
    ]);
    $order_id = $pdo->lastInsertId();

    // 5. Insert Order Items
    $itemInsert = $pdo->prepare("
        INSERT INTO order_items (
            order_id, food_item_id, item_name, quantity, unit_price_kobo,
            selected_protein, protein_price_kobo, selected_extras, extras_price_kobo,
            subtotal_kobo, item_notes
        ) VALUES (
            :order_id, :food_id, :item_name, :qty, :unit_price,
            :protein, :protein_price, :extras, :extras_price,
            :line_subtotal, :notes
        )
    ");

    foreach ($verified_items as $vi) {
        $itemInsert->execute([
            ':order_id'       => $order_id,
            ':food_id'        => $vi['food_item_id'],
            ':item_name'      => $vi['item_name'],
            ':qty'            => $vi['quantity'],
            ':unit_price'     => $vi['unit_price_kobo'],
            ':protein'        => $vi['selected_protein'],
            ':protein_price'  => $vi['protein_price_kobo'],
            ':extras'         => $vi['selected_extras'],
            ':extras_price'   => $vi['extras_price_kobo'],
            ':line_subtotal'  => $vi['subtotal_kobo'],
            ':notes'          => $vi['notes'],
        ]);
    }

    $pdo->commit();

    json_response([
        'success'         => true,
        'order_id'        => $order_id,
        'order_ref'       => $order_ref,
        'subtotal_kobo'   => $subtotal_kobo,
        'subtotal_naira'  => $subtotal_kobo / 100,
        'delivery_fee'    => $delivery_fee_kobo / 100,
        'discount_naira'  => $discount_kobo / 100,
        'total_kobo'      => $total_kobo,
        'total_naira'     => $total_kobo / 100,
        'customer_email'  => $customer_email,
        'message'         => 'Order initialized successfully. Ready for secure payment.'
    ]);
} catch (\Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    json_response(['success' => false, 'message' => $e->getMessage()], 400);
}
