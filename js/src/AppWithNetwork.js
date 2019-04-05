import React from 'react'
import App from "./App";

const headers = {
  'X-WP-Nonce': window.__tokens__.wordpress,
  'Content-Type': 'application/json',
}

const normalizeResponse = data => ({
  title: data.title.rendered,
  artist: data.meta.artist,
  description: data.content.rendered,
  thumbnail_uri: data.meta.thumbnail_uri,
})

const normalizeRequest = attributes => ({
  title: attributes.title,
  content: attributes.description,
  meta: {
    artist: attributes.artist,
    thumbnail_uri: attributes.thumbnail_uri,
  }
})

class AppWithNetwork extends React.Component {
  componentDidMount = () => {
    if(this.props.attributes.id) {
      this.handleGet(this.props.attributes.id)
    }
  }

  handleGet = async id => {
    const res = await fetch(`/wp-json/wp/v2/albums/${id}`, {
      headers,
    })
    const attributes = normalizeResponse(await res.json())
    this.props.setAttributes(attributes)
  }

  handleConfirm = async e => {
    const { attributes, setAttributes, onConfirm } = this.props
    const endpoint = attributes.id
      ? `/wp-json/wp/v2/albums/${attributes.id}`
      : '/wp-json/wp/v2/albums'
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(
        normalizeRequest(attributes)
      ),
    })
    const { id } = await res.json()
    setAttributes({ id })
    onConfirm(e)
  }

  render = () => (
    <App
      {...this.props}
      onConfirm={this.handleConfirm}
    />
  )
}

export default AppWithNetwork