<?php
/**
 * Plugin Name: POC Products
 * Plugin URI:  https://github.com/andrewpolcaro-pixel/poc-products-website
 * Description: B2B product catalog CPT with headless WordPress mode.
 * Version:     1.0.0
 * Author:      Andrew Polcaro
 * License:     GPL-2.0-or-later
 * Text Domain: poc-products
 */

defined( 'ABSPATH' ) || exit;

define( 'POC_PRODUCTS_DIR', plugin_dir_path( __FILE__ ) );

require_once POC_PRODUCTS_DIR . 'includes/post-type.php';
require_once POC_PRODUCTS_DIR . 'includes/taxonomies.php';
require_once POC_PRODUCTS_DIR . 'includes/meta-fields.php';
require_once POC_PRODUCTS_DIR . 'includes/headless.php';
require_once POC_PRODUCTS_DIR . 'includes/preview.php';

register_activation_hook( __FILE__, function () {
    poc_products_register_post_type();
    poc_products_register_taxonomies();
    flush_rewrite_rules();
} );

register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );
