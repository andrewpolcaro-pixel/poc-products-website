<?php
defined( 'ABSPATH' ) || exit;

add_action( 'init', 'poc_products_register_post_type' );

function poc_products_register_post_type() {
    register_post_type( 'product', [
        'labels'       => [
            'name'               => __( 'Products', 'poc-products' ),
            'singular_name'      => __( 'Product', 'poc-products' ),
            'add_new'            => __( 'Add New', 'poc-products' ),
            'add_new_item'       => __( 'Add New Product', 'poc-products' ),
            'edit_item'          => __( 'Edit Product', 'poc-products' ),
            'new_item'           => __( 'New Product', 'poc-products' ),
            'view_item'          => __( 'View Product', 'poc-products' ),
            'search_items'       => __( 'Search Products', 'poc-products' ),
            'not_found'          => __( 'No products found', 'poc-products' ),
            'not_found_in_trash' => __( 'No products found in trash', 'poc-products' ),
            'menu_name'          => __( 'Products', 'poc-products' ),
        ],
        'public'            => true,
        'has_archive'       => true,
        'supports'          => [ 'title', 'editor', 'thumbnail' ],
        'show_in_rest'      => true,
        'rest_base'         => 'products',
        'menu_icon'         => 'dashicons-products',
        'rewrite'           => [ 'slug' => 'products' ],
        'show_in_nav_menus' => true,
    ] );
}
