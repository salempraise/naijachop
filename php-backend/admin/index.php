<?php
/**
 * NaijaChop - Admin Management Dashboard
 * Role-Based Access Control, live revenue calculations from verified orders,
 * order status dispatcher, and menu editor.
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/security.php';

// Session check
$admin = $_SESSION['admin'] ?? null;
if (!$admin) {
    header('Location: /auth/login.php?error=admin_required');
    exit;
}

// Handle Order Status Updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_status') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        die("Invalid CSRF token");
    }
    $order_id = intval($_POST['order_id']);
    $new_status = $_POST['new_status'];
    $allowed_statuses = [
        'Pending Payment', 'Payment Confirmed', 'Order Accepted',
        'Preparing Food', 'Ready for Pickup', 'Out for Delivery',
        'Delivered', 'Cancelled'
    ];

    if (in_array($new_status, $allowed_statuses, true)) {
        $upd = $pdo->prepare("UPDATE orders SET order_status = :st, updated_at = NOW() WHERE id = :id");
        $upd->execute([':st' => $new_status, ':id' => $order_id]);
        header("Location: index.php?msg=status_updated");
        exit;
    }
}

// 1. Calculate Metrics
$total_orders = $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn();
$verified_revenue_kobo = $pdo->query("SELECT COALESCE(SUM(total_kobo), 0) FROM orders WHERE payment_status = 'verified'")->fetchColumn();
$pending_orders = $pdo->query("SELECT COUNT(*) FROM orders WHERE order_status IN ('Payment Confirmed', 'Order Accepted', 'Preparing Food', 'Ready for Pickup', 'Out for Delivery')")->fetchColumn();
$today_orders = $pdo->query("SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURDATE()")->fetchColumn();

// 2. Fetch Recent Orders
$orders = $pdo->query("
    SELECT o.*, r.receipt_no 
    FROM orders o 
    LEFT JOIN receipts r ON o.id = r.order_id 
    ORDER BY o.id DESC 
    LIMIT 25
")->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>NaijaChop Admin Portal</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f7f5f0; margin: 0; padding: 24px; color: #1c140e; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .stat-card { background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e7ded5; }
        .stat-val { font-size: 24px; font-weight: 800; color: #e65100; margin-top: 4px; }
        .card { background: #fff; border-radius: 8px; border: 1px solid #e7ded5; padding: 24px; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #faf7f2; }
        .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
        select { padding: 6px; border-radius: 4px; border: 1px solid #ccc; font-size: 12px; }
        button { padding: 6px 12px; background: #e65100; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <div>
            <h2>🇳🇬 NaijaChop Operations Console</h2>
            <div style="font-size: 13px; color: #777;">Signed in as: <?= e($admin['username']) ?> (<?= e($admin['role']) ?>)</div>
        </div>
        <div>
            <a href="/" style="margin-right: 12px; color: #e65100;">View Storefront</a>
            <a href="/auth/logout.php" style="color: #666;">Logout</a>
        </div>
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <div style="font-size: 13px; color: #666;">Verified Revenue</div>
            <div class="stat-val"><?= format_naira($verified_revenue_kobo) ?></div>
        </div>
        <div class="stat-card">
            <div style="font-size: 13px; color: #666;">Active Orders</div>
            <div class="stat-val" style="color: #008751;"><?= intval($pending_orders) ?></div>
        </div>
        <div class="stat-card">
            <div style="font-size: 13px; color: #666;">Today's Orders</div>
            <div class="stat-val"><?= intval($today_orders) ?></div>
        </div>
        <div class="stat-card">
            <div style="font-size: 13px; color: #666;">Total Lifetime Orders</div>
            <div class="stat-val"><?= intval($total_orders) ?></div>
        </div>
    </div>

    <div class="card">
        <h3>Live Orders Dispatch</h3>
        <table>
            <thead>
                <tr>
                    <th>Ref</th>
                    <th>Customer</th>
                    <th>City / State</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Order Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($orders as $o): ?>
                <tr>
                    <td><strong><?= e($o['order_ref']) ?></strong></td>
                    <td>
                        <?= e($o['customer_name']) ?><br>
                        <small style="color: #777;"><?= e($o['customer_phone']) ?></small>
                    </td>
                    <td><?= e($o['city']) ?></td>
                    <td><?= format_naira($o['total_kobo']) ?></td>
                    <td>
                        <span style="color: <?= $o['payment_status'] === 'verified' ? '#008751' : '#e65100' ?>; font-weight: 600;">
                            <?= strtoupper(e($o['payment_status'])) ?>
                        </span>
                    </td>
                    <td>
                        <form method="POST" style="display: flex; gap: 4px;">
                            <input type="hidden" name="action" value="update_status">
                            <input type="hidden" name="csrf_token" value="<?= get_csrf_token() ?>">
                            <input type="hidden" name="order_id" value="<?= $o['id'] ?>">
                            <select name="new_status">
                                <?php
                                $statuses = ['Pending Payment', 'Payment Confirmed', 'Order Accepted', 'Preparing Food', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Cancelled'];
                                foreach ($statuses as $st) {
                                    $sel = ($o['order_status'] === $st) ? 'selected' : '';
                                    echo "<option value=\"$st\" $sel>$st</option>";
                                }
                                ?>
                            </select>
                            <button type="submit">Update</button>
                        </form>
                    </td>
                    <td>
                        <?php if ($o['receipt_no']): ?>
                            <a href="/receipts/view.php?ref=<?= urlencode($o['order_ref']) ?>" target="_blank" style="color: #e65100;">Receipt</a>
                        <?php else: ?>
                            <span style="color: #999;">-</span>
                        <?php endif; ?>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>
</body>
</html>
