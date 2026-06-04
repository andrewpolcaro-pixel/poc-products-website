<?php
defined( 'ABSPATH' ) || exit;

// ── CORS for the REST API ─────────────────────────────────────────────────────

add_action( 'rest_api_init', function () {
    remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );

    add_filter( 'rest_pre_serve_request', function ( $value ) {
        $allowed_origins = array_filter( [
            defined( 'POC_FRONTEND_URL' ) ? POC_FRONTEND_URL : null,
            getenv( 'POC_FRONTEND_URL' ) ?: null,
        ] );

        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if ( $origin && ( empty( $allowed_origins ) || in_array( $origin, $allowed_origins, true ) ) ) {
            header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ) );
        } elseif ( empty( $allowed_origins ) ) {
            // During development allow all origins until POC_FRONTEND_URL is set.
            header( 'Access-Control-Allow-Origin: *' );
        }

        header( 'Access-Control-Allow-Methods: GET, OPTIONS' );
        header( 'Access-Control-Allow-Credentials: true' );
        header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce' );
        header( 'Vary: Origin' );

        return $value;
    } );
}, 15 );

// Handle OPTIONS preflight before WP processes the request.
add_action( 'init', function () {
    if ( isset( $_SERVER['REQUEST_METHOD'] ) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS' ) {
        if ( isset( $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] ) ) {
            header( 'Access-Control-Allow-Origin: *' );
            header( 'Access-Control-Allow-Methods: GET, OPTIONS' );
            header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce' );
            header( 'Access-Control-Max-Age: 86400' );
            status_header( 204 );
            exit;
        }
    }
} );

// ── Redirect all frontend requests to the Next.js site ────────────────────────

add_action( 'template_redirect', function () {
    // Only redirect public-facing pages; leave admin and REST API alone.
    if ( is_admin() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
        return;
    }

    $frontend_url = defined( 'POC_FRONTEND_URL' )
        ? POC_FRONTEND_URL
        : ( getenv( 'POC_FRONTEND_URL' ) ?: '' );

    if ( empty( $frontend_url ) ) {
        return; // No frontend URL set — do not redirect.
    }

    $redirect = trailingslashit( $frontend_url );

    if ( is_singular( 'product' ) ) {
        $redirect = trailingslashit( $frontend_url ) . 'products/' . get_post_field( 'post_name', get_the_ID() );
    } elseif ( is_post_type_archive( 'product' ) ) {
        $redirect = trailingslashit( $frontend_url ) . 'products';
    }

    wp_redirect( $redirect, 301 );
    exit;
} );

// ── Disable unnecessary frontend bloat ───────────────────────────────────────

// Disable XML-RPC.
add_filter( 'xmlrpc_enabled', '__return_false' );

// Remove WordPress version from headers.
remove_action( 'wp_head', 'wp_generator' );

// Disable default comments on the product CPT (not needed for catalog).
add_action( 'init', function () {
    remove_post_type_support( 'product', 'comments' );
    remove_post_type_support( 'product', 'trackbacks' );
} );

// ── Expose featured image URL directly in the products REST response ──────────

add_filter( 'rest_prepare_product', function ( WP_REST_Response $response, WP_Post $post ) {
    // Featured image URL.
    $thumbnail_id = get_post_thumbnail_id( $post->ID );
    if ( $thumbnail_id ) {
        $src = wp_get_attachment_image_src( $thumbnail_id, 'large' );
        $response->data['featured_image_url'] = $src ? $src[0] : null;
    } else {
        $response->data['featured_image_url'] = null;
    }

    // Decode poc_specs from JSON string → array so the REST client gets native JSON.
    if ( isset( $response->data['meta']['poc_specs'] ) ) {
        $decoded = json_decode( $response->data['meta']['poc_specs'], true );
        $response->data['meta']['poc_specs'] = is_array( $decoded ) ? $decoded : [];
    }

    return $response;
}, 10, 2 );
