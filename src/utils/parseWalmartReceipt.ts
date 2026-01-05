import { TextElement } from "@react-native-ml-kit/text-recognition";
import { Line, OcrInfo, Product, ProductSection } from "./types";
import { findLeftAndWidthFromSection, getMaxBottomFromLine, getMinTopFromLine } from "./utils";

type ProductLine = {
  line: TextElement[],
  index: number
}

export const parseWalmartReceipt = (ocrInfo: OcrInfo): Product[] | undefined => {
  const receiptLines: Line[] = ocrInfo.lines;
  const productSection: ProductSection | undefined = findWalmartProductSection(receiptLines);

  if (!productSection || !productSection.lines) return;

  const productList = getProductList(productSection.lines);
  return productList;
}

const findWalmartProductSection = (receiptLines: Line[]): ProductSection | undefined => {

  const firstProduct: ProductLine | undefined = findFirstProduct(receiptLines);

  if (!firstProduct) return;
  const minTop: number | undefined = getMinTopFromLine(firstProduct.line);

  if (!minTop) return;
  const top: number = minTop;

  const lastProduct = findLastProduct(receiptLines, firstProduct.index);

  if (!lastProduct) return;
  const maxBottom: number | undefined = getMaxBottomFromLine(lastProduct.line);
  const lines: Line[] = receiptLines.slice(firstProduct.index, lastProduct.index + 1);

  if (!maxBottom) return;
  const heigth: number = maxBottom - minTop;

  const leftAndWidth: { left: number, width: number } | undefined = findLeftAndWidthFromSection(lines);

  if (!leftAndWidth || !leftAndWidth.left || !leftAndWidth.width) return;
  const left: number = leftAndWidth.left;
  const width: number = leftAndWidth.width;

  const productSection: ProductSection = {
    lines,
    frame: { top, left, heigth, width }
  }
  console.log(productSection)
  return productSection;
}


