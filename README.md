# blockwards
Demo for WordCamp Raleigh 2019

## Installation

(The following assume you're in a local development environment such as [Local by Flywheel](https://localbyflywheel.com/)

`git clone` this repository into `wp-content/plugins`. `cd` into the directory.

```
cd js
npm install
npm run build
```

In order to use the Spotify app, you'll need to [register](https://developer.spotify.com/dashboard/applications) a free application using your Spotify account. 

Inside of your application, make sure you add `[SITE URL]/wp-admin/options-general.php?page=spotify-auth` as a Redirect URI.

## Instructions
1. Plugins > Blockwards > Activate
2. Settings > Spotify Auth
3. Paste the client key from your Spotify app into the input and click Authorize.
4. Log into your Spotify account (if necessary) and click "Agree."
5. You'll be redirected back to your dashboard.

Spotify authentication isn't required for the plugin to be functional, but _is_ required for the album picker to work.

The plugin will work with the [Classic Editor](https://wordpress.org/plugins/classic-editor/) installed or not.

Have fun poking around!
