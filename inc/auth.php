<?php

add_action('wp_ajax_spotify_auth', function() {
  $token = $_POST['token'];
  update_option('spotify_auth_token', $token);
  wp_die();
});

add_action('admin_menu', function() {
  add_options_page(
    'Spotify Auth',
    'Spotify Auth',
    'manage_options',
    'spotify-auth',
    function() {
      if($_GET['success']) {
        ?>
        <div class="notice notice-success">
          <h3>Authorization successful!</h3>
        </div>
        <?php
        return;
      }
      if(get_option('spotify_auth_token')) {
        ?>
        <script>
          (($) => {
            $(document).ready(() => {
              $('#reauth').click(() => {
                $.post(window.ajaxurl, {
                  action: 'spotify_auth',
                  token: ''
                }, () => {
                  window.location.replace("<?php echo get_admin_url(); ?>options-general.php?page=spotify-auth")
                })
              })
            })
          })(jQuery)
        </script>
        <div class="notice notice-success">
          You're already authorized.
          <div>
            <button id="reauth" class="button">Re-authorize</button>
          </div>
        </div>
        <?php
        return;
      }
      ?>
        <script>
          (($) => {
            let token = window.location.hash.match(/access_token=.*?&/)
              
            if(token) {
              token = token[0]
                .replace('access_token=', '')
                .replace('&', '')
                
              $(document).ready(() => {
                $.post(window.ajaxurl, {
                  action: 'spotify_auth',
                  token
                }, () => {
                  window.location.replace("<?php echo get_admin_url(); ?>options-general.php?page=spotify-auth&success=true")
                })
              })
            }
          })(jQuery)
        </script>

        <form
          method="get"
          action="https://accounts.spotify.com/authorize"
        >
          <h1>Authorize Spotify Account</h1>
          <div>
            <label>Client ID</label>
            <input
              name="client_id"
              value=""
              required
            />
            <div>
              <a href="https://developer.spotify.com/dashboard/applications">Get Client ID</a>
            </div>
          </div>
          <input
            type="hidden"
            name="response_type"
            value="token"
          />
          <input
            type="hidden"
            name="redirect_uri"
            value="<?php echo get_admin_url(); ?>options-general.php?page=spotify-auth"
          />
          <div>
            <input type="submit" value="Authorize" />
          </div>
        </form>
      <?php
    }
  );
});