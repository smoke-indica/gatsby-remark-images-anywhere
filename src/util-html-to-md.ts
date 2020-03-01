import parse5 = require('parse5')

import { RemarkNode } from './type'

const toMdNode = (node: RemarkNode): RemarkNode | null => {
  const value = node.value
  const parsed = parse5.parseFragment(value)
  const imgNode = parsed.childNodes.find(node => node.tagName === 'img')

  // not an img? don't touch it
  if (!imgNode) return null

  const attrs = imgNode.attrs.reduce((acc, cur) => {
    const { name, value } = cur
    acc[name] = value
    return acc
  }, {})

  // no src? don't touch it
  if (!attrs.src) return null

  // store origin info & mutate node
  const original = { ...node }
  node.type = 'image'
  node.value = ''
  node.url = attrs.src
  node.title = attrs.title
  node.alt = attrs.alt
  node.data = {}
  node.data.original = original

  return node
}

const aToMdNode = (node: RemarkNode): RemarkNode | null => {
  const value = node.value
  const parsed = parse5.parseFragment(value)
  const aNode = parsed.childNodes.find(node => node.tagName === 'a')

  // not a link? don't touch it
  if (!aNode) return null

  const attrs = aNode.attrs.reduce((acc, cur) => {
    const { name, value } = cur
    acc[name] = value
    return acc
  }, {})

  // no src? don't touch it
  if (!attrs.url) return null

  if (
    !attrs.url.includes(".jpeg") &&
    !attrs.url.includes(".jpg") &&
    !attrs.url.includes(".png") &&
    !attrs.url.includes(".webp") &&
    !attrs.url.includes(".tif") &&
    !attrs.url.includes(".tiff")
  ) return null

  // store origin info & mutate node
  const original = { ...node }
  node.type = 'image'
  node.value = ''
  node.url = attrs.url
  node.title = ''
  node.alt = ''
  node.data = {}
  node.data.original = original

  return node
}

export {
  toMdNode,
  aToMdNode
}
