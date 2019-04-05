import React from 'react'
import styled from 'styled-components'

const Wrap = styled.div`
padding: 20px;
background: white;
margin: 20px 20px 20px 0;
`

export default class Standalone extends React.Component {
  state = {
    id: this.props.id,
    ...this.props.initialAttributes
  }

  render = () => {
    const Component = this.props.as
    return (
      <Wrap>
        <Component
          setAttributes={newAttributes => this.setState(newAttributes)}
          attributes={this.state}
        />
      </Wrap>
    )
  }

}