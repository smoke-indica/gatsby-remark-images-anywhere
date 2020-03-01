"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
exports.defaultMarkup = (data) => {
    const { src, alt } = data;
    return `
    <a href="${src}">
      <img
        class="${constants_1.CLASS_IMAGE}"
        src="${src}"
        title="${alt}"
        alt="${alt}"
        style="display:block; padding-bottom:10px; max-width: 100%;"
      />
    </a>
  `;
};
