import TextRecognition from "@react-native-ml-kit/text-recognition";

export const ExtractText = async (image) => {
  if (image !== "") {
    const result = await TextRecognition.recognize(`file://${image}`);
    const {wordList, discard} = processText(result);

    return {wordList, discard};
    // return result.text;
  }
  return {wordList: [], discard: []};
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
  ];
  let discard = [];
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
        // console.log(element.text);

        // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
        const word = element.text.normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
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
      if (!discardLine) wordList.push(line.text);
    }
  }
  console.log("asdijfioadfj" + JSON.stringify(discard));
  // console.log(JSON.stringify(wordList));
  return {wordList, discard};
};
