# About the proyect

## Introduction

Purchase Tracker is a mobile app to hold a records of your supermarket purchases, using an OCR technology to extract the data from the purchase tickets, and storing it to see how much are you spending, where are you spending it and more.

## Feature List

1. OCR to extract data from purchase tickets such as:
    
    * Item name.
    * Price (Unit and total of product, if more than one bought)
    * Total price with and without IVA
    * Product ID

2. Create a list with the products bought by Name, id, price (include if it had a discount)

3. Reminders for when you have spent too much in certain items.


# We will use chocolatey to install packages

[Chocolatey Home Page](https://chocolatey.org/)

[Chocolatey Downloads](https://chocolatey.org/install#individual)

# First, run on admin mode Powershell

```bash
choco install -y nodejs-lts microsoft-openjdk11
```

# Then, follow the setup development environment
[Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment)

[Get Started Without a Framework](https://reactnative.dev/docs/getting-started-without-a-framework)

## To connect to a specific device

### Get available devices ids' (on admin mode):

```bash
adb device
```

### Open on wanted device:
```bash
npx react-native run-android --deviceId=DEVICE_ID-RFCW40L8QBK
```

# To generate apk

```bash
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
```
```bash
cd android
```
```bash
./gradlew assembleDebug
```

Then you can get apk in **app/build/outputs/apk/debug/app-debug.apk**

### If you have problems check:
1. [react-native : El término 'react-native' no se reconoce como nombre de un cmdlet, función, archivo de script o programa ejecutable.](https://stackoverflow.com/questions/38889487/react-native-is-not-recognized-as-an-internal-or-external-command-operable-pr)

2. [react-native : No se puede cargar el archivo C:\Users\\... porque la 
ejecución de scripts está deshabilitada en este sistema.](https://es.stackoverflow.com/questions/321611/problema-con-scripts-en-visual-studio-code)