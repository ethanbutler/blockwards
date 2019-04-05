import registerTinyMCEBlock from './tinymce'
import registerGBBlock from './gutenberg'

export default (Component, props) => {
  registerTinyMCEBlock(Component, props)

  if(window.wp.element) {
    registerGBBlock(Component, props)
  }
}