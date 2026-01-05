import TextRecognition, { TextElement, TextRecognitionResult } from "@react-native-ml-kit/text-recognition";
import { NitroSQLiteConnection } from "react-native-nitro-sqlite";
import { parseWalmartReceipt } from "./parseWalmartReceipt";
import { Line, NormalizedOcr, OcrInfo, ReceiptProcessResult, Product, Store, StoreName, STORES } from "./types";
import { persistPurchaseData } from "./utils";

export const processReceiptImage = async (db: NitroSQLiteConnection, imageUri: string): Promise<ReceiptProcessResult | undefined> => {

  const rawOcrResult: TextRecognitionResult | undefined = await extractText(imageUri);

  if (!rawOcrResult) {
    console.error('Unable to extract text from the image')
    return;
  }
  const serializedOcr: string = JSON.stringify(rawOcrResult);
  const normalizedOcr: NormalizedOcr = normalizeOcrResult(rawOcrResult);
  const ocrInfo: OcrInfo = { ...normalizedOcr, image_uri: imageUri, serialized_ocr: serializedOcr }


  const productList: Product[] | undefined = parseReceipt(ocrInfo);

  if (!db) {
    console.error(`Invalid DB instance value: ${db}`);
    return;
  }

  if (!productList) {
    console.error('No product list obtained');
    return;
  }
  if (!ocrInfo.image_uri) {
    console.error('No image uri');
    return;
  }
  if (!ocrInfo.serialized_ocr) {
    console.error('No serialized ocr');
    return;
  }

  const processedResult: ReceiptProcessResult = {
    products: productList,
    image_uri: ocrInfo.image_uri,
    serialized_ocr: ocrInfo.serialized_ocr,
    store: ocrInfo.store
  }
  // await persistPurchaseData(db, processedResult)
  console.log(productList)

  return processedResult;
}

const extractText = async (imageUri: string): Promise<TextRecognitionResult | undefined> => {
  if (!imageUri) {
    console.error("No image URI");
    return;
  }

  try {
    const result = await TextRecognition.recognize(imageUri);
    console.log(result)
    return result;
  } catch (e) {
    throw new Error("Could not extract the text from the image");
  }

};

const normalizeOcrResult = (
  rawOcrResult: TextRecognitionResult
): { lines: Line[], store: Store } => {

  const wordList: TextElement[] = getWordList(rawOcrResult);

  sortVertically(wordList); // mutates wordList

  const store: Store = getReceiptStore(wordList);

  const lines = createLines(wordList);

  sortLineElementsHorizontally(lines); // mutates lines

  const formatedLines: Line[] = formatLines(lines)

  return { lines: formatedLines, store: store };
}

const getWordList = (rawOcrResult: TextRecognitionResult): TextElement[] => {
  let resultObject: TextElement[] = [];

  for (let i = 0; i < rawOcrResult.blocks.length; i++) {
    const block = rawOcrResult.blocks[i];

    // Loop through each line in the block
    for (let j = 0; j < block.lines.length; j++) {
      const line = block.lines[j];
      for (let k = 0; k < line.elements.length; k++) {
        resultObject.push(line.elements[k]);
      }
    }
  }
  return resultObject
}

const getReceiptStore = (wordList: TextElement[]): Store => {
  for (const word of wordList) {
    const text = word.text.toLowerCase();

    if (STORES.includes(text as StoreName)) {
      return { name: text as StoreName };
    }
  }
  return { name: undefined };
};


const sortVertically = (wordList: TextElement[]): void => {
  wordList.sort((a: TextElement, b: TextElement) => {
    if (!a.frame || !b.frame) return 0
    return a.frame.top - b.frame.top
  })
}

const createLines = (wordList: TextElement[]): TextElement[][] => {

  let lines: TextElement[][] = []; // Join words in lines

  for (let i = 0; i < wordList.length; i++) {
    const word = wordList[i];

    if (!word.frame) continue;

    if (i === 0) {
      lines.push([word]);
      continue;
    }

    const lastLineIndex = lines.length - 1
    const midFrameY = word.frame.top + word.frame.height * 0.5;
    const lineTopAndBottom = avgLineTopAndBottom(lines[lastLineIndex])
    if (!lineTopAndBottom) continue;
    if (midFrameY >= lineTopAndBottom.top &&
      midFrameY < lineTopAndBottom.bottom
    ) {
      lines[lastLineIndex].push(word)
    } else {
      lines.push([word])
    }
  }
  return lines;
}

