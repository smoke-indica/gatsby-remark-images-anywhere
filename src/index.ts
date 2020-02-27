import path = require('path')
import select = require('unist-util-select')

import { RemarkNode, Args, Options } from './type'
import { toMdNode } from './util-html-to-md'
import { defaultMarkup } from './default-markup'
import { SUPPORT_EXTS } from './constants'

const addImage = async (
  {
    markdownAST: mdast,
    markdownNode,
    actions,
    store,
    files,
    getNode,
    createNodeId,
    reporter,
    cache,
    pathPrefix,
  }: Args,
  pluginOptions: Options
) => {
  const {
    plugins,
    staticDir = 'static',
    createMarkup = defaultMarkup,
    sharpMethod = 'fluid',

    // markup options
    loading = 'lazy',
    linkImagesToOriginal = false,
    showCaptions = false,
    wrapperStyle = '',
    backgroundColor = '#fff',
    tracedSVG = false,
    blurUp = true,

    ...imageOptions
  } = pluginOptions

  const { touchNode, createNode } = actions

  // gatsby parent file node of this markdown node
  const dirPath = getNode(markdownNode.parent).dir
  const { directory } = store.getState().program

  const imgNodes: RemarkNode[] = select.selectAll('image[url]', mdast)
  const htmlImgNodes: RemarkNode[] = select
    .selectAll('html', mdast)
    .map(node => toMdNode(node))
    .filter(node => !!node)

  imgNodes.push(...htmlImgNodes)
  const processPromises = imgNodes.map(async node => {
    let url: string = node.url
    if (!url) return

    // mutate node
    const data = {
      title: node.title,
      alt: node.alt,
      originSrc: node.url,
      sharpMethod,
      ...imageResult,
    }
    node.type = 'html'
    node.value = createMarkup(data, {
      loading,
      linkImagesToOriginal,
      showCaptions,
      wrapperStyle,
      backgroundColor,
      tracedSVG,
      blurUp,
    })

    return null
  })

  return Promise.all(processPromises)
}

export = addImage
