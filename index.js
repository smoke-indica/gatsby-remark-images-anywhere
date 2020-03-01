"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const select = require("unist-util-select");
const util_html_to_md_1 = require("./util-html-to-md");
const default_markup_1 = require("./default-markup");
const addImage = async ({ markdownAST: mdast, markdownNode, actions, store, files, getNode, createNodeId, reporter, cache, pathPrefix, }, pluginOptions) => {
    const { plugins, staticDir = 'static', createMarkup = default_markup_1.defaultMarkup, sharpMethod = 'fluid', backgroundColor = '#fff' } = pluginOptions, imageOptions = __rest(pluginOptions, ["plugins", "staticDir", "createMarkup", "sharpMethod", "backgroundColor"]);
    const { touchNode, createNode } = actions;
    const imgNodes = select.selectAll('image[url]', mdast);
    const htmlImgNodes = select
        .selectAll('html', mdast)
        .map(node => util_html_to_md_1.toMdNode(node))
        .filter(node => !!node);
    /*
    const htmlaNodes: RemarkNode[] = select
      .selectAll('paragraph', mdast)
      .map(node => aToMdNode(node))
      .filter(node => !!node)
    */
    imgNodes.push(...htmlImgNodes);
    //imgNodes.push(...htmlaNodes)
    const processPromises = imgNodes.map(async (node) => {
        let url = node.url;
        if (!url)
            return;
        // mutate node
        const data = {
            title: node.title ? node.title : '',
            alt: node.alt ? node.alt : '',
            src: node.url,
        };
        node.type = 'html';
        node.value = createMarkup(data);
        return null;
    });
    return Promise.all(processPromises);
};
module.exports = addImage;