const avgLineTopAndBottom = (line: TextElement[]): { top: number, bottom: number } => {
  let sumOfTops: number = 0;
  let sumOfBottoms: number = 0;


  for (const word of line) {
    if (!word.frame) continue;
    sumOfTops += word.frame.top;
    sumOfBottoms += word.frame.top + word.frame.height;
  }
  const avgTop: number = sumOfTops / line.length
  const avgBottom: number = sumOfBottoms / line.length

  const result = { top: avgTop, bottom: avgBottom }
  return result
}

const sortLineElementsHorizontally = (lines: TextElement[][]) => {
  lines.forEach(line => line.sort((a: TextElement, b: TextElement) => {
    if (!a.frame || !b.frame) return 0;
    return a.frame.left - b.frame.left;
  }))
}

const formatLines = (lines: TextElement[][]): Line[] => {
  let formatedLines: Line[] = []
  for (const line of lines) {
    let formatedLine: Line = {
      words: [],
      text: ''
    }
    for (const word of line) {
      formatedLine.words.push(word);
      formatedLine.text += word.text + ' ';
    }
    formatedLine.text = formatedLine.text.trimEnd(); // remove trailing spaces
    formatedLines.push(formatedLine)
  }
  return formatedLines;
}

const parseReceipt = (ocrInfo: OcrInfo): Product[] | undefined => {

  // https://stackoverflow.com/questions/6476994/using-or-operator-in-javascript-switch-statement
  switch (ocrInfo.store.name) {
    case STORES[0]: // 'walmart'
    case STORES[1]: // 'maxipali'
    case STORES[2]: // 'pali'
      const productList: Product[] | undefined = parseWalmartReceipt(ocrInfo);
      return productList;

    default:
      console.error('Store not supported, using default: Walmart')
      const productListErrorCase: Product[] | undefined = parseWalmartReceipt(ocrInfo);
      return productListErrorCase;
  }
}





// const processText = async (extractedText) => {
//   for (let i = 0; i < extractedText.blocks.length; i++) {
//     const block = extractedText.blocks[i];

//     // Loop through each line in the block
//     for (let j = 0; j < block.lines.length; j++) {
//       const line = block.lines[j];
//       insertSortedVertically(line);
//     }
//   }

//   joinSameLineSections();
//   getProductFromLine();

//   for (let lineIndex = 0; lineIndex < lineList.length; lineIndex++) {
//     lineList[lineIndex] = extractWordsOfALine(lineList[lineIndex]);
//   }

//   return lineList;
// };

// const insertSortedVertically = async (line) => {
//   if (lineList.length == 0) {
//     await lineList.push(line);
//     return;
//   }
//   for (let i = 0; i < lineList.length; i++) {
//     if (lineList[i].frame.top < line.frame.top) {
//       lineList.splice(i, 0, line);
//       return;
//     }
//   }
//   lineList.push(line);
// }

// const insertSortedHorizontally = (element, list) => {
//   if (list.length == 0) {
//     list.push(element);
//     return;
//   }
//   for (let i = 0; i < list.length; i++) {
//     if (list[i].frame.left > element.frame.left) {
//       list.splice(i, 0, element);
//       return;
//     }
//   }
//   list.push(element);
// }

// const joinSameLineSections = () => {
//   const lineHeightAvg = calculateLineHeightAvg(lineList);
//   for (let i = 0; i < lineList.length; i++) {
//     let line = lineList[i];
//     let nextLine = lineList[i + 1];
//     if (!nextLine) break;
//     let centerPointDifference = ((line.frame.top + line.frame.height / 2) - (nextLine.frame.top + nextLine.frame.height / 2));
//     if (0 <= centerPointDifference && centerPointDifference <= (lineHeightAvg / 2)) {
//       nextLine.elements.forEach(elem => {
//         insertSortedHorizontally(elem, line.elements);
//       });

//       let text = "";
//       for (let j = 0; j < line.elements.length; j++) {
//         text += line.elements[j].text + " ";
//       }
//       text = text.slice(0, -1);
//       line.text = text;

