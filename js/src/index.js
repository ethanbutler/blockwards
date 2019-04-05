import React from 'react'
import { render } from 'react-dom'
// import App from './App'
import App from './AppWithNetwork'
import Standalone from './lib/standalone'
import registerSharedBlock from './lib/shared'

const config = {
  label: 'Album',
  namespace: 'blockwards',
  shortcode: 'album',
  initialAttributes: {
    title: '',
    artist: '',
    description: '',
    thumbnail_uri: '',
  },
}

registerSharedBlock(App, config)

if(
  document.querySelector('body').classList.contains('post-type-albums') &&
  window.location.href.includes('post.php')
) {
  const id = new URLSearchParams(window.location.search).get('post')

  render(
    <Standalone
      as={App}
      id={id}
      {...config}
    />,
    document.querySelector('#wpbody')
  )
}