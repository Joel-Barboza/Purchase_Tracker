import { Platform } from 'react-native';
import { Linking } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Aes from 'react-native-aes-crypto';
import Config from 'react-native-config';
import RNFS from 'react-native-fs';

export const test = async () => {
  try {
    const fileData = await readFromFile();
    console.log(fileData);

  } catch (e) {
    console.error(e)
  }
}

export const generateKey = (password, salt, cost, length) => Aes.pbkdf2(password, salt, cost, length, 'sha256')

export const encryptData = (text, key) => {
  return Aes.randomKey(16).then(iv => {
    return Aes.encrypt(text, key, iv, 'aes-256-cbc').then(cipher => ({
      cipher,
      iv,
    }))
  })
}

const decryptData = (encryptedData, key) => Aes.decrypt(encryptedData.cipher, key, encryptedData.iv, 'aes-256-cbc')



const requestStoragePermission = async () => {
  let permission;

  if (Platform.OS === 'android') {
    const androidVersion = Platform.Version;
    console.log(`Android version: ${androidVersion}`);

    if (androidVersion >= 30) {
      permission = PERMISSIONS.ANDROID.MANAGE_EXTERNAL_STORAGE;//PERMISSIONS.ANDROID.MANAGE_EXTERNAL_STORAGE;
    } else {
      permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
    }
  } else if (Platform.OS === 'ios') {
    permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
  }

  const result = await check(permission);
  console.log(result);
  switch (result) {
    case RESULTS.UNAVAILABLE:
      console.log('This feature is not available on this device/context');
      return false;
    case RESULTS.DENIED:
      const requestResult = await request(permission);
      return requestResult === RESULTS.GRANTED;
    case RESULTS.LIMITED:
      console.log('The permission is limited: some actions are possible');
      return true;
    case RESULTS.GRANTED:
      console.log('The permission is granted');
      return true;
    case RESULTS.BLOCKED:
      console.log('The permission is blocked');
      return false;
  }
}


export const writeToFile = async (content, key) => {
  try {
    // const hasPermission = await requestStoragePermission();
    // if (!hasPermission) {
    //   console.log('Storage permission not granted.');
    //   return;
    // }

    const path = RNFS.DocumentDirectoryPath + '/example.txt';
    console.log(path);

    // Write the encrypted data to the file
    await RNFS.writeFile(path, content, 'utf8');
    console.log('File written successfully');
  } catch (error) {
    console.error('Error writing to file:', error.message);
  }
};

export const readEncrypted = () => {
  // requestStoragePermission();
  const path = RNFS.DocumentDirectoryPath + '/example.txt';

  return new Promise((resolve, reject) => {
    RNFS.readFile(path, 'utf8')
      .then(contents => {
        const parsedContents = JSON.parse(contents);
        // console.log('Parsed Content:', parsedContents);
        const { cipher, iv } = parsedContents;
        console.log(parsedContents);
        // generateKey(
        //   Config.ENCRYPT_PSSWRD,
        //   Config.ENCRYPT_SALT,
        //   parseInt(Config.ENCRYPT_COST),
        //   parseInt(Config.ENCRYPT_LENGTH)
        // ).then(key => {
        //   decryptData({ cipher, iv }, key).then(text => {
        //     resolve(text);
        //   });
        // }
        // );
      })
      .catch(err => {
        console.log('Error reading file:', err.message);
        reject(err);
      });
  });
}

export const readFromFile = () => {
  // requestStoragePermission();
  const path = RNFS.DocumentDirectoryPath + '/example.txt';

  return new Promise((resolve, reject) => {
    RNFS.readFile(path, 'utf8')
      .then(contents => {
        const parsedContents = JSON.parse(contents);
        // console.log('Parsed Content:', parsedContents);
        const { cipher, iv } = parsedContents;
        generateKey(
          Config.ENCRYPT_PSSWRD,
          Config.ENCRYPT_SALT,
          parseInt(Config.ENCRYPT_COST),
          parseInt(Config.ENCRYPT_LENGTH)
        ).then(key => {
          decryptData({ cipher, iv }, key).then(text => {
            resolve(text);
          });
        }
        );
      })
      .catch(err => {
        console.log('Error reading file:', err.message);
        reject(err);
      });
  });


}

export const restartFile = async () => {
  try {
    const fileTemplate = {
      purchases: [], 
      products: []
    }
    const key = await generateKey(Config.ENCRYPT_PSSWRD, Config.ENCRYPT_SALT, parseInt(Config.ENCRYPT_COST), parseInt(Config.ENCRYPT_LENGTH));
    const { cipher: newCipher, iv: newIv } = await encryptData(JSON.stringify(fileTemplate), key);

    // Write the updated encrypted data back to the file
    await writeToFile(JSON.stringify({ cipher: newCipher, iv: newIv }));
    console.log('File updated successfully!');

    const fileData1 = await readFromFile();
    console.log("Restarted:", fileData1);
  } catch (error) {
    console.error('Error while restarting the file', error.message);
  }
}

export const addDataToFile = async (dataToAdd, date) => {
  try {
    // Request storage permission
    // const hasPermission = await requestStoragePermission();
    // if (!hasPermission) {
    //   console.log('Storage permission not granted.');
    //   return;
    // }

    // Read and decrypt the file
    const fileData = await readFromFile();

    console.log('Decrypted Texxxxt:', fileData);
    // Parse the decrypted text and modify it
    const textInJSON = JSON.parse(fileData);
    if (!textInJSON.purchases) {
      textInJSON.purchases = [];
    }
    if (!textInJSON.products) {
      textInJSON.products = [];
    }
    let purchase = [];
    dataToAdd.forEach(element => {
      purchase.push(element);
      const product = textInJSON.products.find(item => item.prodId === element.prodId);
      if (!product) {
        textInJSON.products.push(element);
      }
      
    });
    if (purchase != []) {
      textInJSON.purchases.push([date, purchase]);
    }
    console.log("working");

    // Encrypt the updated data
    const key = await generateKey(Config.ENCRYPT_PSSWRD, Config.ENCRYPT_SALT, parseInt(Config.ENCRYPT_COST), parseInt(Config.ENCRYPT_LENGTH));
    const { cipher: newCipher, iv: newIv } = await encryptData(JSON.stringify(textInJSON), key);

    // Write the updated encrypted data back to the file
    await writeToFile(JSON.stringify({ cipher: newCipher, iv: newIv }));
    console.log('File updated successfully!');

    const fileData1 = await readFromFile();
    console.log('after insert', fileData1);
  } catch (error) {
    console.error('Error in addDataToFile:', error.message);
  }
};
