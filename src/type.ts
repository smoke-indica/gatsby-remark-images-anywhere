import { Node, NodePluginArgs } from 'gatsby'

export interface RemarkNode {
  type: string;
  [key: string]: any;
}

export interface Args extends NodePluginArgs {
  markdownAST: RemarkNode;
  markdownNode: Node;
}

export interface CreateMarkupArgs {
  title?: string;
  alt?: string;
  src?: string;
}

export type CreateMarkup = (args: CreateMarkupArgs) => string;

export interface Options {
  plugins: unknown[];
  createMarkup?: CreateMarkup;
  [key: string]: unknown;
}
