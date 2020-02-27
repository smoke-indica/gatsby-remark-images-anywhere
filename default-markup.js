"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const absoluteStyle = `
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
`;
const pipe = (...fs) => x => fs.reduce((v, f) => f(v), x);
const comment = text => process.env.NODE_ENV !== 'production'
    ? `<!--${text}-->`
    : ``;
const handleWrapperStyle = (wrapperStyle, data) => {
    if (typeof wrapperStyle === 'function') {
        return wrapperStyle(data);
    }
    if (typeof wrapperStyle === 'string') {
        return wrapperStyle;
    }
    console.warn('[gatsby-remark-images-anywhere] wrapperStyle is expected to be either a string or a function.');
};
const processMainImage = (data, options) => {
    const { srcSet, alt, originalImg } = data;
    const { loading } = options;
    return `
    <picture>
      <source srcset="${srcSet}">
      <img
        class="${constants_1.CLASS_IMAGE}"
        src="${originalImg}"
        href="${originalImg}"
        srcset="${srcSet}"
        title="${alt}"
        alt="${alt}"
        loading="${loading}"
        style="
          ${absoluteStyle}
          object-fit: cover;
          object-position: center center;"
      >
    </picture>
  `;
};
const processPlaceholder = (data, options, input) => {
    const { tracedSVG, base64 } = data;
    const { tracedSVG: enableSVG, blurUp, backgroundColor } = options;
    let placeholderData = null;
    if (enableSVG && tracedSVG) {
        placeholderData = tracedSVG;
    }
    if (blurUp && base64) {
        placeholderData = base64;
    }
    const markup = placeholderData
        ? `
      ${comment('show a placeholder image.')}
      <div
        class="${constants_1.CLASS_PLACEHOLDER}"
        style="
          ${absoluteStyle}
          background: ${backgroundColor} url(${placeholderData}) center / cover no-repeat;
        "
      ></div>
    `
        : '';
    return markup + input;
};
const processWrapper = (data, options, input) => {
    const { sharpMethod } = data;
    const { wrapperStyle } = options;
    const processedWrapperStyle = handleWrapperStyle(wrapperStyle, data);
    let markup = '';
    if (sharpMethod === 'fluid') {
        const styles = {
            imageWrapper: `
        position: relative;
        overflow: hidden;
        ${processedWrapperStyle}
      `,
            imagePadding: `
        width: 100%;
        padding-bottom: 10px;
      `,
        };
        markup = `
      <div class="${constants_1.CLASS_WRAPPER}" style="${styles.imageWrapper}">

        ${comment('preserve the aspect ratio')}
          <div class="${constants_1.CLASS_PADDING}" style="${styles.imagePadding}"></div>

        ${input}
      </div>
    `;
    }
    if (sharpMethod === 'fixed') {
        const styles = `
      position: relative;
      overflow: hidden;
      display: block;
      ${processedWrapperStyle}
    `;
        markup = `
      <div class="${constants_1.CLASS_WRAPPER}" style="${styles}">
        ${input}
      </div>
    `;
    }
    return markup;
};
const processLinkToOriginal = (data, options, input) => {
    const { originalImg } = data;
    const { linkImagesToOriginal } = options;
    if (!linkImagesToOriginal) {
        return input;
    }
    // only fluid returns original image
    return `
    <a
      class="${constants_1.CLASS_LINK}"
      target="_blank"
      rel="noopener"
      style="display: block;"
      href="${originalImg}"
    >${input}
    </a>`;
};
exports.defaultMarkup = (data, options) => {
    if (!options)
        throw new Error('[gatsby-remark-images-anywhere] createMarkup: No options');
    const mainImage = processMainImage.bind(null, data, options);
    const placeholder = processPlaceholder.bind(null, data, options);
    const wrapper = processWrapper.bind(null, data, options);
    const link = processLinkToOriginal.bind(null, data, options);
    const markup = pipe(mainImage, placeholder, wrapper, link)('');
    return markup;
};
