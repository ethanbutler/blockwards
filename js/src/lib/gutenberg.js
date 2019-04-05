import {
  getCompiledShortcode
} from './helpers'

export default (as, {
  namespace,
  shortcode,
  label,
  initialAttributes,
}) => {
  window.__render__ = wp.element.createElement
  window.__fragment__ = wp.element.Fragment

  wp.blocks.registerBlockType(`${namespace}/${shortcode}`, {
    title: label,
    edit: as,
    category: 'common',
    attributes: Object.fromEntries(
      Object.keys(initialAttributes).map(key => ([
        key,
        { type: 'string' }
      ]))
    ),
    edit: as,
    save: ({attributes}) => (
      <div>
        {getCompiledShortcode(shortcode, {
          ...initialAttributes,
          ...attributes
        }, false)}
      </div>
    )
  })
}