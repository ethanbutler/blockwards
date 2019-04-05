<?php

include 'inc/auth.php';

/**
 * Plugin Name: Blockwards Demo
 */
add_action('init', function() {
  register_post_type('albums', [
    'labels' => [
      'name' => 'Albums',
      'singular_name' => 'Album'
    ],
    'public' => true,
    'show_in_rest' => true,
    'supports' => ['title', 'editor', 'custom-fields']
  ]);

  register_meta('post', 'artist', [
    'type' => 'string',
    'single' => true,
    'description' => '',
    'show_in_rest' => true,
  ]);

  register_meta('post', 'thumbnail_uri', [
    'type' => 'string',
    'single' => true,
    'description' => '',
    'show_in_rest' => true,
  ]);
});

add_action('admin_enqueue_scripts', function() {
  wp_register_script(
    'blockward-js',
    plugin_dir_url(__FILE__).'js/dist/index.js',
    [],
    null,
    true
  );

  wp_localize_script(
    'blockward-js',
    '__tokens__',
    [
      'spotify' => 'Bearer ' . get_option('spotify_auth_token'),
      'wordpress' => wp_create_nonce( 'wp_rest' ),
    ]
  );

  wp_enqueue_script('blockward-js');
});

add_action('media_buttons', function() {
  ?>
    <div data-shortcode="album"></div>
  <?php
});
