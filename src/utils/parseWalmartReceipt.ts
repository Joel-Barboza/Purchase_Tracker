import { TextElement } from "@react-native-ml-kit/text-recognition";
import { ClassifiedProductLines, Line, NormalizedOcr, Product, ProductSection } from "./types";
import { findLeftAndWidthFromSection, getMaxBottomFromLine, getMinTopFromLine } from "./utils";



type ProductLine = {
  line: TextElement[],
  index: number
}

export const parseWalmartReceipt = (normalizedOcr: NormalizedOcr): void => {
  const receiptLines = normalizedOcr.lines;
  const productSection = findWalmartProductSection(receiptLines);
  if (!productSection?.lines) return;
  const classifiedProductLines = classifyProductLines(productSection.lines);
  console.log(productSection)
}

const findWalmartProductSection = (receiptLines: Line[]): ProductSection | undefined => {
  let productSection: ProductSection = {
    lines: [],
    frame: {
      top: 0,
      left: 0,
      heigth: 0,
      width: 0
    }
  }

  const firstProduct = findFirstProduct(receiptLines);

  if (!firstProduct) return;
  const minTop: number | undefined = getMinTopFromLine(firstProduct.line);

  if (!minTop) return;
  productSection.frame.top = minTop;

  const lastProduct = findLastProduct(receiptLines, firstProduct.index);

  if (!lastProduct) return;
  const maxBottom: number | undefined = getMaxBottomFromLine(lastProduct.line);
  productSection.lines = receiptLines.slice(firstProduct.index, lastProduct.index + 1);

  if (!maxBottom) return;
  productSection.frame.heigth = maxBottom - minTop;

  const leftAndWidth = findLeftAndWidthFromSection(productSection.lines);

  if (!leftAndWidth || !leftAndWidth.left || !leftAndWidth.width) return;
  productSection.frame.left = leftAndWidth.left;
  productSection.frame.width = leftAndWidth.width;

  return productSection;
}


const findFirstProduct = (receiptLines: Line[]): ProductLine | undefined => {

  const wordsPreProductSection = ['#', 'tda#', 'op#', 'te#', 'tr#', 'tda']
  for (const line of receiptLines) {
    for (const word of line.words) {
      // https://stackoverflow.com/questions/37428338/check-if-a-string-contains-any-element-of-an-array-in-javascript
      const hasFoundWords = wordsPreProductSection.some(subString => {
        return word.text.toLowerCase() === subString
      })

      if (hasFoundWords) {
        const firstProductLineIndex: number = receiptLines.indexOf(line) + 1;
        const firstProductLine: Line | undefined = receiptLines.at(firstProductLineIndex);

        if (!firstProductLine) return;

        const prodLine: ProductLine = {
          line: firstProductLine.words,
          index: firstProductLineIndex
        };
        return prodLine;

      }
    }
  }
}

const findLastProduct = (receiptLines: Line[], index: number): ProductLine | undefined => {
  const wordsPostProductSection = ['subtotal', 'subtotal ¢', 'subtotal¢']

  for (let i = index; i < receiptLines.length - index; i++) {
    const line = receiptLines[i];
    for (const word of line.words) {
      // https://stackoverflow.com/questions/37428338/check-if-a-string-contains-any-element-of-an-array-in-javascript
      const hasFoundWords = wordsPostProductSection.some(subString => {
        return word.text.toLowerCase().includes(subString)
      })

      if (hasFoundWords) {
        const lastProductLine: Line | undefined = receiptLines.at(i - 1);

        if (!lastProductLine) return;
        return {
          line: lastProductLine.words,
          index: i - 1
        };
      }

    }
  }
}

const classifyProductLines = (productSectionLines: Line[]): ClassifiedProductLines => {
  let classifiedProductLines: ClassifiedProductLines = {
    lines: []
  }
  let hasPreviousLineProdCode: boolean = false;
  let groupedLines: Line[] = []
  for (let i = 0; i < productSectionLines.length; i++) {
    const line = productSectionLines[i]

    const prodCodeMatch = line.text.match(/\d{4,16}K?/g);

    if (prodCodeMatch) {
      if (hasPreviousLineProdCode) {
        getProductFromLines(groupedLines);
        groupedLines = [];
      }
      groupedLines.push(line)
      hasPreviousLineProdCode = true;
      continue;
    } else {
      groupedLines.push(line)
      getProductFromLines(groupedLines)
      hasPreviousLineProdCode = false;
      groupedLines = [];
    }
  }
  getProductFromLines(groupedLines); // last grouped line remains unprocessed
  return classifiedProductLines;
}

const getProductFromLines = (line: Line[]): Product => {
  const product: Product = {
    name: '',
    prodCode: '',
    quantity: 1,
    unitPrice: 1,
    totalPrice: 1,
    soldByKg: 0, // false
  }
  console.log(line)



  return product
}
