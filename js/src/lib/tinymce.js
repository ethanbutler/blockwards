import React, {createElement, Fragment} from 'react'
import { createGlobalStyle } from 'styled-components'
import {render} from 'react-dom'
import Modal from '../components/Modal'

import {
  getEditor,
  getCompiledShortcode,
  insertBlock,
  removeBlock,
  replaceBlock,
  maskShortcodes,
  unmaskShortcodes,
} from './helpers'

window.__render__ = createElement
window.__fragment__ = Fragment

const GlobalStyle = createGlobalStyle`
[data-shortcode] {
  display: inline-block;
}
`

class TinyMCEBlock extends React.Component {
  static defaultProps = {
    label: 'block',
    initialAttributes: {},
  }

  state = {
    open: false,
    attributes: this.props.initialAttributes
  }

  componentDidMount = () => {
    const { shortcode } = this.props

    const attemptToMountEditor = setInterval(() => {
      const editor = getEditor()

      if(!editor) return
    
      clearInterval(attemptToMountEditor)
      
      editor.on('BeforeSetContent click', maskShortcodes(shortcode))
      editor.on('GetContent', unmaskShortcodes(shortcode))
      editor.on('click', this.handleEditorClick)

      let e = { content: editor.getContent(), preventDefault: () => {} }
      maskShortcodes(shortcode)(e)
      editor.setContent(e.content)
    }, 100)
  }

  handleEditorClick = e => {
    e.preventDefault()
    const { target } = e
    const parent = target.closest(`[data-shortcode="${this.props.shortcode}"]`)

    if(!parent) return

    const uuid = parent.getAttribute('data-uuid')

    if(target.getAttribute('data-action') === 'remove') {
      removeBlock(uuid)
    }

    if(target.getAttribute('data-action') === 'edit') {
      this.setState({
        uuid,
        open: true,
        attributes: JSON.parse(parent.getAttribute('data-attributes'))
      })
    }
  }

  handleClick = e => {
    e.preventDefault()
    this.setState({ open: true })
  }

  handleClose = e => {
    e && e.preventDefault()
    this.setState({
      open: false,
      uuid: null,
      attributes: this.props.initialAttributes
    })
  }

  setAttributes = newAttributes => this.setState(({attributes}) => ({
    attributes: { ...attributes, ...newAttributes }
  }))

  insertShortcode = e => {
    e.preventDefault()
    const { attributes, uuid } = this.state
    const { shortcode } = this.props

    const block = getCompiledShortcode(shortcode, attributes)

    if(uuid) {
      replaceBlock(uuid, block)
    } else {
      insertBlock(block)
    }

    this.handleClose()
  }

  render = () => {
    const { Component } = this.props
    return (
      <>
        <GlobalStyle />
        <button
          className="button"
          onClick={this.handleClick}>Add {this.props.label}
        </button>
        {this.state.open && (
          <Modal>
            <Component 
              attributes={this.state.attributes}
              setAttributes={this.setAttributes}
              onConfirm={this.insertShortcode}
              />
            <button onClick={this.handleClose}>Close</button>
          </Modal>
        )}
      </>
    )
  }
}

export default (Component, {
  initialAttributes,
  shortcode,
  label,
}) => {
  const root = document.querySelector(`[data-shortcode="${shortcode}"]`)

  if(root) render(
    <TinyMCEBlock
      Component={Component}
      initialAttributes={initialAttributes}
      shortcode={shortcode}
      label={label}
    />,
    root
  )
}