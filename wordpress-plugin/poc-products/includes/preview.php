<?php
defined( 'ABSPATH' ) || exit;

/**
 * Redirect the Gutenberg "Preview" button to the Next.js draft-mode URL.
 * Requires POC_FRONTEND_URL and POC_PREVIEW_SECRET to be defined in wp-config.php.
 */
add_filter( 'preview_post_link', 'poc_headless_preview_link', 10, 2 );

function poc_headless_preview_link( string $preview_link, WP_Post $post ): string {
    if ( $post->post_type !== 'product' ) {
        return $preview_link;
    }

    $frontend_url   = defined( 'POC_FRONTEND_URL' )   ? POC_FRONTEND_URL   : ( getenv( 'POC_FRONTEND_URL' ) ?: '' );
    $preview_secret = defined( 'POC_PREVIEW_SECRET' ) ? POC_PREVIEW_SECRET : ( getenv( 'POC_PREVIEW_SECRET' ) ?: '' );

    if ( empty( $frontend_url ) || empty( $preview_secret ) ) {
        return $preview_link;
    }

    // Use the auto-saved slug, or derive one from the title for brand-new drafts.
    $slug = $post->post_name ?: sanitize_title( $post->post_title );

    return add_query_arg(
        [
            'secret' => rawurlencode( $preview_secret ),
            'slug'   => rawurlencode( $slug ),
            'id'     => $post->ID,
        ],
        trailingslashit( $frontend_url ) . 'api/preview'
    );
}
