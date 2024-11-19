import TextRecognition from "@react-native-ml-kit/text-recognition";

let list = [];
let products = [];
let discard = [];


export const ExtractText = async (image) => {
  if (image !== "") {
    list = [];
    products = [];
    discard = [];
    const result = await TextRecognition.recognize(`file://${image}`);
    const wordList = processText(result);
    return { wordList, discard, products };
  }
  return { wordList: [], discard: [], products: [] };
};

const processText = (extractedText) => {
  for (let i = 0; i < extractedText.blocks.length; i++) {
    const block = extractedText.blocks[i];

    // Loop through each line in the block
    for (let j = 0; j < block.lines.length; j++) {
      const line = block.lines[j];
      insertSortedVertically(line, list);
    }
  }

  joinSameLineSections();
  getProductFromLine();

  for (let lineIndex = 0; lineIndex < list.length; lineIndex++) {
    list[lineIndex] = extractWordsOfALine(list[lineIndex]);
  }

  return list;
};

const insertSortedVertically = (line, list) => {
  if (list.length == 0) {
    list.push(line);
    return;
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].frame.top < line.frame.top) {
      list.splice(i, 0, line);
      return;
    }
  }
  list.push(line);
}

const insertSortedHorizontally = (element, list) => {
  if (list.length == 0) {
    list.push(element);
    return;
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].frame.left > element.frame.left) {
      list.splice(i, 0, element);
      return;
    }
  }
  list.push(element);
}

const joinSameLineSections = () => {
  const lineHeightAvg = calculateLineHeightAvg(list);
  for (let i = 0; i < list.length; i++) {
    let line = list[i];
    let nextLine = list[i + 1];
    if (!nextLine) break;
    let centerPointDifference = ((line.frame.top + line.frame.height / 2) - (nextLine.frame.top + nextLine.frame.height / 2));
    if (0 <= centerPointDifference && centerPointDifference <= (lineHeightAvg / 2)) {
      nextLine.elements.forEach(elem => {
        insertSortedHorizontally(elem, line.elements);
      });

      let text = "";
      for (let j = 0; j < line.elements.length; j++) {
        text += line.elements[j].text + " ";
      }
      text = text.slice(0, -1);
      line.text = text;

      var index = list.indexOf(nextLine);
      if (index > -1) {
        list.splice(index, 1);
      }
      i--;
    }
  }
  list.reverse();
}


const extractWordsOfALine = (line) => {
  let notNeededWords = [
    "ced",
    "jur",
    "tda#",
    "cta #",
    "# de auto",
    "tiquete",
    "electronico",
    "clave",
    "numerica",
    "consulte",
    "voucher",
    "web",
    "https",
    "www",
    ".net",
  ];
  lineWordList = [];
  let discardLine = false;
  for (let k = 0; k < line.elements.length; k++) {
    const element = line.elements[k];

    // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
    const word = element.text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    if (notNeededWords.indexOf(word.toLowerCase()) > -1) {
      discard.concat(line);
      break;
    }
  }
  if (!discardLine) lineWordList.push(line.text);
  return lineWordList;
}

// /(?<= )\d{11,16}K?/gm
// /[a-z0-9 ]+(?= \d{11,16}K?)/gim
// /(?<=[0-9]{10} )([0-9]{0,3}(,||.)[0-9]{0,3}(,||.)([0-9 ])*G)/gm
const getProductFromLine = () => {
  for (let i = 0; i < list.length; i++) {
    const lineText = list[i].text || "";
    if (/(?<= )\d{11,16}(?!\d)K?/.test(lineText)) {
      const nameMatch = lineText.match(/[a-z0-9 ]+(?= \d{11,16}K?)/i);
      const prodIdMatch = lineText.match(/(?<= )\d{11,16}K?/);
      const totalPriceMatch = lineText.match(/(?<=[0-9]{10} +)([0-9]{0,3}(,|.)[0-9]{0,3}(,|.)([0-9 ])*G)/g);
      if (nameMatch && prodIdMatch && totalPriceMatch) {
        let totalPriceMatchCleanStr = totalPriceMatch[0].slice(0, -1);
        if (totalPriceMatch[0][-2] == " ") {
          totalPriceMatchCleanStr = totalPriceMatch[0].slice(0, -2)
        }
        let product = {
          name: nameMatch[0],
          prodId: prodIdMatch[0],
          totalPrice: totalPriceMatchCleanStr
        };
        products.push(product);
      } else if (nameMatch && prodIdMatch) {
        if (!list[i + 1]) break;
        let joinWithNextLine = lineText + " " + list[i + 1].text;
        if (list[i + 2]) {
          joinWithNextLine = lineText + " " + list[i + 1].text + " " + list[i + 2].text;
        }
        const totalPriceMatchOnNextLine = joinWithNextLine.match(/(?<=[0-9]{10}\s*(?:.*\s*)?)(\d{1,3}(?:[.,]\d{1,3})*\s*G)/g);
        if (!totalPriceMatchOnNextLine) break;

        let totalPriceMatchOnNextLineCleanStr = totalPriceMatchOnNextLine[0].slice(0, -1);
        if (totalPriceMatchOnNextLine[0][-2] == " ") {
          totalPriceMatchOnNextLineCleanStr = totalPriceMatchOnNextLine[0].slice(0, -2)
        }
        let product = {
          name: nameMatch[0],
          prodId: prodIdMatch[0],
          totalPrice: totalPriceMatchOnNextLineCleanStr
        };
        products.push(product);
      }
    }

  }
  return products;
}

const calculateLineHeightAvg = (lineList) => {
  let counter = 0;
  let heightSum = 0;

  for (let j = 0; j < lineList.length; j++) {
    heightSum += lineList[j].frame.height;
    counter++;
  }
  const averageHeight = heightSum / counter;
  return averageHeight;

} 