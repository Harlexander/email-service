"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAndReplace = void 0;
const findAndReplace = (html, replace) => {
    let htmlText = html;
    for (const item of replace) {
        const regex = new RegExp(`${item.key}`, 'g');
        htmlText = htmlText.replace(regex, `${item.value}`);
    }
    return htmlText;
};
exports.findAndReplace = findAndReplace;
