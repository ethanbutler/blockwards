import nanoid from 'nanoid'

/**
 * Returns active tinymce editor instance
 */
export const getEditor = () => window.tinymce && window.tinymce.activeEditor

/**
 * Returns whether we're on TinyMCE
 * @return {boolean}
 */
const isVisualEditor = () => !!document.querySelector('.tmce-active')

/**
 * 
 * @param {string} block 
 */
export const insertBlock = block => {
  if(isVisualEditor()) {
    // If we're on TinyMCE, insert content
    getEditor().execCommand('mceInsertContent', false, block)
  } else {
    // Otherwise, fallback to QTags
    QTags.insertContent(block)
  }
}

/**
 * 
 * @param {string} uuid 
 * @param {string} block 
 */
export const replaceBlock = (uuid, block) => {
  // Get content
  const editor = getEditor()
  const content = editor.getContent()

  // Replace previous shortcode with new shortcode
  const regexp = new RegExp(`\\[.*?uuid="${uuid}".*?]`)
  const newContent = content.replace(regexp, block)
  editor.setContent(newContent)
}

/**
 * 
 * @param {string} uuid 
 */
export const removeBlock = (uuid) => {
  // Get content
  const editor = getEditor()
  const content = editor.getContent()

  // Remove previous shortcode
  const regexp = new RegExp(`\\[.*?${uuid}.*?]`)
  const newContent = content.replace(regexp, '')

  // Cleanup
  editor.setContent(newContent)
}

/**
 * 
 * @param {string}  shortcode 
 * @param {object}  attributes 
 * @param {boolean} useUUID 
 */
export const getCompiledShortcode = (shortcode, attributes, useUUID = true) => {
  // Turns { k: v } into [[k, v]], which can be reduced
  const compiledAttributes = Object.entries({
    ...attributes,
    // Optionally include a UUID key in source object
    ...(useUUID ? {uuid: nanoid()} : {}),
  })
  // Compile to string
  .reduce((str, [key, value]) => `${str} ${key}="${value}"`, '')
  // Remove whitespace
  .trim()

  return `[${shortcode} ${compiledAttributes}]`
}

/**
 * Given
 * @param {string} shortcode
 * @param {string} original 
 * @param {object} attributes 
 */
const renderPreview = (
  shortcode,
  original,
  attributes
) => (`
<div
  data-shortcode="${shortcode}"
  data-original='${original}'
  data-attributes='${JSON.stringify(attributes)}'
  data-uuid="${attributes.uuid}"
  class="mceItem mceNonEditable"
  contenteditable="false"
  data-mce-placeholder="1"
>
  <h1>${attributes.title}</h1>
  <div>
    <cite>by ${attributes.artist}</cite>
  </div>
  <img src="${attributes.thumbnail_uri}" />
  <button data-action="remove">
    Remove
  </button>
  <button data-action="edit">
    Edit
  </button>
</div>`
)

// We don't want to mask more often than a threshold, because
// weird things happen to contain if you modify TinyMCE events
// in an overlapping way.
let lastMask = null

/**
 * Returns a callback that replaces shortcodes with previews.
 * @param  {string}      shortcode  Shortcode slug
 * @return {function<e>}            Callback to be passed to handler
 */
export const maskShortcodes = shortcode => (e = {}) => {
  if(new Date() - lastMask < 1000) return

  const SHORTCODE_PATTERN = `\\[(${shortcode}) (.*?)]`
  const ATTRIBUTE_PATTERN = `([a-z_]+)="(.*?)"`
  const content = e.type !== 'click' ? e.content : getEditor().getContent()

  lastMask = new Date()

  e.content = content.replace(
    new RegExp(SHORTCODE_PATTERN, 'g'),
    (match) => {
      const [original, slug, rawAttributes] =
        new RegExp(SHORTCODE_PATTERN, 'g').exec(match)

      const attributeRegExp = new RegExp(ATTRIBUTE_PATTERN, 'g')

      let attributes = {}
      let attributeMatch = attributeRegExp.exec(rawAttributes)

      let i = 0
      while(attributeMatch) {
        const [, key, value] = attributeMatch
        attributes[key] = value
        attributeMatch = attributeRegExp.exec(rawAttributes)
      }

      return renderPreview(slug, original, attributes)
    }
  )
}

/**
 * Returns a callback that replaces previews with shortcodes.
 * @param  {string}      shortcode  Shortcode slug
 * @return {function<e>}            Callback to be passed to handler
 */
export const unmaskShortcodes = shortcode => e => {
  // Create a temporary DOM node from content
  const temp = document.createElement('div')
  temp.innerHTML = e.content

  // Locate blocks within template
  const blocks = temp.querySelectorAll(`[data-shortcode="${shortcode}"]`)

  // Replace blocks with original shortcodes
  blocks.forEach(el => {
    const shortcode = el.getAttribute('data-original')
    const textnode = document.createTextNode(shortcode)
    el.replaceWith(textnode)
  })

  // Replace content in event 
  e.content = temp.innerHTML

  // Cleanup
  temp.remove()
}