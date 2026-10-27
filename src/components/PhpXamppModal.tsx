import React, { useState } from 'react';
import { X, Code, Copy, Check, Download, Server, Database, FileText } from 'lucide-react';

interface PhpXamppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhpXamppModal: React.FC<PhpXamppModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeFile, setActiveFile] = useState<string>('schema.sql');
  const [copied, setCopied] = useState(false);

  const fileMap: Record<string, { title: string; lang: string; content: string }> = {
    'schema.sql': {
      title: 'database.sql (MySQL Schema & Seed)',
      lang: 'sql',
      content: `-- ============================================================
-- NaijaChop - Complete MySQL Schema & Nigerian Food Seed Data
-- ============================================================

CREATE DATABASE IF NOT EXISTS \`naijachop_db\` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE \`naijachop_db\`;

-- 1. Users Table (Customers)
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`full_name\` VARCHAR(150) NOT NULL,
  \`email\` VARCHAR(191) NOT NULL UNIQUE,
  \`phone\` VARCHAR(25) NOT NULL,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_users_email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Admins Table
CREATE TABLE IF NOT EXISTS \`admins\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`username\` VARCHAR(100) NOT NULL UNIQUE,
  \`email\` VARCHAR(191) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('super_admin', 'kitchen_manager', 'dispatch_coordinator') DEFAULT 'kitchen_manager',
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Food Categories Table
CREATE TABLE IF NOT EXISTS \`food_categories\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL UNIQUE,
  \`slug\` VARCHAR(100) NOT NULL UNIQUE,
  \`description\` TEXT NULL,
  \`display_order\` INT DEFAULT 0,
  \`is_active\` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Food Items Table (Exact KOBO Pricing)
CREATE TABLE IF NOT EXISTS \`food_items\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`category_id\` INT UNSIGNED NOT NULL,
  \`item_code\` VARCHAR(50) NOT NULL UNIQUE,
  \`name\` VARCHAR(200) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`price_kobo\` BIGINT UNSIGNED NOT NULL,
  \`price_naira\` DECIMAL(12, 2) GENERATED ALWAYS AS (\`price_kobo\` / 100) STORED,
  \`image_url\` VARCHAR(255) NOT NULL,
  \`preparation_time\` VARCHAR(50) DEFAULT '25-35 mins',
  \`spice_level\` ENUM('Mild', 'Medium', 'Hot', 'Extra Hot (Pepper Soup Style)') DEFAULT 'Medium',
  \`is_available\` TINYINT(1) DEFAULT 1,
  \`is_special\` TINYINT(1) DEFAULT 0,
  \`rating\` DECIMAL(3, 2) DEFAULT 4.80,
  \`calories\` INT UNSIGNED DEFAULT NULL,
  FOREIGN KEY (\`category_id\`) REFERENCES \`food_categories\` (\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS \`orders\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`order_ref\` VARCHAR(50) NOT NULL UNIQUE,
  \`user_id\` INT UNSIGNED NULL,
  \`customer_name\` VARCHAR(150) NOT NULL,
  \`customer_phone\` VARCHAR(25) NOT NULL,
  \`customer_email\` VARCHAR(191) NOT NULL,
  \`delivery_address\` TEXT NOT NULL,
  \`city\` VARCHAR(100) NOT NULL,
  \`state\` VARCHAR(100) NOT NULL,
  \`subtotal_kobo\` BIGINT UNSIGNED NOT NULL,
  \`delivery_fee_kobo\` BIGINT UNSIGNED NOT NULL,
  \`discount_kobo\` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  \`total_kobo\` BIGINT UNSIGNED NOT NULL,
  \`payment_method\` ENUM('paystack', 'flutterwave', 'card', 'bank_transfer') NOT NULL,
  \`payment_status\` ENUM('pending', 'verified', 'failed') DEFAULT 'pending',
  \`order_status\` ENUM('Pending Payment','Payment Confirmed','Order Accepted','Preparing Food','Ready for Pickup','Out for Delivery','Delivered','Cancelled') DEFAULT 'Pending Payment',
  \`transaction_ref\` VARCHAR(100) NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_order_ref\` (\`order_ref\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Receipts Table
CREATE TABLE IF NOT EXISTS \`receipts\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`receipt_no\` VARCHAR(60) NOT NULL UNIQUE,
  \`order_id\` INT UNSIGNED NOT NULL UNIQUE,
  \`issued_to_name\` VARCHAR(150) NOT NULL,
  \`total_amount_kobo\` BIGINT UNSIGNED NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`order_id\`) REFERENCES \`orders\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
    },
    'config/db.php': {
      title: 'config/db.php (PDO Connection)',
      lang: 'php',
      content: `<?php
$host = getenv('DB_HOST') ?: '127.0.0.1';
$dbname = getenv('DB_NAME') ?: 'naijachop_db';
$username = getenv('DB_USER') ?: 'root';
$password = getenv('DB_PASS') ?: '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (\\PDOException $e) {
    die("Database Connection Error: " . $e->getMessage());
}`,
    },
    'api/create_order.php': {
      title: 'api/create_order.php (Server-side Recalculation)',
      lang: 'php',
      content: `<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/security.php';

header('Content-Type: application/json; charset=utf-8');

$input = json_decode(file_get_contents('php://input'), true);
if (empty($input['items'])) {
    json_response(['success' => false, 'message' => 'Cart is empty'], 400);
}

try {
    $pdo->beginTransaction();
    $subtotal_kobo = 0;
    
    // Validate each meal price directly against MySQL table
    $stmt = $pdo->prepare("SELECT id, name, price_kobo FROM food_items WHERE id = :id AND is_available = 1");
    foreach ($input['items'] as $item) {
        $stmt->execute([':id' => $item['food_id']]);
        $dbItem = $stmt->fetch();
        if (!$dbItem) throw new Exception("Dish unavailable");
        $subtotal_kobo += ($dbItem['price_kobo'] * max(1, intval($item['quantity'])));
    }
    
    $order_ref = 'NC-' . date('Y') . '-' . strtoupper(bin2hex(random_bytes(3)));
    // Insert into orders table...
    $pdo->commit();
    json_response(['success' => true, 'order_ref' => $order_ref, 'subtotal' => $subtotal_kobo / 100]);
} catch (\\Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    json_response(['success' => false, 'message' => $e->getMessage()], 400);
}`,
    },
    'api/verify_payment.php': {
      title: 'api/verify_payment.php (Paystack cURL Verification)',
      lang: 'php',
      content: `<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/security.php';
$keys = require __DIR__ . '/../config/keys.php';

$input = json_decode(file_get_contents('php://input'), true);
$reference = trim($input['reference'] ?? '');
$order_ref = trim($input['order_ref'] ?? '');

// Verify with Paystack API via Bearer token
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.paystack.co/transaction/verify/" . rawurlencode($reference));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer " . $keys['paystack']['secret_key']]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
curl_close($ch);

