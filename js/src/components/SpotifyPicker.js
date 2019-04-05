import React from 'react'
import styled from 'styled-components'
import Input from './Input'

const DEBOUNCE = 300
const headers = { Authorization: window.__tokens__.spotify }

const Wrapper = styled.div`
position: relative;
`

const Dropdown = styled.div`
position: absolute;
top: 100%;
left: 0;
max-width: 320px;
max-height: 20ch;
padding: 10px;
background: white;
box-shadow: 0 3px 3px rgba(0,0,0,.1);
overflow: scroll;
`

const Item = styled.div`
display: flex;
align-items: center;
margin: 0 0 5px;
`

const Image = styled.img`
width: 32px;
height: 32px;
`

const Info = styled.div`
flex: 1;
display: flex;
flex-direction: column;
padding: 5px;
border-bottom: 1px solid #f1f1f1;
`


const normalize = ({ items = [] }) => items.map(({ artists, name, images }) => ({
  title: name,
  artist: artists.reduce((all, { name }, i) => `${i > 0 ? ', ' : ''}${all}${name}`, ''),
  thumbnail_uri: images[0].url,
}))

class SpotifyPicker extends React.Component {
  state = {
    term: '',
    albums: []
  }

  handleInput = e => {
    this.setState({ term: e.target.value })
    if(this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(this.handleSearch, DEBOUNCE)
  }

  handleSearch = async () => {
    try {
      const res = await fetch(`https://api.spotify.com/v1/search?type=album&q=${this.state.term}`, { headers })
      const { albums } = await res.json()
      this.setState({ albums: normalize(albums) })
    } catch(err) {

    }
  }

  handleSelect = item => {
    this.props.onSelect(item)
    this.setState({ albums: [] })
  }


  render = () => (
    <Wrapper>
      <Input
        placeholder="Search Spotify for albums"
        value={this.state.term}
        onChange={this.handleInput}
      />
      {this.state.albums.length > 0 && (
        <Dropdown>
          {this.state.albums.map(item => (
            <Item role="button" onClick={() => this.handleSelect(item)}>
              <Image src={item.thumbnail_uri} />
              <Info>
                <strong>{item.title}</strong>
                {item.artist}
              </Info>
            </Item>
          ))}
        </Dropdown>
      )}
    </Wrapper>
  )
}

export default SpotifyPicker