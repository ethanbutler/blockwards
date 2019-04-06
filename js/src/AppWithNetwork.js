import React from 'react'
import App from "./App";

// Authentication header for fetch
const headers = {
  'X-WP-Nonce': window.__tokens__.wordpress,
  'Content-Type': 'application/json',
}

// Makes data from REST response fit the format of our attributes
const normalizeResponse = data => ({
  title: data.title.rendered,
  artist: data.meta.artist,
  description: data.content.rendered,
  thumbnail_uri: data.meta.thumbnail_uri,
})

// Makes our attributes fit the format needed by the REST API format
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
    // If we have an id in our attributes, GET initial data
    if(this.props.attributes.id) {
      this.handleGet(this.props.attributes.id)
    }
  }

  handleGet = async id => {
    // Make authenticated GET request
    const res = await fetch(`/wp-json/wp/v2/albums/${id}`, {
      headers,
    })
    // Get block attributes from REST API
    const attributes = normalizeResponse(await res.json())
    // Update block attributes
    this.props.setAttributes(attributes)
  }

  handleConfirm = async e => {
    const { attributes, setAttributes, onConfirm } = this.props
    
    // If we have an ID, update the resource. Otherwise, create a new resource
    const endpoint = attributes.id
      ? `/wp-json/wp/v2/albums/${attributes.id}`
      : '/wp-json/wp/v2/albums'
    
    // Make a POST request with our attributes
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(
        normalizeRequest(attributes)
      ),
    })
    
    
    const { id } = await res.json()
    
    // Update attributes with ID if it doesn't exist
    setAttributes({ id })
    
    // Call our original onConfirm callback
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
