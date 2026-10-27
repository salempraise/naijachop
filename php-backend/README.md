# NaijaChop - Nigerian Food Delivery (XAMPP / PHP / MySQL Guide)

Welcome to **NaijaChop**! This package contains the full backend PHP scripts, database schema, and payment processing endpoints for deployment on **XAMPP (Apache + MySQL)** and **VS Code**.

---

## 1. Prerequisites
- **XAMPP** (PHP 8.1+ & MySQL/MariaDB) installed from [apachefriends.org](https://www.apachefriends.org).
- **VS Code** with the *PHP Intelephense* extension.
- **Paystack Test Account** ([dashboard.paystack.com](https://dashboard.paystack.com)) or Flutterwave account.

---

## 2. Step-by-Step Installation

### Step 1: Copy Files to XAMPP Webroot
Copy the contents of the `php-backend` directory into your XAMPP `htdocs` directory:
```bash
# Windows
C:\xampp\htdocs\naijachop\

# macOS
/Applications/XAMPP/xamppfiles/htdocs/naijachop/

# Linux
/opt/lampp/htdocs/naijachop/
```

### Step 2: Start Apache and MySQL in XAMPP Control Panel
1. Open the **XAMPP Control Panel**.
2. Click **Start** for **Apache**.
3. Click **Start** for **MySQL**.

### Step 3: Create & Import Database via phpMyAdmin
1. Open your browser and navigate to: `http://localhost/phpmyadmin/`.
2. Click on the **Databases** tab.
3. In **Create database**, enter `naijachop_db` with Collation `utf8mb4_unicode_ci`, and click **Create**.
4. Select `naijachop_db` from the left sidebar and click the **Import** tab.
5. Browse and select `database.sql` (located in this directory or in `src/data/schema.sql`).
6. Click **Import** at the bottom.
7. All 11 tables will be created with sample dishes, discount codes, admin account, and FAQs.

### Step 4: Configure Database & Payment Keys
Open `config/db.php` and `config/keys.php`:
```php
// config/db.php
$host = '127.0.0.1';
$dbname = 'naijachop_db';
$username = 'root'; // default XAMPP user
$password = '';     // default XAMPP password is empty

// config/keys.php
// Replace with your real Paystack Secret Key from your dashboard
'secret_key' => 'sk_test_your_real_paystack_secret_key',
'public_key' => 'pk_test_your_real_paystack_public_key',
```

### Step 5: Test the Endpoints
- **Storefront & Menu API**: `http://localhost/naijachop/api/foods.php`
- **Chatbot API**: `http://localhost/naijachop/api/chatbot.php`
- **Admin Dashboard**: `http://localhost/naijachop/admin/index.php`
  - Default Admin Email: `admin@naijachop.ng`
  - Default Admin Password: `NaijaAdmin2026!`

---

## 3. Production Security Checklist
1. **Never commit secret keys**: Store your Paystack and Flutterwave Secret Keys in an `.env` file outside the public web root.
2. **Kobo Arithmetic**: All transactions calculate in integer Kobo (`total * 100`) to eliminate floating-point penny loss.
3. **Prepared Statements**: All database operations use PDO prepared statements to block SQL injection.
4. **Idempotent Webhooks**: Payment verification checks order `payment_status` before issuing receipt records.
