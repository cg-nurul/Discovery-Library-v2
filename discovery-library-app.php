<?php
/**
 * Plugin Name:       Discovery Library App Loader
 * Description:       Serves the Discovery Library React SPA as a standalone, minimal HTML page on one WordPress page. No theme, Elementor or plugin output on that page.
 * Version:           1.1.0
 * Author:            Nurul
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
        const PAGE        = 'redesign';   // slug (or numeric ID) of the page that hosts the app
        const JS          = 'homepage.js';
        const CSS         = 'homepage.css';
        const META_DESC   = 'Comprehensive digital library and learning support portal for VET students and trainers, featuring training videos, APA 7th referencing guides, session recordings, and live workshops.';
        const ENFORCE_CSP = false;        // false = report-only (logs in console, blocks nothing). Set true after testing.
        // ----------------------------------

        private function __construct() {}

        public static function init() {
            add_action('template_redirect', array(__CLASS__, 'serve'), 1);
        }

        /** Log each distinct problem once per request. Never throws. */
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
                // logging must never break a request
            }
        }

        /** Only the one target page, only plain page views. */
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
            if (!in_array($method, array('GET', 'HEAD'), true)) {
                return false;
            }
            // Leave the Elementor editor/preview untouched (presence check only; value never used).
            if (isset($_GET['elementor-preview']) || isset($_GET['elementor_library'])) {
                return false;
            }
            if (!is_page(self::PAGE)) {
                return false;
            }
            $id = (int) get_queried_object_id();
            if ($id < 1) {
                return false;
            }
            // Password-protected page: let WordPress show its own password form.
            if (post_password_required($id)) {
                return false;
            }
            return true;
        }

        /** Resolve build files. Returns false (-> normal page) if anything is missing or empty. */
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
            $scheme = (string) wp_parse_url(home_url(), PHP_URL_SCHEME);   // avoids http:// assets on an https site
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
                 . "script-src 'self' $cf; "
                 . "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
                 . "font-src 'self' https://fonts.gstatic.com data:; "
                 . "img-src 'self' data: blob: https:; "
                 . "media-src 'self' blob: https:; "
                 . "connect-src 'self' $cf https://cloudflareinsights.com; "
                 . "frame-src https:; "
                 . "worker-src 'self' blob:; "
                 . "object-src 'none'; base-uri 'self'; form-action 'self'";
        }

        public static function serve() {
            try {
                if (!self::should_serve()) {
                    return;
                }
                if (headers_sent()) {
                    self::log('Headers already sent; serving the normal page instead.');
                    return;
                }
                $a = self::assets();
                if ($a === false) {
                    return;
                }

                $id  = (int) get_queried_object_id();
                $js  = esc_url($a['js']);
                $css = esc_url($a['css']);

                // ---- Build the whole document first. Nothing is sent until it is complete. ----
                $html  = '<!doctype html>' . "\n";
                $html .= '<html lang="' . esc_attr((string) get_bloginfo('language')) . '"><head>' . "\n";
                $html .= '<meta charset="UTF-8">' . "\n";
                $html .= '<meta name="viewport" content="width=device-width, initial-scale=1.0">' . "\n";
                $html .= '<meta name="color-scheme" content="dark">' . "\n";
                if ((string) get_option('blog_public') === '0') {
                    $html .= '<meta name="robots" content="noindex, nofollow">' . "\n";
                }
                $html .= '<title>' . esc_html((string) wp_get_document_title()) . '</title>' . "\n";
                $html .= '<meta name="description" content="' . esc_attr(self::META_DESC) . '">' . "\n";
                $permalink = get_permalink($id);
                if ($permalink) {
                    $html .= '<link rel="canonical" href="' . esc_url($permalink) . '">' . "\n";
                }
                if (has_site_icon()) {
                    $icon = get_site_icon_url(32);
                    if ($icon) {
                        $html .= '<link rel="icon" href="' . esc_url($icon) . '">' . "\n";
                    }
                }
                // Fonts are pulled in by the CSS @import; warm those connections early.
                $html .= '<link rel="preconnect" href="https://fonts.googleapis.com">' . "\n";
                $html .= '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
                // CSS first (render-blocking by design: no unstyled flash), then fetch the module in parallel.
                $html .= '<link rel="stylesheet" crossorigin href="' . $css . '">' . "\n";
                $html .= '<link rel="modulepreload" crossorigin href="' . $js . '">' . "\n";
                $html .= '<script type="module" crossorigin data-cfasync="false" data-no-optimize="1" data-no-defer="1" src="' . $js . '"></script>' . "\n";
                $html .= '</head><body><div id="root"></div>'
                       . '<noscript>This site requires JavaScript to display.</noscript>'
                       . '</body></html>';

                // ---- Tell optimizer/cache plugins to leave this response alone. ----
                foreach (array('DONOTCACHEPAGE', 'DONOTROCKETOPTIMIZE', 'DONOTMINIFY', 'DONOTCDN') as $const) {
                    if (!defined($const)) {
                        define($const, true);
                    }
                }

                // ---- Send. Only simple header() calls and one echo happen past this point. ----
                status_header(200);
                header('Content-Type: text/html; charset=UTF-8');
                header('X-Content-Type-Options: nosniff');
                header('X-Frame-Options: SAMEORIGIN');
                header('Referrer-Policy: strict-origin-when-cross-origin');
                header('Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()');
                header((self::ENFORCE_CSP ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only') . ': ' . self::csp());
                header_remove('X-Powered-By');

                // Public edge caching only for published pages and anonymous visitors.
                if (get_post_status($id) === 'publish' && !is_user_logged_in()) {
                    header('Cache-Control: public, max-age=0, s-maxage=300, stale-while-revalidate=600');
                } else {
                    nocache_headers();
                }

                echo $html; // phpcs:ignore WordPress.Security.EscapeOutput -- every dynamic value above is escaped
                exit;
            } catch (\Throwable $e) {
                self::log($e);   // any failure: WordPress renders the normal page
            }
        }
    }

    DL_App_Loader::init();
}