//       var index = lineList.indexOf(nextLine);
//       if (index > -1) {
//         lineList.splice(index, 1);
//       }
//       i--;
//     }
//   }
//   lineList.reverse();
// }


// const extractWordsOfALine = (line) => {
//   let notNeededWords = [
//     "ced",
//     "jur",
//     "tda#",
//     "cta #",
//     "# de auto",
//     "tiquete",
//     "electronico",
//     "clave",
//     "numerica",
//     "consulte",
//     "voucher",
//     "web",
//     "https",
//     "www",
//     ".net",
//   ];
//   lineWordList = [];
//   let discardLine = false;
//   for (let k = 0; k < line.elements.length; k++) {
//     const element = line.elements[k];

//     // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
//     const word = element.text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
//     if (notNeededWords.indexOf(word.toLowerCase()) > -1) {
//       discard.concat(line);
//       break;
//     }
//   }
//   if (!discardLine) lineWordList.push(line.text);
//   return lineWordList;
// }

// // /(?<= )\d{11,16}K?/gm
// // /[a-z0-9 ]+(?= \d{11,16}K?)/gim
// // /(?<=[0-9]{10} )([0-9]{0,3}(,||.)[0-9]{0,3}(,||.)([0-9 ])*G)/gm
// const getProductFromLine = () => {
//   for (let i = 0; i < lineList.length; i++) {
//     const lineText = lineList[i].text || "";
//     // verify if there's a prodCode in the line
//     console.log("----------" + lineText)
//     if (!(/(?<= )\d{11,16}(?!\d)K?/.test(lineText))) continue;
//     // gets the prodCode, prodName and/or totalPrice if exists
//     const nameMatch = lineText.match(/[a-z0-9 ]+(?= \d{11,16}K?)/i);
//     const prodCodeMatch = lineText.match(/(?<= )\d{11,16}K?/);
//     /*
//      remove commas and last space from prices
//     */
//     const totalPriceMatch = lineText.match(/(?<=[0-9]{10}.* +)([0-9]{0,3}(,|.)[0-9]{0,3}(,|.)([0-9 ])*)(?=(\s*G))/g);
//     /*-------
//     if there's name, id and price in the same line it means that only one
//     product was bought, so quantity = 1, unitPrice = totalPrice
//     --------*/
//     if (nameMatch && prodCodeMatch && totalPriceMatch) {
//       let totalPriceMatchCleanStr = totalPriceMatch[0].slice(0, -1).replace(/[.,\s]/g, '');
//       if (totalPriceMatch[0][-2] == " ") {
//         totalPriceMatchCleanStr = totalPriceMatch[0].slice(0, -2).replace(/[.,\s]/g, '')
//       }
//       let product = {
//         name: nameMatch[0],
//         prodCode: prodCodeMatch[0],
//         quantity: "1",
//         unitPrice: totalPriceMatchCleanStr,
//         totalPrice: totalPriceMatchCleanStr,
//         soldByKg: 0,
//       };
//       products.push(product);

//       /*-------
//       if there's just name and id it means that probably quantity > 0 and the data for
//       quantity, unitPrice and totalPrice is in the next line
//       --------*/
//     } else if (nameMatch && prodCodeMatch) {
//       if (!lineList[i + 1]) break;
//       let joinWithNextLine = lineText + " " + lineList[i + 1].text;
//       if (lineList[i + 2]) {
//         joinWithNextLine = lineText + " " + lineList[i + 1].text + " " + lineList[i + 2].text;
//       }
//       const totalPriceMatchOnNextLine = joinWithNextLine.match(/(?<=[0-9]{10}\s*(?:.*\s*)?)(\d{1,3}(?:[.,]\d{1,3})*\s*G)/g);
//       console.log(joinWithNextLine);
//       if (!totalPriceMatchOnNextLine) break;
//       // lookbehind product id, matches a number, lookahead for an "x", unit price and total price
//       const quantity = joinWithNextLine.match(/(?<=[0-9]{10}\s+)\d+(?=(\s*x\s*[\$¢]*(\d{1,3})([.,]*\d{1,3})*\s*(\d{1,3})([.,]*\d{1,3})*\s*G))/gi);
//       // lookbehind product id, quantity bought and a "x", then matches the unit price, lookahead for an "X", unit price and total price
//       const unitPrice = joinWithNextLine.match(/(?<=[0-9]{10}\s+\d+\s*x\s*[\$¢]*)(\d{1,3})([.,]*\d{1,3})(?=(\s*(\d{1,3})([.,]*\d{1,3})*\s*G))/gi)

