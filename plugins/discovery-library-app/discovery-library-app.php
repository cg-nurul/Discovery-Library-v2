<?php
/**
 * Plugin Name:       Discovery Library App Loader
 * Description:       Serves the Discovery Library React SPA as a minimal standalone page on one WordPress page, using WordPress's normal head/footer flow so Gravity Forms works natively.
 * Version:           2.0.0
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * License:           GPL-2.0-or-later
 *
 * Emergency off switch: add  define('DL_DISABLE', true);  to wp-config.php
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('DL_App_Loader', false)) {

    final class DL_App_Loader {

        // ---- CONFIG (edit only these) ----
        const PAGE        = 'redesign';
        const JS          = 'homepage.js';
        const CSS         = 'homepage.css';
        const META_DESC   = 'Comprehensive digital library and learning support portal for VET students and trainers, featuring training videos, APA 7th referencing guides, session recordings, and live workshops.';
        const ENFORCE_CSP = false;   // keep false: Gravity Forms prints inline scripts
        const FORMS       = array(   // source holder id => Gravity Forms form ID
            'dl-src-enquiry' => 2,
            'dl-src-session' => 5,
        );
        // ----------------------------------

        private static $active = false;

        private function __construct() {}

        public static function init() {
            add_action('template_redirect', array(__CLASS__, 'prepare'), 1);
        }

        private static function log($e) {
            static $seen = array();
            try {
                $msg = ($e instanceof \Throwable) ? $e->getMessage() : (string) $e;
                if (isset($seen[$msg])) {
                    return;
                }
                $seen[$msg] = true;
                error_log('[DL_App_Loader] ' . $msg);
            } catch (\Throwable $ignored) {
            }
        }

        private static function should_serve() {
            if (defined('DL_DISABLE') && DL_DISABLE) {
                return false;
            }
            if (is_admin() || is_feed() || is_preview() || wp_doing_ajax() || wp_doing_cron()) {
                return false;
            }
            if (defined('REST_REQUEST') && REST_REQUEST) {
                return false;
            }
            $method = isset($_SERVER['REQUEST_METHOD']) ? strtoupper((string) $_SERVER['REQUEST_METHOD']) : 'GET';
            if (!in_array($method, array('GET', 'HEAD', 'POST'), true)) {
                return false;
            }
            if (isset($_GET['elementor-preview']) || isset($_GET['elementor_library'])) {
                return false;
            }
            if (!is_page(self::PAGE)) {
                return false;
            }
            $id = (int) get_queried_object_id();
            if ($id < 1 || post_password_required($id)) {
                return false;
            }
            return true;
        }

        private static function assets() {
            $dir = plugin_dir_path(__FILE__) . 'dist/';
            foreach (array(self::JS, self::CSS) as $file) {
                $path = $dir . $file;
                if (!is_file($path) || !is_readable($path) || (int) @filesize($path) < 1) {
                    self::log('Missing, unreadable or empty build file: ' . $path);
                    return false;
                }
            }
            $url    = plugins_url('dist/', __FILE__);
            $scheme = (string) wp_parse_url(home_url(), PHP_URL_SCHEME);
            if ($scheme === 'https' || $scheme === 'http') {
                $url = set_url_scheme($url, $scheme);
            }
            return array(
                'js'  => $url . self::JS  . '?ver=' . (int) @filemtime($dir . self::JS),
                'css' => $url . self::CSS . '?ver=' . (int) @filemtime($dir . self::CSS),
            );
        }

        private static function csp() {
            $cf = 'https://static.cloudflareinsights.com';
            return "default-src 'self'; "
                 . "script-src 'self' 'unsafe-inline' $cf; "
                 . "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
                 . "font-src 'self' https://fonts.gstatic.com data:; "
                 . "img-src 'self' data: blob: https:; "
                 . "media-src 'self' blob: https:; "
                 . "connect-src 'self' $cf https://cloudflareinsights.com; "
                 . "frame-src 'self' https:; "
                 . "worker-src 'self' blob:; "
                 . "object-src 'none'; base-uri 'self'; form-action 'self'";
        }

        /** Keep only callbacks on a hook whose function/class name matches the allow pattern. */
        private static function allow_only($hook, $pattern) {
            try {
                global $wp_filter;
                if (empty($wp_filter[$hook]) || !is_object($wp_filter[$hook]) || empty($wp_filter[$hook]->callbacks)) {
                    return;
                }
                foreach ($wp_filter[$hook]->callbacks as $priority => $callbacks) {
                    foreach ($callbacks as $cb) {
                        $fn   = $cb['function'];
                        $name = '';
                        if (is_string($fn)) {
                            $name = $fn;
                        } elseif (is_array($fn) && isset($fn[0])) {
                            $name = is_object($fn[0]) ? get_class($fn[0]) : (string) $fn[0];
                        }
                        if (!preg_match($pattern, $name)) {
                            remove_filter($hook, $fn, $priority);
                        }
                    }
                }
            } catch (\Throwable $e) {
                self::log($e);
            }
        }

        /** After everything is enqueued, drop all styles/scripts except the app, Gravity Forms and jQuery. */
        public static function prune_assets() {
            try {
                foreach (array(wp_styles(), wp_scripts()) as $registry) {
                    foreach ((array) $registry->queue as $handle) {
                        if (!preg_match('/^(dl-app|gform|gf_|gf-|gravity|jquery)/i', (string) $handle)) {
                            $registry->dequeue($handle);
                        }
                    }
                }
            } catch (\Throwable $e) {
                self::log($e);
            }
        }

        public static function module_tag($tag, $handle, $src) {
            if ($handle !== 'dl-app') {
                return $tag;
            }
            $tag = preg_replace('/\stype=([\'"])[^\'"]*\1/i', '', $tag, 1);
            return preg_replace('/<script\b/i', '<script type="module" crossorigin data-cfasync="false"', $tag, 1);
        }

        /** Tell Cloudflare Rocket Loader to leave every script alone. */
        private static function cfasync($html) {
            return preg_replace_callback('/<script\b[^>]*>/i', function ($m) {
                return (stripos($m[0], 'data-cfasync=') !== false)
                    ? $m[0]
                    : preg_replace('/^<script\b/i', '<script data-cfasync="false"', $m[0], 1);
            }, (string) $html);
        }

        public static function prepare() {
            try {
                if (!self::should_serve()) {
                    return;
                }
                if (headers_sent()) {
                    self::log('Headers already sent; serving the normal page instead.');
                    return;
                }
                if (self::assets() === false) {
                    return;
                }
                self::$active = true;
                add_filter('gform_force_hooks_js_output', '__return_true');
                add_filter('show_admin_bar', '__return_false');
                add_filter('template_include', array(__CLASS__, 'render'), PHP_INT_MAX);
            } catch (\Throwable $e) {
                self::log($e);
            }
        }

        public static function render($template) {
            if (!self::$active) {
                return $template;
            }
            $level = ob_get_level();
            try {
                $a = self::assets();
                if ($a === false) {
                    return $template;
                }

                $id = (int) get_queried_object_id();
                $q  = get_queried_object();
                if ($q instanceof WP_Post) {
                    $GLOBALS['post'] = $q;
                    setup_postdata($q);
                }

                $has_gf = class_exists('GFForms') && function_exists('gravity_form') && function_exists('gravity_form_enqueue_scripts');

                // Our app files, printed after Gravity Forms' CSS.
                add_action('wp_enqueue_scripts', function () use ($a) {
                    wp_enqueue_style('dl-app', $a['css'], array(), null);
                    wp_enqueue_script('dl-app', $a['js'], array(), null, true);
                }, 100);
                add_action('wp_enqueue_scripts', array(__CLASS__, 'prune_assets'), PHP_INT_MAX);
                add_filter('script_loader_tag', array(__CLASS__, 'module_tag'), 10, 3);

                // Only core print callbacks and Gravity Forms may output in head/footer.
                self::allow_only('wp_head', '/^(wp_enqueue_scripts|wp_print_styles|wp_print_head_scripts|wp_print_font_faces|GF|Gravity|gform|gf_)/i');
                self::allow_only('wp_footer', '/^(wp_print_footer_scripts|_wp_footer_scripts|GF|Gravity|gform|gf_)/i');
                add_action('wp_footer', function () {
                    echo '<script data-cfasync="false">' . DL_App_Loader::mount_js() . '</script>';
                }, 99);

                // Documented way to load a form's assets when the shortcode isn't in the page content.
                if ($has_gf) {
                    foreach (self::FORMS as $form_id) {
                        $form_id = (int) $form_id;
                        if ($form_id > 0) {
                            gravity_form_enqueue_scripts($form_id, true);
                        }
                    }
                }

                ob_start();
                echo '<!doctype html>' . "\n";
                echo '<html lang="' . esc_attr((string) get_bloginfo('language')) . '"><head>' . "\n";
                echo '<meta charset="UTF-8">' . "\n";
                                echo '<script data-cfasync="false">' . self::gform_bootstrap() . '</script>' . "\n";
                echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">' . "\n";
                echo '<meta name="color-scheme" content="dark">' . "\n";
                if ((string) get_option('blog_public') === '0') {
                    echo '<meta name="robots" content="noindex, nofollow">' . "\n";
                }
                echo '<title>' . esc_html((string) wp_get_document_title()) . '</title>' . "\n";
                echo '<meta name="description" content="' . esc_attr(self::META_DESC) . '">' . "\n";
                $permalink = get_permalink($id);
                if ($permalink) {
                    echo '<link rel="canonical" href="' . esc_url($permalink) . '">' . "\n";
                }
                if (has_site_icon()) {
                    $icon = get_site_icon_url(32);
                    if ($icon) {
                        echo '<link rel="icon" href="' . esc_url($icon) . '">' . "\n";
                    }
                }
                echo '<link rel="preconnect" href="https://fonts.googleapis.com">' . "\n";
                echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
                wp_head();
                echo '</head><body><div id="root"></div>';
                if ($has_gf) {
                    echo '<div id="dl-forms" hidden>';
                    foreach (self::FORMS as $holder => $form_id) {
                        $form_id = (int) $form_id;
                        if ($form_id < 1) {
                            continue;
                        }
                        echo '<div id="' . esc_attr($holder) . '">'
                           . do_shortcode('[gravityform id="' . $form_id . '" title="false" description="false" ajax="true"]')
                           . '</div>';
                    }
                    echo '</div>';
                }
                wp_footer();
                echo '<noscript>This site requires JavaScript to display.</noscript></body></html>';
                $html = (string) ob_get_clean();

                $html = self::cfasync($html);

                foreach (array('DONOTCACHEPAGE', 'DONOTROCKETOPTIMIZE', 'DONOTMINIFY', 'DONOTCDN') as $const) {
                    if (!defined($const)) {
                        define($const, true);
                    }
                }

                status_header(200);
                header('Content-Type: text/html; charset=UTF-8');
                header('X-Content-Type-Options: nosniff');
                header('X-Frame-Options: SAMEORIGIN');
                header('Referrer-Policy: strict-origin-when-cross-origin');
                header('Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()');
                header((self::ENFORCE_CSP ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only') . ': ' . self::csp());
                header_remove('X-Powered-By');
                nocache_headers();   // pages with forms carry per-page tokens: never cache

                echo $html; // phpcs:ignore WordPress.Security.EscapeOutput -- WordPress/Gravity Forms markup, trusted
                exit;
            } catch (\Throwable $e) {
                while (ob_get_level() > $level) {
                    ob_end_clean();
                }
                self::log($e);
                return $template;   // any failure: WordPress renders the normal page
            }
        }
		
                private static function gform_bootstrap() {
            return <<<'GFB'
var gform;gform||(document.addEventListener("gform_main_scripts_loaded",function(){gform.scriptsLoaded=!0}),document.addEventListener("gform/theme/scripts_loaded",function(){gform.themeScriptsLoaded=!0}),window.addEventListener("DOMContentLoaded",function(){gform.domLoaded=!0}),gform={domLoaded:!1,scriptsLoaded:!1,themeScriptsLoaded:!1,isFormEditor:()=>"function"==typeof InitializeEditor,callIfLoaded:function(o){return!(!gform.domLoaded||!gform.scriptsLoaded||!gform.themeScriptsLoaded&&!gform.isFormEditor()||(gform.isFormEditor()&&console.warn("The use of gform.initializeOnLoaded() is deprecated in the form editor context and will be removed in Gravity Forms 3.1."),o(),0))},initializeOnLoaded:function(o){gform.callIfLoaded(o)||(document.addEventListener("gform_main_scripts_loaded",()=>{gform.scriptsLoaded=!0,gform.callIfLoaded(o)}),document.addEventListener("gform/theme/scripts_loaded",()=>{gform.themeScriptsLoaded=!0,gform.callIfLoaded(o)}),window.addEventListener("DOMContentLoaded",()=>{gform.domLoaded=!0,gform.callIfLoaded(o)}))},hooks:{action:{},filter:{}},addAction:function(o,r,e,t){gform.addHook("action",o,r,e,t)},addFilter:function(o,r,e,t){gform.addHook("filter",o,r,e,t)},doAction:function(o){gform.doHook("action",o,arguments)},applyFilters:function(o){return gform.doHook("filter",o,arguments)},removeAction:function(o,r){gform.removeHook("action",o,r)},removeFilter:function(o,r,e){gform.removeHook("filter",o,r,e)},addHook:function(o,r,e,t,n){null==gform.hooks[o][r]&&(gform.hooks[o][r]=[]);var d=gform.hooks[o][r];null==n&&(n=r+"_"+d.length),gform.hooks[o][r].push({tag:n,callable:e,priority:t=null==t?10:t})},doHook:function(r,o,e){var t;if(e=Array.prototype.slice.call(e,1),null!=gform.hooks[r][o]&&((o=gform.hooks[r][o]).sort(function(o,r){return o.priority-r.priority}),o.forEach(function(o){"function"!=typeof(t=o.callable)&&(t=window[t]),"action"==r?t.apply(null,e):e[0]=t.apply(null,e)})),"filter"==r)return e[0]},removeHook:function(o,r,t,n){var e;null!=gform.hooks[o][r]&&(e=(e=gform.hooks[o][r]).filter(function(o,r,e){return!!(null!=n&&n!=o.tag||null!=t&&t!=o.priority)}),gform.hooks[o][r]=e)}});
GFB;
        }
        
        public static function mount_js() {
            return <<<'JS'
(function () {
  'use strict';
  try {
    var MOUNTS = [
      { mount: 'gravity-form-mount', source: 'dl-src-enquiry', reload: false },
      {
        mount: 'gravity-form-session-mount',
        source: 'dl-src-session',
        fields: {
          'dl-session-id': 'sessionId',
          'dl-session-title': 'sessionTitle',
          'dl-session-date': 'sessionDate'
        }
      }
    ];
    var state = {};

    function fill(container, cfg, holder) {
      if (!cfg.fields) return;
      Object.keys(cfg.fields).forEach(function (cls) {
        var value = container.dataset[cfg.fields[cls]];
        if (value == null) return;
        var input = holder.querySelector('.' + cls + ' input, .' + cls + ' textarea, input.' + cls);
        if (input && input.value !== value) {
          input.value = value;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }

    
function sync() {
    MOUNTS.forEach(function (cfg) {

        var s = state[cfg.mount] || (state[cfg.mount] = {
            container: null,
            holder: null
        });

        // Find the original Gravity Forms holder.
        if (!s.holder) {
            s.holder = document.getElementById(cfg.source);
        }

        if (!s.holder) return;

        // Always check for the current React mount.
        var el = document.getElementById(cfg.mount);

        // Mount exists: attach the original form holder.
        if (el) {

            if (s.holder.parentNode !== el) {
                el.appendChild(s.holder);
            }

            s.container = el;

            // Populate session-specific hidden fields.
            fill(el, cfg, s.holder);

            return;
        }

        // Mount no longer exists: park the form safely.
        if (
            s.container &&
            !document.body.contains(s.container)
        ) {

            var park = document.getElementById('dl-forms');

            if (park && s.holder.parentNode !== park) {
                park.appendChild(s.holder);
            }

            s.container = null;
        }

    });
}


    new MutationObserver(sync).observe(document.body, {
      childList: true, subtree: true,
      attributes: true, attributeFilter: ['data-session-id', 'data-session-title', 'data-session-date']
    });
    sync();
  } catch (e) { if (window.console) console.error('[DL forms]', e); }
})();
JS;
        }
    }

    DL_App_Loader::init();
}