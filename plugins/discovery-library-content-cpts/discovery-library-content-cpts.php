<?php
/**
 * Plugin Name: Discovery Library Content CPTs
 * Description: Registers Discovery Library content types (Training Videos, Upcoming Sessions, Useful Links & Videos, Newsletters) with per-post and per-field REST visibility controls.
 * Version: 1.2.0
 * Author: Nurul Islam
 * Requires at least: 5.6
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*
 * Unique class name + existence check: avoids fatal "cannot redeclare class"
 * errors if the file is loaded twice (plugin + snippet, duplicate copy, etc.).
 */
if ( ! class_exists( 'Discovery_Library_Content_CPTs', false ) ) {

	final class Discovery_Library_Content_CPTs {

		const VERSION        = '1.2.0';
		const NONCE_ACTION   = 'dl_save_content_meta';
		const NONCE_NAME     = 'dl_content_meta_nonce';
		const VERSION_OPTION = 'dl_content_cpts_version';

		/**
		 * Field types: textarea | text (single line) | url | date | time
		 * 'media' => true adds a "Select file" button (Media Library) to a url field.
		 */
		private static $post_types = array(
			'training_video' => array(
				'singular' => 'Training Video',
				'plural'   => 'Training Videos',
				'menu'     => 'Training Videos',
				'icon'     => 'dashicons-video-alt3',
				'position' => 21,
				'fields'   => array(
					'description' => array( 'label' => 'Description', 'type' => 'textarea' ),
					'video_url'   => array( 'label' => 'Video URL', 'type' => 'url' ),
					'quiz_link'   => array( 'label' => 'Quiz Link', 'type' => 'url' ),
				),
			),
			'upcoming_session' => array(
				'singular' => 'Upcoming Session',
				'plural'   => 'Upcoming Sessions',
				'menu'     => 'Upcoming Sessions',
				'icon'     => 'dashicons-calendar-alt',
				'position' => 22,
				'fields'   => array(
					'session_date' => array( 'label' => 'Session Date', 'type' => 'date' ),
					'session_time' => array(
						'label'       => 'Session Time',
						'type'        => 'text',
						'placeholder' => 'e.g. 12:45 AM AEST',
					),
					'description'  => array( 'label' => 'Description', 'type' => 'textarea' ),
					'video_url'    => array( 'label' => 'Video URL', 'type' => 'url' ),
				),
			),
			'useful_link_video' => array(
				'singular' => 'Useful Link / Video',
				'plural'   => 'Useful Links & Videos',
				'menu'     => 'Useful Links & Videos',
				'icon'     => 'dashicons-admin-links',
				'position' => 23,
				'fields'   => array(
					'video_url' => array( 'label' => 'Video URL / Link URL', 'type' => 'url' ),
				),
			),
			'newsletter' => array(
				'singular' => 'Newsletter',
				'plural'   => 'Newsletters',
				'menu'     => 'Newsletters',
				'icon'     => 'dashicons-email-alt',
				'position' => 24,
				'fields'   => array(
					'newsletter_date' => array( 'label' => 'Newsletter Date', 'type' => 'date' ),
					'file_url'        => array(
						'label' => 'File URL',
						'type'  => 'url',
						'media' => true,
						'help'  => 'Paste a link or choose a file from the Media Library (PDF, etc.).',
					),
				),
			),
		);

		/* ------------------------------------------------------------------
		 * Bootstrap
		 * ---------------------------------------------------------------- */

		public static function init() {
			add_action( 'init', array( __CLASS__, 'safe_register_post_types' ), 5 );
			add_action( 'init', array( __CLASS__, 'safe_register_meta' ), 6 );
			add_action( 'init', array( __CLASS__, 'maybe_flush_rewrite_rules' ), 99 );

			add_action( 'add_meta_boxes', array( __CLASS__, 'safe_add_meta_boxes' ) );
			add_action( 'save_post', array( __CLASS__, 'safe_save_meta' ), 10, 2 );
			add_action( 'admin_enqueue_scripts', array( __CLASS__, 'safe_enqueue_admin_assets' ) );

			// Classic editor for these types: title + our meta box only, saves reliably.
			add_filter( 'use_block_editor_for_post_type', array( __CLASS__, 'disable_block_editor' ), 10, 2 );

			foreach ( array_keys( self::$post_types ) as $post_type ) {
				add_filter( 'rest_' . $post_type . '_query', array( __CLASS__, 'safe_filter_hidden_posts' ), 10, 2 );
				add_filter( 'rest_prepare_' . $post_type, array( __CLASS__, 'safe_filter_rest_fields' ), 10, 3 );
				add_filter( 'manage_' . $post_type . '_posts_columns', array( __CLASS__, 'add_columns' ) );
				add_action( 'manage_' . $post_type . '_posts_custom_column', array( __CLASS__, 'render_column' ), 10, 2 );
			}
		}

		/**
		 * Log details only when WordPress debug logging is enabled.
		 */
		private static function log_error( $context, $error ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG && defined( 'WP_DEBUG_LOG' ) && WP_DEBUG_LOG ) {
				$message = is_object( $error ) && method_exists( $error, 'getMessage' )
					? $error->getMessage()
					: (string) $error;
				error_log( '[Discovery Library CPTs][' . sanitize_key( $context ) . '] ' . $message );
			}
		}

		/* ------------------------------------------------------------------
		 * Helpers
		 * ---------------------------------------------------------------- */

		/**
		 * Is a visibility flag ON for this post?
		 * - Never saved            => ON (default)
		 * - Saved '1' / 1 / true   => ON
		 * - Saved anything else    => OFF (includes '' written by older versions)
		 */
		private static function flag_on( $post_id, $key ) {
			if ( ! metadata_exists( 'post', $post_id, $key ) ) {
				return true;
			}
			return in_array( get_post_meta( $post_id, $key, true ), array( '1', 1, true ), true );
		}

		public static function sanitize_flag( $value ) {
			return rest_sanitize_boolean( $value ) ? '1' : '0';
		}

		private static function sanitize_date( $value ) {
			$value = trim( (string) $value );
			$date  = DateTime::createFromFormat( '!Y-m-d', $value );
			return ( $date && $date->format( 'Y-m-d' ) === $value ) ? $value : '';
		}

		private static function sanitize_time( $value ) {
			$value = trim( (string) $value );
			return preg_match( '/^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/', $value ) ? $value : '';
		}

		public static function sanitize_by_type( $value, $type ) {
			if ( ! is_scalar( $value ) ) {
				return '';
			}
			$value = trim( (string) $value );

			switch ( $type ) {
				case 'url':
					if ( strlen( $value ) > 2048 ) {
						return '';
					}
					return esc_url_raw( $value, array( 'http', 'https' ) );
				case 'date':
					return self::sanitize_date( $value );
				case 'time':
					return self::sanitize_time( $value );
				case 'text':
					return mb_substr( sanitize_text_field( $value ), 0, 100 );
				default:
					return mb_substr( sanitize_textarea_field( $value ), 0, 5000 );
			}
		}

		public static function authorize_meta_edit( $allowed, $meta_key, $post_id, $user_id = 0 ) {
			return $post_id ? user_can( $user_id, 'edit_post', $post_id ) : false;
		}

		/**
		 * True only for authenticated "edit" context requests (the admin/editor view).
		 * WordPress itself already requires edit capability for context=edit.
		 */
		private static function is_edit_context( $request, $post_id = 0 ) {
			if ( ! ( $request instanceof WP_REST_Request ) || 'edit' !== $request->get_param( 'context' ) ) {
				return false;
			}
			return $post_id ? current_user_can( 'edit_post', $post_id ) : current_user_can( 'edit_posts' );
		}

		/* ------------------------------------------------------------------
		 * Post types
		 * ---------------------------------------------------------------- */

		public static function safe_register_post_types() {
			try {
				self::register_post_types();
			} catch ( Throwable $error ) {
				self::log_error( 'register_post_types', $error );
			}
		}

		private static function register_post_types() {
			foreach ( self::$post_types as $slug => $config ) {
				$result = register_post_type(
					$slug,
					array(
						'labels' => array(
							'name'          => $config['plural'],
							'singular_name' => $config['singular'],
							'all_items'     => 'All ' . $config['plural'],
							'add_new'       => 'Add New',
							'add_new_item'  => 'Add New ' . $config['singular'],
							'edit_item'     => 'Edit ' . $config['singular'],
							'new_item'      => 'New ' . $config['singular'],
							'view_item'     => 'View ' . $config['singular'],
							'search_items'  => 'Search ' . $config['plural'],
							'not_found'     => 'No ' . strtolower( $config['plural'] ) . ' found',
							'menu_name'     => $config['menu'],
						),
						'public'              => true,
						'show_in_rest'        => true,   // REST base = post type slug, e.g. /wp-json/wp/v2/newsletter
						'has_archive'         => false,
						'publicly_queryable'  => false,  // headless: no public front-end URLs for these items
						'exclude_from_search' => true,   // keeps hidden items out of /wp/v2/search and site search
						'query_var'           => false,
						'rewrite'             => false,
						'menu_position'       => $config['position'],
						'menu_icon'           => $config['icon'],
						// 'custom-fields' is REQUIRED for the "meta" object to appear in REST responses.
						'supports'            => array( 'title', 'thumbnail', 'revisions', 'custom-fields' ),
					)
				);

				if ( is_wp_error( $result ) ) {
					self::log_error( 'post_type_' . $slug, $result->get_error_message() );
				}
			}
		}

		public static function disable_block_editor( $use_block_editor, $post_type ) {
			return isset( self::$post_types[ $post_type ] ) ? false : $use_block_editor;
		}

		/**
		 * One-time soft flush so rewrite rules from older versions are cleared.
		 * Runs in wp-admin only, once per plugin version.
		 */
		public static function maybe_flush_rewrite_rules() {
			try {
				if ( ! is_admin() || get_option( self::VERSION_OPTION ) === self::VERSION ) {
					return;
				}
				flush_rewrite_rules( false );
				update_option( self::VERSION_OPTION, self::VERSION, false );
			} catch ( Throwable $error ) {
				self::log_error( 'flush_rewrite_rules', $error );
			}
		}

		/* ------------------------------------------------------------------
		 * Meta registration (exposed to REST)
		 * ---------------------------------------------------------------- */

		public static function safe_register_meta() {
			try {
				self::register_meta();
			} catch ( Throwable $error ) {
				self::log_error( 'register_meta', $error );
			}
		}

		private static function register_meta() {
			foreach ( self::$post_types as $post_type => $config ) {
				self::register_flag_meta( $post_type, 'is_visible' );
				self::register_flag_meta( $post_type, 'show_title' );

				foreach ( $config['fields'] as $field => $field_config ) {
					self::register_flag_meta( $post_type, 'show_' . $field );

					$type = $field_config['type'];
					register_post_meta(
						$post_type,
						$field,
						array(
							'type'              => 'string',
							'single'            => true,
							'default'           => '',
							'show_in_rest'      => true,
							'sanitize_callback' => function ( $value ) use ( $type ) {
								return self::sanitize_by_type( $value, $type );
							},
							'auth_callback'     => array( __CLASS__, 'authorize_meta_edit' ),
						)
					);
				}
			}
		}

		private static function register_flag_meta( $post_type, $key ) {
			register_post_meta(
				$post_type,
				$key,
				array(
					'type'              => 'boolean',
					'single'            => true,
					'default'           => true,
					'show_in_rest'      => true,
					'sanitize_callback' => array( __CLASS__, 'sanitize_flag' ),
					'auth_callback'     => array( __CLASS__, 'authorize_meta_edit' ),
				)
			);
		}

		/* ------------------------------------------------------------------
		 * Admin UI: meta box
		 * ---------------------------------------------------------------- */

		public static function safe_add_meta_boxes() {
			try {
				foreach ( self::$post_types as $post_type => $config ) {
					add_meta_box(
						'dl_content_controls_' . $post_type,
						'Content & API Visibility',
						function ( $post ) use ( $post_type, $config ) {
							try {
								self::render_meta_box( $post, $config );
							} catch ( Throwable $error ) {
								self::log_error( 'render_meta_box', $error );
								echo '<p>Unable to display content controls. Please contact the site administrator.</p>';
							}
						},
						$post_type,
						'normal',
						'high'
					);
					// Hide WordPress' raw "Custom Fields" box; our box replaces it.
					remove_meta_box( 'postcustom', $post_type, 'normal' );
				}
			} catch ( Throwable $error ) {
				self::log_error( 'add_meta_boxes', $error );
			}
		}

		private static function render_switch( $name, $checked, $on_text, $off_text, $extra_class = '' ) {
			echo '<label class="dl-switch ' . esc_attr( $extra_class ) . '" data-on="' . esc_attr( $on_text ) . '" data-off="' . esc_attr( $off_text ) . '">';
			echo '<input type="checkbox" name="' . esc_attr( $name ) . '" value="1" ' . checked( $checked, true, false ) . '>';
			echo '<span class="dl-track" aria-hidden="true"></span>';
			echo '<span class="dl-switch-text">' . esc_html( $checked ? $on_text : $off_text ) . '</span>';
			echo '</label>';
		}

		private static function render_meta_box( $post, $config ) {
			if ( ! ( $post instanceof WP_Post ) || ! current_user_can( 'edit_post', $post->ID ) ) {
				return;
			}

			wp_nonce_field( self::NONCE_ACTION, self::NONCE_NAME );

			$is_visible = self::flag_on( $post->ID, 'is_visible' );

			echo '<div class="dl-box' . ( $is_visible ? '' : ' is-off' ) . '">';

			// Master switch.
			echo '<div class="dl-master"><div>';
			echo '<h4>Show this post in the REST API</h4>';
			echo '<p>Turn off to hide the whole post from your website. Drafts are never public.</p>';
			echo '</div>';
			self::render_switch( 'dl_is_visible', $is_visible, 'Visible', 'Hidden', 'dl-master-switch' );
			echo '</div>';

			echo '<div class="dl-rows">';

			// Title row.
			$show_title = self::flag_on( $post->ID, 'show_title' );
			echo '<div class="dl-row' . ( $show_title ? '' : ' is-off' ) . '">';
			echo '<div class="dl-row-head"><span class="dl-label">Title</span>';
			self::render_switch( 'dl_show_title', $show_title, 'Shown in API', 'Hidden from API' );
			echo '</div>';
			echo '<p class="dl-help">The title itself is edited in the field at the top of the page.</p>';
			echo '</div>';

			// Content fields.
			foreach ( $config['fields'] as $field => $field_config ) {
				$value    = get_post_meta( $post->ID, $field, true );
				$value    = is_scalar( $value ) ? (string) $value : '';
				$shown    = self::flag_on( $post->ID, 'show_' . $field );
				$field_id = 'dl_field_' . $field;
				$type     = $field_config['type'];

				echo '<div class="dl-row' . ( $shown ? '' : ' is-off' ) . '">';
				echo '<div class="dl-row-head">';
				echo '<label class="dl-label" for="' . esc_attr( $field_id ) . '">' . esc_html( $field_config['label'] ) . '</label>';
				self::render_switch( 'dl_show_' . $field, $shown, 'Shown in API', 'Hidden from API' );
				echo '</div>';

				echo '<div class="dl-field">';
				if ( 'textarea' === $type ) {
					echo '<textarea id="' . esc_attr( $field_id ) . '" name="' . esc_attr( $field_id ) . '" rows="4" maxlength="5000" class="widefat">' . esc_textarea( $value ) . '</textarea>';
				} else {
					$input_type = in_array( $type, array( 'url', 'date', 'time' ), true ) ? $type : 'text';
					$extra      = '';
					if ( 'url' === $type ) {
						$extra = ' placeholder="https://" maxlength="2048"';
					} elseif ( 'text' === $type ) {
						$extra = ' maxlength="100"';
						if ( ! empty( $field_config['placeholder'] ) ) {
							$extra .= ' placeholder="' . esc_attr( $field_config['placeholder'] ) . '"';
						}
					}
					$has_media  = ! empty( $field_config['media'] );

					if ( $has_media ) {
						echo '<div class="dl-inline">';
					}
					echo '<input id="' . esc_attr( $field_id ) . '" type="' . esc_attr( $input_type ) . '" name="' . esc_attr( $field_id ) . '" value="' . esc_attr( $value ) . '" class="widefat"' . $extra . ' autocomplete="off">'; // phpcs:ignore WordPress.Security.EscapeOutput -- $extra is a hardcoded string.
					if ( $has_media ) {
						echo '<button type="button" class="button dl-media-btn" data-target="' . esc_attr( $field_id ) . '">Select file</button>';
						echo '</div>';
					}
				}
				echo '</div>';

				if ( ! empty( $field_config['help'] ) ) {
					echo '<p class="dl-help">' . esc_html( $field_config['help'] ) . '</p>';
				}
				echo '</div>';
			}

			echo '</div>'; // .dl-rows
			echo '<p class="dl-footnote">Hidden fields are returned as <code>null</code> by the REST API. Hidden posts are removed from REST results entirely. Logged-in editors still see everything here.</p>';
			echo '</div>'; // .dl-box
		}

		/* ------------------------------------------------------------------
		 * Admin UI: list table column
		 * ---------------------------------------------------------------- */

		public static function add_columns( $columns ) {
			if ( ! is_array( $columns ) ) {
				return $columns;
			}
			$new = array();
			foreach ( $columns as $key => $label ) {
				if ( 'date' === $key ) {
					$new['dl_api'] = 'REST API';
				}
				$new[ $key ] = $label;
			}
			if ( ! isset( $new['dl_api'] ) ) {
				$new['dl_api'] = 'REST API';
			}
			return $new;
		}

		public static function render_column( $column, $post_id ) {
			if ( 'dl_api' !== $column ) {
				return;
			}
			try {
				$post_type = get_post_type( $post_id );
				if ( ! $post_type || ! isset( self::$post_types[ $post_type ] ) ) {
					return;
				}
				if ( ! self::flag_on( $post_id, 'is_visible' ) ) {
					echo '<span class="dl-badge dl-badge--off">Hidden</span>';
					return;
				}
				$hidden = 0;
				if ( ! self::flag_on( $post_id, 'show_title' ) ) {
					$hidden++;
				}
				foreach ( array_keys( self::$post_types[ $post_type ]['fields'] ) as $field ) {
					if ( ! self::flag_on( $post_id, 'show_' . $field ) ) {
						$hidden++;
					}
				}
				echo '<span class="dl-badge dl-badge--on">Visible</span>';
				if ( $hidden > 0 ) {
					echo ' <span class="dl-badge dl-badge--partial">' . esc_html( $hidden ) . ' hidden field' . ( 1 === $hidden ? '' : 's' ) . '</span>';
				}
			} catch ( Throwable $error ) {
				self::log_error( 'render_column', $error );
			}
		}

		/* ------------------------------------------------------------------
		 * Admin assets (inline, only on our screens)
		 * ---------------------------------------------------------------- */

		public static function safe_enqueue_admin_assets( $hook_suffix ) {
			try {
				if ( ! in_array( $hook_suffix, array( 'post.php', 'post-new.php', 'edit.php' ), true ) || ! function_exists( 'get_current_screen' ) ) {
					return;
				}
				$screen = get_current_screen();
				if ( ! $screen || ! isset( self::$post_types[ $screen->post_type ] ) ) {
					return;
				}

				wp_register_style( 'dl-cpt-admin', false, array(), self::VERSION );
				wp_enqueue_style( 'dl-cpt-admin' );
				wp_add_inline_style( 'dl-cpt-admin', self::admin_css() );

				if ( 'edit.php' === $hook_suffix ) {
					return;
				}

				foreach ( self::$post_types[ $screen->post_type ]['fields'] as $field_config ) {
					if ( ! empty( $field_config['media'] ) ) {
						wp_enqueue_media();
						break;
					}
				}

				wp_register_script( 'dl-cpt-admin', false, array(), self::VERSION, true );
				wp_enqueue_script( 'dl-cpt-admin' );
				wp_add_inline_script( 'dl-cpt-admin', self::admin_js() );
			} catch ( Throwable $error ) {
				self::log_error( 'enqueue_admin_assets', $error );
			}
		}

		private static function admin_css() {
			return <<<'CSS'
.dl-box{margin:-6px -12px -12px;color:#1d2327}
.dl-master{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 20px;background:#f6f7f7;border-bottom:1px solid #dcdcde}
.dl-master h4{margin:0 0 2px;font-size:14px}
.dl-master p{margin:0;color:#646970}
.dl-rows{transition:opacity .15s}
.dl-box.is-off .dl-rows{opacity:.45}
.dl-row{padding:16px 20px;border-bottom:1px solid #f0f0f1}
.dl-row-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px}
.dl-label{font-weight:600;font-size:13px}
.dl-field{transition:opacity .15s}
.dl-row.is-off .dl-field{opacity:.5}
.dl-inline{display:flex;gap:8px;align-items:center}
.dl-inline input{flex:1}
.dl-help{margin:6px 0 0;color:#646970;font-size:12px}
.dl-footnote{margin:0;padding:12px 20px;color:#646970;font-size:12px;background:#f6f7f7}
.dl-switch{display:inline-flex;align-items:center;gap:8px;cursor:pointer;user-select:none;font-size:12px;color:#50575e;position:relative;white-space:nowrap}
.dl-switch input{position:absolute;opacity:0;width:1px;height:1px;margin:0}
.dl-track{position:relative;flex:none;width:36px;height:20px;border-radius:20px;background:#a7aaad;transition:background .15s}
.dl-track::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.3);transition:transform .15s}
.dl-switch input:checked+.dl-track{background:#00a32a}
.dl-switch input:checked+.dl-track::after{transform:translateX(16px)}
.dl-switch input:focus-visible+.dl-track{outline:2px solid #2271b1;outline-offset:2px}
.dl-badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:12px;line-height:1.5;font-weight:500}
.dl-badge--on{background:#edfaef;color:#008a20}
.dl-badge--off{background:#f0f0f1;color:#646970}
.dl-badge--partial{background:#fcf9e8;color:#996800}
.column-dl_api{width:170px}
CSS;
		}

		private static function admin_js() {
			return <<<'JS'
(function () {
	document.addEventListener('change', function (e) {
		var input = e.target;
		if (!input || input.type !== 'checkbox' || !input.closest) { return; }
		var sw = input.closest('.dl-switch');
		if (!sw) { return; }
		var on = input.checked;
		var text = sw.querySelector('.dl-switch-text');
		if (text) { text.textContent = on ? sw.getAttribute('data-on') : sw.getAttribute('data-off'); }
		var row = input.closest('.dl-row');
		if (row) { row.classList.toggle('is-off', !on); }
		if (sw.classList.contains('dl-master-switch')) {
			var box = input.closest('.dl-box');
			if (box) { box.classList.toggle('is-off', !on); }
		}
	});

	document.addEventListener('click', function (e) {
		var btn = e.target && e.target.closest ? e.target.closest('.dl-media-btn') : null;
		if (!btn) { return; }
		e.preventDefault();
		if (!window.wp || !window.wp.media) { return; }
		var input = document.getElementById(btn.getAttribute('data-target'));
		if (!input) { return; }
		var frame = window.wp.media({ title: 'Select file', button: { text: 'Use this file' }, multiple: false });
		frame.on('select', function () {
			var attachment = frame.state().get('selection').first().toJSON();
			if (attachment && attachment.url) { input.value = attachment.url; }
		});
		frame.open();
	});
})();
JS;
		}

		/* ------------------------------------------------------------------
		 * Saving
		 * ---------------------------------------------------------------- */

		public static function safe_save_meta( $post_id, $post ) {
			try {
				self::save_meta( $post_id, $post );
			} catch ( Throwable $error ) {
				self::log_error( 'save_meta', $error );
			}
		}

		private static function save_meta( $post_id, $post ) {
			if ( ! ( $post instanceof WP_Post ) || ! isset( self::$post_types[ $post->post_type ] ) ) {
				return;
			}
			if ( ! isset( $_POST[ self::NONCE_NAME ] ) || ! is_string( $_POST[ self::NONCE_NAME ] ) ) {
				return;
			}
			if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST[ self::NONCE_NAME ] ) ), self::NONCE_ACTION ) ) {
				return;
			}
			if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
				return;
			}
			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				return;
			}

			$config = self::$post_types[ $post->post_type ];

			update_post_meta( $post_id, 'is_visible', isset( $_POST['dl_is_visible'] ) ? '1' : '0' );
			update_post_meta( $post_id, 'show_title', isset( $_POST['dl_show_title'] ) ? '1' : '0' );

			foreach ( $config['fields'] as $field => $field_config ) {
				update_post_meta( $post_id, 'show_' . $field, isset( $_POST[ 'dl_show_' . $field ] ) ? '1' : '0' );

				$input_name = 'dl_field_' . $field;
				if ( ! isset( $_POST[ $input_name ] ) || ! is_scalar( $_POST[ $input_name ] ) ) {
					continue;
				}
				$raw_value = (string) wp_unslash( $_POST[ $input_name ] );
				update_post_meta( $post_id, $field, self::sanitize_by_type( $raw_value, $field_config['type'] ) );
			}
		}

		/* ------------------------------------------------------------------
		 * REST: hide posts from collections
		 * ---------------------------------------------------------------- */

		public static function safe_filter_hidden_posts( $args, $request ) {
			try {
				return self::filter_hidden_posts( $args, $request );
			} catch ( Throwable $error ) {
				self::log_error( 'filter_hidden_posts', $error );
				// Fail closed: expose nothing if visibility filtering fails.
				$args['post__in'] = array( 0 );
				return $args;
			}
		}

		private static function filter_hidden_posts( $args, $request ) {
			// Editors using context=edit (admin tooling) must see hidden posts.
			if ( self::is_edit_context( $request ) ) {
				return $args;
			}

			$existing   = ( isset( $args['meta_query'] ) && is_array( $args['meta_query'] ) ) ? $args['meta_query'] : array();
			$visibility = array(
				'relation' => 'OR',
				array(
					'key'     => 'is_visible',
					'compare' => 'NOT EXISTS',
				),
				array(
					'key'     => 'is_visible',
					'value'   => '1',
					'compare' => '=',
				),
			);

			// Nest any existing meta_query so another plugin's OR relation can never bypass ours.
			$args['meta_query'] = empty( $existing )
				? array( $visibility )
				: array( 'relation' => 'AND', $existing, $visibility );

			return $args;
		}

		/* ------------------------------------------------------------------
		 * REST: hide single posts and mask fields
		 * ---------------------------------------------------------------- */

		public static function safe_filter_rest_fields( $response, $post, $request ) {
			try {
				return self::filter_rest_fields( $response, $post, $request );
			} catch ( Throwable $error ) {
				self::log_error( 'filter_rest_fields', $error );
				// Fail closed for this item.
				return new WP_Error( 'rest_post_invalid_id', 'Invalid post ID.', array( 'status' => 404 ) );
			}
		}

		private static function filter_rest_fields( $response, $post, $request ) {
			if ( ! ( $response instanceof WP_REST_Response ) || ! ( $post instanceof WP_Post ) ) {
				return $response;
			}
			if ( ! isset( self::$post_types[ $post->post_type ] ) ) {
				return $response;
			}

			// Editors in the admin context get the real, unmasked data (also covers create/update responses).
			if ( self::is_edit_context( $request, $post->ID ) ) {
				return $response;
			}

			// Hidden post.
			if ( ! self::flag_on( $post->ID, 'is_visible' ) ) {
				$url_params = ( $request instanceof WP_REST_Request ) ? $request->get_url_params() : array();
				if ( isset( $url_params['id'] ) ) {
					// Single-item request: behave exactly like a missing post.
					return new WP_Error( 'rest_post_invalid_id', 'Invalid post ID.', array( 'status' => 404 ) );
				}
				// Collection (should already be excluded by the query filter): return an empty stub.
				$response->set_data( array() );
				foreach ( array_keys( $response->get_links() ) as $rel ) {
					$response->remove_link( $rel );
				}
				return $response;
			}

			$data = $response->get_data();
			if ( ! is_array( $data ) ) {
				return $response;
			}

			// Hidden title: blank it, and the slug (which is derived from the title).
			if ( ! self::flag_on( $post->ID, 'show_title' ) ) {
				if ( isset( $data['title'] ) && is_array( $data['title'] ) ) {
					$data['title']['rendered'] = '';
				}
				if ( isset( $data['slug'] ) ) {
					$data['slug'] = 'item-' . $post->ID;
				}
			}

			// Hidden fields -> null; internal control flags are not exposed publicly.
			if ( isset( $data['meta'] ) && is_array( $data['meta'] ) ) {
				$meta   = $data['meta'];
				$config = self::$post_types[ $post->post_type ];

				unset( $meta['is_visible'], $meta['show_title'] );
				foreach ( $config['fields'] as $field => $field_config ) {
					unset( $meta[ 'show_' . $field ] );
					if ( ! self::flag_on( $post->ID, 'show_' . $field ) ) {
						$meta[ $field ] = null;
					}
				}
				$data['meta'] = $meta;
			}

			$response->set_data( $data );
			return $response;
		}
	}

	Discovery_Library_Content_CPTs::init();
}