//       let totalPriceMatchOnNextLineCleanStr = totalPriceMatchOnNextLine[0].slice(0, -1).replace(/[.,\s]/g, '');
//       if (totalPriceMatchOnNextLine[0][-2] == " ") {
//         totalPriceMatchOnNextLineCleanStr = totalPriceMatchOnNextLine[0].slice(0, -2).replace(/[.,\s]/g, '')
//       }
//       let product;
//       /*--------------------
//       TODO: MANAGE IDS WITH K
//       --------------------*/
//       if (prodCodeMatch[0].slice(-1).toLowerCase() == "k") {
//         const weightInKg = joinWithNextLine.match(/(?<=[0-9]{10}k\s+)((\d{1,3}[.,])*\d{1,3})/gi);
//         const priceByKg = joinWithNextLine.match(/(?<=[0-9]{10}k\s+(\d{1,3}[.,])*\d{1,3}\s*k*[a-z0-9]\s*A\s*)((\d{1,3}[.,])*\d{1,3})/gi);
//         console.log(priceByKg);
//         product = {
//           name: nameMatch[0],
//           prodCode: prodCodeMatch[0],
//           quantity: weightInKg[0],
//           unitPrice: priceByKg[0],
//           totalPrice: totalPriceMatchOnNextLineCleanStr,
//           soldByKg: 1, // true
//         };
//       } else {
//         let quantityNumber;
//         let uPrice;
//         quantity ? quantityNumber = quantity : quantityNumber = 1;
//         unitPrice ? uPrice = unitPrice : uPrice = totalPriceMatchOnNextLineCleanStr;
//         product = {
//           name: nameMatch[0],
//           prodCode: prodCodeMatch[0],
//           quantity: quantityNumber,
//           unitPrice: uPrice,
//           totalPrice: totalPriceMatchOnNextLineCleanStr,
//           soldByKg: 0, // false
//         };
//       }
//       products.push(product);
//     }


//   }
//   return products;
// }

// const calculateLineHeightAvg = (lineList) => {
//   let counter = 0;
//   let heightSum = 0;

//   for (let j = 0; j < lineList.length; j++) {
//     heightSum += lineList[j].frame.height;
//     counter++;
//   }
//   const averageHeight = heightSum / counter;
//   return averageHeight;

// }


// /*--------------------
// TODO: check inserts
// --------------------*/
// export const addToDB = async (products, date, db) => {
//   const purchaseId = await addPurchase(db, date);
//   // console.log(products);
//   products.forEach(async (product) => {

//     // console.log(product.prodCode);

//     const productRow = await findProductByCode(db, product.prodCode);
//     // console.log("prodRow")
//     // console.log(productRow);
//     let productId;
//     if (productRow != null) {
//       productId = productRow.id;
//       // console.log("before update product");
//       await updateProductPrice(db, product.prodCode, product.unitPrice);
//       // console.log("after update product");
//     } else {
//       // console.log("before add product:" + productId);
//       productId = await addProduct(db, product);
//       // console.log("after add product:" + productId);
//     }
//     await addProductPrice(db, productId, product.unitPrice, date);
//     await addPurchaseItem(db, purchaseId, productId, product.unitPrice, product.quantity, product.totalPrice);

//   });
//   // const tableList = ["product", "product_price", "purchase", "purchase_items"];
//   // setTimeout(async () => {
//   //   console.log("reading tables")
//   //   for (const tableName of tableList) {
//   //     try {
//   //       const [result] = await db.executeSql(`SELECT * FROM ${tableName};`);
//   //       const rows = [];
//   //       for (let i = 0; i < result.rows.length; i++) {
//   //         rows.push(result.rows.item(i));
//   //       }
//   //       console.log(`📋 Contents of ${tableName}:`, rows);
//   //     } catch (error) {
//   //       console.error(`❌ Error reading ${tableName}:`, error);
//   //     }
//   //   }
//   // }, 3000);
// }