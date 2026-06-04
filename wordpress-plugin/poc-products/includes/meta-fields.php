<?php
defined( 'ABSPATH' ) || exit;

// ── Register meta for REST API exposure ──────────────────────────────────────

add_action( 'init', 'poc_register_meta_fields' );
function poc_register_meta_fields(): void {
    register_post_meta( 'product', 'poc_neck', [
        'type'              => 'string',
        'single'            => true,
        'show_in_rest'      => true,
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
    ] );

    // Stored as a JSON string; headless.php decodes it to an array for the REST response.
    register_post_meta( 'product', 'poc_specs', [
        'type'         => 'string',
        'single'       => true,
        'show_in_rest' => true,
        'default'      => '[]',
    ] );
}

// ── Meta boxes ────────────────────────────────────────────────────────────────

add_action( 'add_meta_boxes', 'poc_add_meta_boxes' );
function poc_add_meta_boxes(): void {
    add_meta_box( 'poc_neck_type', 'Neck Type', 'poc_render_neck_metabox', 'product', 'side' );
    add_meta_box( 'poc_specs_table', 'Specifications', 'poc_render_specs_metabox', 'product', 'normal' );
}

function poc_render_neck_metabox( WP_Post $post ): void {
    $value = get_post_meta( $post->ID, 'poc_neck', true );
    wp_nonce_field( 'poc_save_meta', 'poc_meta_nonce' );
    ?>
    <select name="poc_neck" style="width:100%">
        <option value="">— Select —</option>
        <option value="Screw"   <?php selected( $value, 'Screw' ); ?>>Screw</option>
        <option value="Snap On" <?php selected( $value, 'Snap On' ); ?>>Snap On</option>
    </select>
    <?php
}

function poc_render_specs_metabox( WP_Post $post ): void {
    $json    = get_post_meta( $post->ID, 'poc_specs', true ) ?: '[]';
    $rows    = json_decode( $json, true ) ?: [];
    $columns = poc_specs_columns();
    ?>
    <div id="poc-specs-wrap">
        <table id="poc-specs-table" style="width:100%;border-collapse:collapse;font-size:13px">
            <thead>
                <tr style="background:#1e3a6e;color:#fff">
                    <?php foreach ( $columns as $label ) : ?>
                    <th style="padding:6px 8px;text-align:center;border:1px solid #ddd;font-weight:600">
                        <?php echo esc_html( $label ); ?>
                    </th>
                    <?php endforeach; ?>
                    <th style="padding:6px 8px;width:28px;border:1px solid #ddd"></th>
                </tr>
            </thead>
            <tbody id="poc-specs-body">
                <?php foreach ( $rows as $i => $row ) : ?>
                <tr>
                    <?php foreach ( array_keys( $columns ) as $key ) : ?>
                    <td style="padding:3px;border:1px solid #eee">
                        <input type="text"
                               name="poc_specs[<?php echo $i; ?>][<?php echo esc_attr( $key ); ?>]"
                               value="<?php echo esc_attr( $row[ $key ] ?? '' ); ?>"
                               style="width:100%;box-sizing:border-box">
                    </td>
                    <?php endforeach; ?>
                    <td style="padding:3px;border:1px solid #eee;text-align:center">
                        <button type="button" class="poc-remove-row"
                                style="background:none;border:none;cursor:pointer;color:#a00;font-size:18px;line-height:1">&times;</button>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <p>
            <button type="button" id="poc-add-row" class="button button-secondary" style="margin-top:8px">
                + Add Row
            </button>
        </p>
    </div>

    <script>
    (function () {
        var body = document.getElementById('poc-specs-body');
        var keys = <?php echo wp_json_encode( array_keys( $columns ) ); ?>;

        document.getElementById('poc-add-row').addEventListener('click', function () {
            var idx = body.querySelectorAll('tr').length;
            var tr  = document.createElement('tr');

            keys.forEach(function (key) {
                var td    = document.createElement('td');
                td.style.cssText = 'padding:3px;border:1px solid #eee';
                var input = document.createElement('input');
                input.type = 'text';
                input.name = 'poc_specs[' + idx + '][' + key + ']';
                input.style.cssText = 'width:100%;box-sizing:border-box';
                td.appendChild(input);
                tr.appendChild(td);
            });

            var removeTd  = document.createElement('td');
            removeTd.style.cssText = 'padding:3px;border:1px solid #eee;text-align:center';
            var removeBtn = document.createElement('button');
            removeBtn.type      = 'button';
            removeBtn.className = 'poc-remove-row';
            removeBtn.style.cssText = 'background:none;border:none;cursor:pointer;color:#a00;font-size:18px;line-height:1';
            removeBtn.innerHTML = '&times;';
            removeTd.appendChild(removeBtn);
            tr.appendChild(removeTd);
            body.appendChild(tr);
        });

        body.addEventListener('click', function (e) {
            if (e.target.classList.contains('poc-remove-row')) {
                e.target.closest('tr').remove();
                reindex();
            }
        });

        function reindex() {
            body.querySelectorAll('tr').forEach(function (tr, idx) {
                tr.querySelectorAll('input').forEach(function (input) {
                    input.name = input.name.replace(/poc_specs\[\d+\]/, 'poc_specs[' + idx + ']');
                });
            });
        }
    })();
    </script>
    <?php
}

// ── Save ──────────────────────────────────────────────────────────────────────

add_action( 'save_post_product', 'poc_save_meta_fields' );
function poc_save_meta_fields( int $post_id ): void {
    if ( ! isset( $_POST['poc_meta_nonce'] ) || ! wp_verify_nonce( $_POST['poc_meta_nonce'], 'poc_save_meta' ) ) {
        return;
    }
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }
    if ( ! current_user_can( 'edit_post', $post_id ) ) {
        return;
    }

    // Neck (whitelist-validated).
    $neck = sanitize_text_field( $_POST['poc_neck'] ?? '' );
    if ( in_array( $neck, [ 'Screw', 'Snap On', '' ], true ) ) {
        update_post_meta( $post_id, 'poc_neck', $neck );
    }

    // Specs.
    $raw  = $_POST['poc_specs'] ?? [];
    $keys = array_keys( poc_specs_columns() );
    $clean = [];
    if ( is_array( $raw ) ) {
        foreach ( $raw as $row ) {
            if ( ! is_array( $row ) ) {
                continue;
            }
            $clean_row = [];
            foreach ( $keys as $key ) {
                $clean_row[ $key ] = sanitize_text_field( $row[ $key ] ?? '' );
            }
            if ( ! empty( array_filter( $clean_row ) ) ) {
                $clean[] = $clean_row;
            }
        }
    }
    update_post_meta( $post_id, 'poc_specs', wp_json_encode( $clean ) );
}

// ── Shared column definition ──────────────────────────────────────────────────

function poc_specs_columns(): array {
    return [
        'item'             => 'Item',
        'capacity'         => 'Capacity(ml)',
        'dosage'           => 'Dosage(cc)',
        'height'           => 'Height(mm)',
        'diameter'         => 'Diameter(mm)',
        'body_height'      => 'Body Height(mm)',
        'pump_options'     => 'Pump Option/s',
        'special_function' => 'Special Function',
    ];
}