const findFirstProduct = (receiptLines: Line[]): ProductLine | undefined => {

  const wordsPreProductSection = ['#', 'tda#', 'op#', 'te#', 'tr#', 'tda']
  console.log(receiptLines)
  for (const line of receiptLines) {
    for (const word of line.words) {
      // https://stackoverflow.com/questions/37428338/check-if-a-string-contains-any-element-of-an-array-in-javascript
      const hasFoundWords = wordsPreProductSection.some(subString => {
        return word.text.toLowerCase().includes(subString)
      })
      
      if (!hasFoundWords) continue;
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

const findLastProduct = (receiptLines: Line[], index: number): ProductLine | undefined => {
  const wordsPostProductSection = ['subtotal', 'subtotal ¢', 'subtotal¢']

  for (let i = index; i < receiptLines.length - index; i++) {
    const line = receiptLines[i];
    for (const word of line.words) {
      // https://stackoverflow.com/questions/37428338/check-if-a-string-contains-any-element-of-an-array-in-javascript
      const hasFoundWords = wordsPostProductSection.some(subString => {
        return word.text.toLowerCase().includes(subString)
      })

      if (!hasFoundWords) continue;
      const lastProductLine: Line | undefined = receiptLines.at(i - 1);

      if (!lastProductLine) return;
      return {
        line: lastProductLine.words,
        index: i - 1
      };
    }
  }
}


const getProductList = (productSectionLines: Line[]): Product[] => {
  let productLineGroups: Line[][] = []
  let groupedLines: Line[] = []
  let productList: Product[] = [];
  for (let i = 0; i < productSectionLines.length; i++) {
    const line = productSectionLines[i]
    const nextLine = productSectionLines[i + 1] ? productSectionLines[i + 1] : undefined;

    const prodCodeMatch = line.text.match(/\d{4,16}K?/g);
    const priceMatch = line.text.match(/(?<=\d{4,16}K?.*)([\d{1,3}i][.,])*\d{1,3}(?= * G)/g)

    if (prodCodeMatch && priceMatch) {
      groupedLines.push(line)
      productLineGroups.push(groupedLines)
      const product = getProductFromLines(groupedLines);
      if (product) productList.push(product);
      groupedLines = [];

    } else if (prodCodeMatch) {
      groupedLines.push(line)
      if (nextLine) groupedLines.push(nextLine);

      productLineGroups.push(groupedLines)
      const product = getProductFromLines(groupedLines);

      if (product) productList.push(product);

      groupedLines = [];
      i++;
    }
  }
  return productList;
}

const getProductFromLines = (productLines: Line[]): Product | undefined => {
  if (productLines.length === 1) {
    const product: Product = parseOneLineProduct(productLines);
    console.log(product)
    return product;

  } else if (productLines.length === 2) {
    const product: Product = parseTwoLinesProduct(productLines);
    console.log(product)
    return product;
  }
  return;
}


const parseOneLineProduct = (productLines: Line[]): Product => {
  const line: Line = productLines[0];
  // https://regexr.com/
  const nameMatch = line.text.match(/^(.*)(?= \d{4,16}K?)/i);
  const prodCodeMatch = line.text.match(/(?<= )\d{4,20}K?/);
  const totalPriceMatch = line.text.match(/(?<=[0-9]{4}.* +)([0-9]{0,3}(,|.)[0-9]{0,3}(,|.)([0-9 ])*)(?=(\s*G))/g);

  const totalPriceMatchCleanNumber =
    totalPriceMatch
      ? parseInt(totalPriceMatch[0].slice(0, -1).replace(/[.,\s]/g, ''))
      : undefined;

  const product: Product = {
    name: nameMatch ? nameMatch[0] : undefined,
    prodCode: prodCodeMatch ? prodCodeMatch[0] : undefined,
    quantity: 1,
    unitPrice: totalPriceMatchCleanNumber,
    totalPrice: totalPriceMatchCleanNumber,
    soldByKg: 0, // false
  }
  return product;
}



const parseTwoLinesProduct = (productLines: Line[]): Product => {

  const nameMatch = productLines[0].text.match(/^(.*)(?= \d{4,20}K?)/i);
  const prodCodeMatch = productLines[0].text.match(/(?<= )\d{4,20}K?/);
  const prodCodeWithKMatch = productLines[0].text.match(/(?<= )\d{4,20}K/);

  if (prodCodeWithKMatch) {
    const product: Product = handleProductSoldByKg(productLines[1], nameMatch, prodCodeWithKMatch);
    return product

  } else if (prodCodeMatch) {
    const product: Product = handleProductSoldByUnits(productLines[1], nameMatch, prodCodeMatch);
    return product

  } else {
    const product: Product = {
      name: nameMatch ? nameMatch[0] : undefined,
      prodCode: prodCodeMatch ? prodCodeMatch[0] : undefined,
      quantity: undefined,
      unitPrice: undefined,
      totalPrice: undefined,
      soldByKg: undefined, // false
    }
    return product
  }
}


const handleProductSoldByKg = (
  secondLine: Line, name: RegExpMatchArray | null, prodCode: RegExpMatchArray | null
): Product => {

  const priceByKg = secondLine.text.match(/((?<=A* *)(\d{1,3}[.,])*\d{1,3}(?= *\/Kg))/gi);
  const cleanPriceByKg =
    priceByKg
      ? parseInt(priceByKg[0].replace(/[.,\s]/g, ''))
      : undefined;

  const totalPriceMatch = secondLine.text.match(/(?<=\s)([0-9]{0,3}(,|.)[0-9]{0,3}(,|.)([0-9 ])*)(?=(\s*G))/g);
  const cleanTotalPriceNumber =
    totalPriceMatch
      ? parseInt(totalPriceMatch[0].replace(/[.,\sG]/g, ''))
      : undefined;

  const weightInKg = secondLine.text.match(/((\d{1,3}[.,])*\d{1,3}(?= *Kg))/gi);
  let cleanWeightNumber;
  if (!weightInKg && cleanTotalPriceNumber && cleanPriceByKg) {
    const inferedQuantity = cleanTotalPriceNumber / cleanPriceByKg;
    cleanWeightNumber = inferedQuantity;
  } else if (weightInKg) {
    cleanWeightNumber = parseFloat(weightInKg[0].replace(/[\s]/g, ''));
  } else {
    cleanWeightNumber = undefined;
  }

  const product: Product = {
    name: name ? name[0] : undefined,
    prodCode: prodCode ? prodCode[0] : undefined,
    quantity: cleanWeightNumber,
    unitPrice: cleanPriceByKg,
    totalPrice: cleanTotalPriceNumber,
    soldByKg: 1, // true

  }
  return product;
}


const handleProductSoldByUnits = (
  secondLine: Line, name: RegExpMatchArray | null, prodCode: RegExpMatchArray | null
): Product => {

  const unitPrice = secondLine.text.match(/(?<=\d+ *X *[¢$]*)(\d{1,3}[.,])*\d{1,3}(?= *)/gi);
  const cleanUnitPrice =
    unitPrice
      ? parseInt(unitPrice[0])
      : undefined;


  const totalPriceMatch = secondLine.text.match(/(?<=(\d{1,3}[.,])*\d{1,3} *)(\d{1,3}[.,])*\d{1,3}(?= * G)/g);
  const cleanTotalPriceNumber =
    totalPriceMatch
      ? parseInt(totalPriceMatch[0])
      : undefined;

  const quantity = secondLine.text.match(/\d+ *(?=x *[¢$]*\d*)/gi);
  let cleanQuantityNumber;
  if (!quantity && cleanTotalPriceNumber && cleanUnitPrice) {
    const inferedQuantity = cleanTotalPriceNumber / cleanUnitPrice;
    cleanQuantityNumber = inferedQuantity;
  } else if (quantity) {
    cleanQuantityNumber = parseInt(quantity[0]);
  } else {
    cleanQuantityNumber = undefined;
  }


  const product: Product = {
    name: name ? name[0] : undefined,
    prodCode: prodCode ? prodCode[0] : undefined,
    quantity: cleanQuantityNumber,
    unitPrice: cleanUnitPrice,
    totalPrice: cleanTotalPriceNumber,
    soldByKg: 0, // true

  }
  return product;

}