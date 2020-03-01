import { CreateMarkup } from './type'
import {
  CLASS_WRAPPER,
  CLASS_PADDING,
  CLASS_LINK,
  CLASS_IMAGE,
  CLASS_PLACEHOLDER,
} from './constants'

export const defaultMarkup: CreateMarkup = (data) => {

  const { src, alt } = data

  return `
    <a href="${src}">
      <img
        class="${CLASS_IMAGE}"
        src="${src}"
        title="${alt}"
        alt="${alt}"
        style="display:block; padding-bottom:10px; max-width: 100%;"
      />
    </a>
  `
}
