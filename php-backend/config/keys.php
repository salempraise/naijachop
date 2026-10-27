<?php
/**
 * NaijaChop - Payment Gateway Configuration
 * Stores Paystack & Flutterwave credentials securely outside public webroot
 */

return [
    'paystack' => [
        'public_key'  => getenv('PAYSTACK_PUBLIC_KEY') ?: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'secret_key'  => getenv('PAYSTACK_SECRET_KEY') ?: 'sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'webhook_sec' => getenv('PAYSTACK_WEBHOOK_SECRET') ?: 'whsec_xxxxxxxxxxxxxxxxxxxx',
        'currency'    => 'NGN',
    ],
    'flutterwave' => [
        'public_key'  => getenv('FLUTTERWAVE_PUBLIC_KEY') ?: 'FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxx-X',
        'secret_key'  => getenv('FLUTTERWAVE_SECRET_KEY') ?: 'FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxxx-X',
        'encryption'  => getenv('FLUTTERWAVE_ENCRYPTION_KEY') ?: 'FLWSECK_TEST_ENC_KEY',
    ],
    'business' => [
        'name'    => 'NaijaChop Foods Limited',
        'address' => '14 Adeola Odeku Street, Victoria Island, Lagos, Nigeria',
        'phone'   => '+234 800 NAIJACHOP (+234 800 6245 22467)',
        'email'   => 'orders@naijachop.ng',
    ]
];