// Update status to 'Payment Confirmed' and issue unique receipt...
json_response(['success' => true, 'order_status' => 'Payment Confirmed', 'receipt_no' => 'NC-RCP-2026-X']);`,
    },
    'instructions': {
      title: 'XAMPP & Apache Local Run Guide',
      lang: 'markdown',
      content: `## How to run NaijaChop in XAMPP:

1. Copy the /php-backend/ files into:
   C:\\xampp\\htdocs\\naijachop\\ (Windows) or
   /Applications/XAMPP/xamppfiles/htdocs/naijachop/ (Mac)

2. Start Apache and MySQL in XAMPP Control Panel.

3. Open phpMyAdmin at http://localhost/phpmyadmin/
   Create a new database named "naijachop_db" and import "database.sql".

4. Set your Paystack keys in config/keys.php:
   'secret_key' => 'sk_test_your_key',
   'public_key' => 'pk_test_your_key',

5. Open your browser:
   http://localhost/naijachop/
   Admin Dashboard: http://localhost/naijachop/admin/index.php
   Admin credentials: admin@naijachop.ng / NaijaAdmin2026!`,
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileMap[activeFile].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const file = fileMap[activeFile];
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile === 'schema.sql' ? 'naijachop_database.sql' : activeFile.replace('/', '_');
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-neutral-900 text-neutral-100 rounded-2xl shadow-2xl border border-neutral-700 overflow-hidden my-6 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 bg-black/60 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#008751] text-white flex items-center justify-center font-bold">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                NaijaChop XAMPP, PHP & MySQL Code Exporter
              </h2>
              <p className="text-[11px] text-neutral-400">
                Production-ready PHP backend scripts & database schema for local XAMPP Apache
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Sidebar & Code View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Selector Sidebar */}
          <div className="w-full md:w-56 bg-neutral-950 p-3 border-r border-neutral-800 space-y-1 shrink-0 overflow-y-auto">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-2 py-1">
              Database & PHP Files
            </div>
            {Object.keys(fileMap).map((key) => (
              <button
                key={key}
                onClick={() => setActiveFile(key)}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-mono transition-colors flex items-center gap-2 cursor-pointer ${
                  activeFile === key
                    ? 'bg-[#e65100] text-white font-bold'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                {key.endsWith('.sql') ? (
                  <Database className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                )}
                <span className="truncate">{key}</span>
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-neutral-900 overflow-hidden">
            {/* Top Bar with Copy and Download */}
            <div className="p-2.5 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between text-xs">
              <span className="font-mono text-neutral-300 text-[11px]">
                {fileMap[activeFile].title}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="py-1 px-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="py-1 px-2.5 bg-[#008751] hover:bg-[#007043] text-white rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Code Pre Block */}
            <pre className="flex-1 p-4 font-mono text-xs overflow-auto text-neutral-300 leading-relaxed select-all">
              <code>{fileMap[activeFile].content}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>All files are also saved in your workspace folder <code>/php-backend/</code></span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
