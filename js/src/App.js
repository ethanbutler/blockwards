import React from 'react'
import styled from 'styled-components'
import Input from './components/Input'
import SpotifyPicker from './components/SpotifyPicker'

const ThumbnailArea = styled.div`
display: flex;
`

const Image = styled.img`
width: 64px;
height: 64px;
`

export default ({
  attributes,
  setAttributes,
  onConfirm,
}) => (
  <>
    <SpotifyPicker onSelect={setAttributes} />
    <div>
      <div>
        <label>Title</label>
        <Input
          value={attributes.title}
          onChange={e => setAttributes({ title: e.target.value })}
        />
      </div>
      <div>
        <label>Artist</label>
        <Input
          value={attributes.artist}
          onChange={e => setAttributes({ artist: e.target.value })}
        />
      </div>
      <div>
        <label>Description</label>
        <Input
          as="textarea"
          value={attributes.description}
          onChange={e => setAttributes({ description: e.target.value })}
        />
      </div>
      <ThumbnailArea>
        <div style={{ flex: 1 }}>
          <label>Thumbnail URL</label>
          <Input
            value={attributes.thumbnail_uri}
            onChange={e => setAttributes({ thumbnail_uri: e.target.value })}
          />
        </div>
        {attributes.thumbnail_uri && (
          <Image src={attributes.thumbnail_uri} />
        )}
      </ThumbnailArea>
    </div>
    {onConfirm && (
      <button type="button" onClick={onConfirm}>Confirm</button>
    )}
  </>
)