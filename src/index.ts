import select = require('unist-util-select')

import { RemarkNode, Args, Options } from './type'
import { toMdNode, aToMdNode } from './util-html-to-md'
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
    backgroundColor = '#fff',
    ...imageOptions
  } = pluginOptions

  const { touchNode, createNode } = actions

  const imgNodes: RemarkNode[] = select.selectAll('image[url]', mdast)

  const htmlImgNodes: RemarkNode[] = select
    .selectAll('html', mdast)
    .map(node => toMdNode(node))
    .filter(node => !!node)

  /*
  const htmlaNodes: RemarkNode[] = select
    .selectAll('paragraph', mdast)
    .map(node => aToMdNode(node))
    .filter(node => !!node)
  */

  imgNodes.push(...htmlImgNodes)
  //imgNodes.push(...htmlaNodes)

  const processPromises = imgNodes.map(async node => {
    let url: string = node.url
    if (!url) return

    // mutate node
    const data = {
      title: node.title ? node.title : '',
      alt: node.alt ? node.alt : '',
      src: node.url,
    }
    node.type = 'html'
    node.value = createMarkup(data)

    return null
  })

  return Promise.all(processPromises)
}

export = addImage
