import { TextElement } from "@react-native-ml-kit/text-recognition";
import { NormalizedOcr, ProductSection } from "./types";
import { findLeftAndWidthFromSection, getMaxBottomFromLine, getMinTopFromLine } from "./utils";

let productSection: ProductSection = {
  lines: [],
  frame: {
    top: 0,
    left: 0,
    heigth: 0,
    width: 0
  }
}

type ProductLine = {
  line: TextElement[],
  index: number
}

export const parseWalmartReceipt = (normalizedOcr: NormalizedOcr): void => {
  const receiptLines = normalizedOcr.lines;
  const productSection = findWalmartProductSection(receiptLines);
  console.log(productSection)
}

const findWalmartProductSection = (receiptLines: TextElement[][]): ProductSection | undefined => {
  const firstProduct = findFirstProduct(receiptLines);
  if (!firstProduct) return;

  const minTop: number | undefined = getMinTopFromLine(firstProduct.line);
  if (!minTop) return;
  productSection.frame.top = minTop;

  const lastProduct = findLastProduct(receiptLines, firstProduct.index);

  if (!lastProduct) return;
  const maxBottom: number | undefined = getMaxBottomFromLine(lastProduct.line);

  if (!maxBottom) return;
  productSection.frame.heigth = maxBottom - minTop;

  const leftAndWidth = findLeftAndWidthFromSection(productSection.lines);

  if (!leftAndWidth || !leftAndWidth.left || !leftAndWidth.width) return;
  productSection.frame.left = leftAndWidth.left;
  productSection.frame.width = leftAndWidth.width;

  return productSection;
}


const findFirstProduct = (receiptLines: TextElement[][]): ProductLine | undefined => {

  const wordsPreProductSection = ['#', 'tda#', 'op#', 'te#', 'tr#', 'tda', 'op', 'te', 'tr']
  for (const line of receiptLines) {
    for (const word of line) {
      // https://stackoverflow.com/questions/37428338/check-if-a-string-contains-any-element-of-an-array-in-javascript
      const hasFoundWords = wordsPreProductSection.some(subString => {
        return word.text.toLowerCase() === subString
      })

      if (hasFoundWords) {
        const firstProductLineIndex: number = receiptLines.indexOf(line) + 1;
        const firstProductLine: TextElement[] | undefined = receiptLines.at(firstProductLineIndex);

        if (!firstProductLine) return;

        const prodLine: ProductLine = {
          line: firstProductLine,
          index: firstProductLineIndex
        };
        return prodLine;

      }
    }
  }
}

const findLastProduct = (receiptLines: TextElement[][], index: number): ProductLine | undefined => {
  const wordsPostProductSection = ['subtotal', 'subtotal ¢', 'subtotal¢']

  for (let i = index; i < receiptLines.length - index; i++) {
    const line = receiptLines[i];
    for (const word of line) {
      // https://stackoverflow.com/questions/37428338/check-if-a-string-contains-any-element-of-an-array-in-javascript
      const hasFoundWords = wordsPostProductSection.some(subString => {
        return word.text.toLowerCase().includes(subString)
      })

      if (hasFoundWords) {
        const lastProductLine: TextElement[] | undefined = receiptLines.at(i-1);
        
        if (!lastProductLine) return;
        return {
          line: lastProductLine,
          index: i-1
        };
      }

    }
    productSection.lines.push(line);
  }
}