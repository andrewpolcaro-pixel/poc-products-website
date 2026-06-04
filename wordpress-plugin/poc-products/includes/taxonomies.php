<?php
defined( 'ABSPATH' ) || exit;

add_action( 'init', 'poc_products_register_taxonomies' );

function poc_products_register_taxonomies() {

    // ── Hierarchical ──────────────────────────────────────────────────────────

    register_taxonomy( 'product_category', 'product', [
        'labels'       => poc_tax_labels( 'Category', 'Categories' ),
        'hierarchical' => true,
        'show_in_rest' => true,
        'rest_base'    => 'product-categories',
        'rewrite'      => [ 'slug' => 'product-category' ],
    ] );

    // ── Flat / attribute taxonomies ───────────────────────────────────────────

    $flat_taxonomies = [
        'product_tag'              => [ 'Tag',               'Tags',               'product-tags'               ],
        'product_series'           => [ 'Series',            'Series',             'product-series'             ],
        'product_cap_material'     => [ 'Cap Material',      'Cap Materials',      'product-cap-materials'      ],
        'product_actuator_material'=> [ 'Actuator Material', 'Actuator Materials', 'product-actuator-materials' ],
        'product_pump_body_material'=> ['Pump Body Material','Pump Body Materials','product-pump-body-materials'],
        'product_bottle_material'  => [ 'Bottle Material',   'Bottle Materials',   'product-bottle-materials'   ],
        'product_sustainable'      => [ 'Sustainable',       'Sustainable',        'product-sustainable'        ],
        'product_markets'          => [ 'Markets',           'Markets',            'product-markets'            ],
    ];

    foreach ( $flat_taxonomies as $taxonomy => [ $singular, $plural, $rest_base ] ) {
        register_taxonomy( $taxonomy, 'product', [
            'labels'       => poc_tax_labels( $singular, $plural ),
            'hierarchical' => false,
            'show_in_rest' => true,
            'rest_base'    => $rest_base,
            'rewrite'      => [ 'slug' => $rest_base ],
        ] );
    }
}

function poc_tax_labels( string $singular, string $plural ): array {
    return [
        'name'          => $plural,
        'singular_name' => $singular,
        'search_items'  => "Search {$plural}",
        'all_items'     => "All {$plural}",
        'edit_item'     => "Edit {$singular}",
        'update_item'   => "Update {$singular}",
        'add_new_item'  => "Add New {$singular}",
        'new_item_name' => "New {$singular} Name",
        'menu_name'     => $plural,
    ];
}
