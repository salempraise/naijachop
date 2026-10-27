<?php
/**
 * NaijaChop - Official Receipt Generator & View
 * Retrieves verified order from database, renders professional printable receipt.
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/security.php';
$keys = require __DIR__ . '/../config/keys.php';

$order_ref = trim($_GET['ref'] ?? '');
if (empty($order_ref)) {
    die("Error: No order reference specified.");
}

$stmt = $pdo->prepare("
    SELECT o.*, r.receipt_no, r.verification_token, r.created_at AS receipt_created_at, p.channel, p.gateway
    FROM orders o
    LEFT JOIN receipts r ON o.id = r.order_id
    LEFT JOIN payments p ON o.id = p.order_id
    WHERE o.order_ref = :ref
    LIMIT 1
");
$stmt->execute([':ref' => $order_ref]);
$order = $stmt->fetch();

if (!$order) {
    die("Error: Order not found.");
}

// Items
$itemStmt = $pdo->prepare("SELECT * FROM order_items WHERE order_id = :oid");
$itemStmt->execute([':oid' => $order['id']]);
$items = $itemStmt->fetchAll();

$is_verified = ($order['payment_status'] === 'verified');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receipt <?= e($order['order_ref']) ?> - NaijaChop</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background: #faf7f2; color: #1c140e; padding: 24px; margin: 0; }
        .receipt-card { max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #e7dfd5; border-radius: 12px; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f2eee8; padding-bottom: 20px; }
        .brand { font-size: 24px; font-weight: 800; color: #e65100; letter-spacing: -0.5px; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .badge-verified { background: #e8f5e9; color: #1b5e20; }
        .badge-pending { background: #fff3e0; color: #e65100; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; font-size: 14px; }
        .table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px; }
        .table th { text-align: left; padding: 10px; background: #fdfaf6; border-bottom: 1px solid #eee; color: #736357; }
        .table td { padding: 12px 10px; border-bottom: 1px solid #f5efe8; }
        .text-right { text-align: right; }
        .total-box { margin-top: 16px; padding-top: 16px; border-top: 2px solid #1c140e; }
        .actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
        .btn { padding: 10px 18px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; text-decoration: none; }
        .btn-print { background: #e65100; color: #fff; }
        .btn-outline { background: #f2eee8; color: #1c140e; }
        @media print {
            body { background: #fff; padding: 0; }
            .receipt-card { border: none; box-shadow: none; padding: 0; width: 100%; max-width: 100%; }
            .actions { display: none !important; }
        }
    </style>
</head>
<body>

<div class="receipt-card">
    <div class="header">
        <div>
            <div class="brand">🇳🇬 NaijaChop</div>
            <div style="font-size: 12px; color: #736357; margin-top: 4px;">
                <?= e($keys['business']['address']) ?><br>
                Tel: <?= e($keys['business']['phone']) ?> · <?= e($keys['business']['email']) ?>
            </div>
        </div>
        <div style="text-align: right;">
            <span class="badge <?= $is_verified ? 'badge-verified' : 'badge-pending' ?>">
                <?= $is_verified ? '✓ PAYMENT CONFIRMED' : 'PENDING VERIFICATION' ?>
            </span>
            <div style="font-size: 12px; color: #736357; margin-top: 6px;">
                Receipt: <strong><?= e($order['receipt_no'] ?? 'PENDING') ?></strong>
            </div>
        </div>
    </div>

    <div class="info-grid">
        <div>
            <div style="color: #736357; font-size: 11px; text-transform: uppercase;">Customer Information</div>
            <div style="font-weight: 600; margin-top: 4px;"><?= e($order['customer_name']) ?></div>
            <div><?= e($order['customer_phone']) ?></div>
            <div><?= e($order['customer_email']) ?></div>
        </div>
        <div>
            <div style="color: #736357; font-size: 11px; text-transform: uppercase;">Delivery Destination</div>
            <div style="font-weight: 600; margin-top: 4px;"><?= e($order['delivery_address']) ?></div>
            <div><?= e($order['city']) ?>, <?= e($order['state']) ?></div>
            <div style="font-size: 12px; color: #736357; margin-top: 2px;">Notes: <?= e($order['delivery_notes'] ?: 'None') ?></div>
        </div>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Item & Details</th>
                <th style="text-align: center;">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($items as $item): ?>
            <tr>
                <td>
                    <strong><?= e($item['item_name']) ?></strong>
                    <?php if (!empty($item['selected_protein'])): ?>
                        <div style="font-size: 12px; color: #736357;">Protein: <?= e($item['selected_protein']) ?></div>
                    <?php endif; ?>
                    <?php if (!empty($item['selected_extras'])): ?>
                        <div style="font-size: 12px; color: #736357;">Extras: <?= e($item['selected_extras']) ?></div>
                    <?php endif; ?>
                </td>
                <td style="text-align: center;"><?= intval($item['quantity']) ?></td>
                <td class="text-right"><?= format_naira($item['unit_price_kobo']) ?></td>
                <td class="text-right" style="font-weight: 600;"><?= format_naira($item['subtotal_kobo']) ?></td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <div style="max-width: 260px; margin-left: auto;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
            <span style="color: #736357;">Subtotal:</span>
            <span><?= format_naira($order['subtotal_kobo']) ?></span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
            <span style="color: #736357;">Delivery Fee:</span>
            <span><?= format_naira($order['delivery_fee_kobo']) ?></span>
        </div>
        <?php if ($order['discount_kobo'] > 0): ?>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; color: #1b5e20;">
            <span>Discount (<?= e($order['discount_code'] ?? 'PROMO') ?>):</span>
            <span>-<?= format_naira($order['discount_kobo']) ?></span>
        </div>
        <?php endif; ?>
        <div class="total-box" style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 800;">
            <span>Total Paid:</span>
            <span style="color: #e65100;"><?= format_naira($order['total_kobo']) ?></span>
        </div>
    </div>

    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed #e7dfd5; font-size: 12px; color: #736357;">
        <div><strong>Transaction Reference:</strong> <?= e($order['transaction_ref'] ?: 'N/A') ?></div>
        <div><strong>Payment Method:</strong> <?= strtoupper(e($order['payment_method'])) ?> (Verified Online)</div>
        <div><strong>Estimated Delivery:</strong> <?= e($order['estimated_delivery_time']) ?></div>
        <div style="margin-top: 8px; color: #1b5e20; font-weight: 600;">E sé gán! Thank you for ordering from NaijaChop. Enjoy your authentic Nigerian meal!</div>
    </div>

    <div class="actions">
        <button class="btn btn-print" onclick="window.print()">🖨️ Print Receipt</button>
        <button class="btn btn-outline" onclick="window.close()">Close Window</button>
    </div>
</div>

</body>
</html>
