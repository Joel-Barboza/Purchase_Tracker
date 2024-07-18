import TextRecognition from "@react-native-ml-kit/text-recognition";

export const ExtractText = async (image) => {
  if (image !== "") {
    const result = await TextRecognition.recognize(`file://${image}`);
    const { wordList, discard } = processText(result);
    // const sorted = sortByYCood(result);
    // console.log(sorted);
    return { wordList, discard };
    // return result.text;
  }
  return { wordList: [], discard: [] };
};

const processText = (extractedText) => {
  let wordList = [];
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
    "tc#",
  ];
  let discard = [];
  let orderedList = [];
  let productNumbers = { common: [], specific: [] };
  for (let i = 0; i < extractedText.blocks.length; i++) {
    const block = extractedText.blocks[i];

    // console.log(block.text);

    // Loop through each line in the block
    for (let j = 0; j < block.lines.length; j++) {
      const line = block.lines[j];
      // console.log(line.text);

      let discardLine = false;
      // Loop through each element in the line
      for (let k = 0; k < line.elements.length; k++) {
        const element = line.elements[k];
        orderedList.push([element.frame.top, element.text]);

        // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
        const word = element.text
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        if (notNeededWords.indexOf(word.toLowerCase()) > -1) {
          discard.concat(line);
          // block.remove(lines[j]);

          if (j > -1) {
            block.lines.splice(j, 1);
            discardLine = true;
          }
          if (j > 0) {
            j--;
          }
          break;
        } else {
          //console.log("fajsdflajsdlfj");
        }
      }
      if (!discardLine) {
        wordList.push(line.text);
        const prodNum = checkProductNum(line.text);

        if (prodNum.isCommon !== null) {
          prodNum.isCommon
            ? productNumbers.common.push(prodNum.number)
            : productNumbers.specific.push(prodNum.number);
        }
      }
    }
  }
  // console.log("asdijfioadfj" + JSON.stringify(discard));
  // console.log("eeeee" + JSON.stringify(productNumbers));
  // console.log(JSON.stringify(extractedText));
  // console.log("CORP. SUPERMERCADOS UNIDOS S.R.L.\nMAXI PALI PURISCAL\n506-2416-2218\nTDA#4390 0P#00000171 TE# 004 TR# 65349\nMOLI DA KIMBY 743100250713\nTILAPIA UNI 744107826019\nTE BCO500ML\nPOSTA\nCED JUR. 3-102-007223\nMAXIPALI\nGELATINA UVA 76223001 3408\nPEZUNA\n2 X ¢320\n2613253030441K\n1.018Ks A 2,990/Kg\n2613262059891K\n2.218Kg A 2,700/K9\nCOMBU SUt\nI744107420167\nDP COMB T72G 74410016094\nBOLSA TERMIC 04183838444\nSubtotal ¢\nTotal ¢\nTARJETAS ON ¢\nIVAZ\nG 1%\nG13%\n7 X ¢500\n76400900839\n2 X ¢500\nPRECIOS INCLUYEN IMP, VALOR\nPRECIO\n16,419\nCAMBIO ¢\n8,735\nTOTAL IVA A PAGAR ¢ 1,289\nIVA\n154\n1, 135\n# ARTS. VENDID0S\nCTA #: 51677708 **** **** I\n# DE AUTO, : 744820\n17\ni,600 G\n3, 500 G\n1,000 G\nTC# 2731 3222940661081 1110\n640 G\n3,044G\n5,989 G\n2,400 G\n5,970 G\n1,300 G\n25.443\n25,443\n25,443\nAGREGADO\n0\nTOTAL\n15,573\n9,870\nTiguete Electrónico 25400004040000361 381")
  sortByYCood(orderedList);
  return { wordList, discard };
};

// https://coreui.io/blog/how-to-check-if-string-is-number-in-javascript/
const isNumeric = (string) => /^[+-]?\d+(\.|\,\d+)?$/.test(string);

const checkProductNum = (line) => {
  let isProductNumber = { isCommon: null, number: null };

  const spacesRemoved = line.replace(/\s/g, "");
  // https://stackoverflow.com/questions/7864971/regular-expression-for-number-with-length-of-4-5-or-6
  const search = spacesRemoved.search(/\d{11,13}$/);

  const number = spacesRemoved.slice(search, search + 13);
  const checkNumeric = isNumeric(number);

  if (checkNumeric & (number.toString().length >= 11)) {
    number.toString()[0] === "7"
      ? (isProductNumber.isCommon = true)
      : (isProductNumber.isCommon = false);
    isProductNumber.number = number;
    // console.log(`${spacesRemoved.slice(0, search)}: ${number}`)
  }
  

  return isProductNumber;
};

const sortByYCood = (list) => {
  

  let start = 0;
  let end = list.length - 1;
  let sorted = list.sort((first, second) => second[0] - first[0]);
  for (let i = 0; i < sorted.length;i++) {
    console.log(sorted[i][1]);
  }

  binarySearch(sorted, 2725, start, end)

  


}

// group them by lines 

let binarySearch = function (arr, x, start, end) {
 
  // console.log(arr);
  // Base Condition
  if (start > end) return console.log(`False: ${start} ${end} ${arr[end]} ${x} ${arr[start]}`);

  // Find the middle index
  let mid = Math.floor((start + end) / 2);

  // Compare mid with given key x
  if (arr[mid][0] === x) return console.log(`True: ${start} ${end}`);

  // If element at mid is greater than x,
  // search in the left half of mid
  if (arr[mid][0] > x)
      return binarySearch(arr, x, start, mid - 1);
  else

      // If element at mid is smaller than x,
      // search in the right half of mid
      return binarySearch(arr, x, mid + 1, end);
}
