//import SQLite from "react-native-sqlite-storage"
import { createMMKV, useMMKV } from "react-native-mmkv";
import { createProductTable } from "./product";
import { createProductPricesTable } from "./productPrice";
import { createPurchaseTable } from "./purchase";
import { createPurchaseItemsTable } from "./purchaseItems";

// Enable promise for SQLite
// SQLite.enablePromise(true)
export const storage = createMMKV();

export const connectToDatabase = () => {
  // storage.set('products', 'papa');
  const keys = storage.getAllKeys();
  console.log(storage.getString(keys[0]));
  createTables();
  
    // return SQLite.openDatabase(
    //     { 
    //         name: "purchase_tracker.db", 
    //         location: "default" 
    //     },
    //     () => { console.log('Connected to database') },
    //     (error) => {
    //         console.error(error);
    //         throw Error("Could not connect to database");
    //     }
    // )
}

export const createTables = async (db) => {
  const product = {
        "id": 1,
        "product-price": "",
        "product-code": "",
        "is-sold-by-kg": false,
        "prices": [
          {
            "price": 1,
            "updated-on": 2025
          },
          {
            "price": 1,
            "updated-on": 2025
          }
        ]
      }
  const purchase = {
        "id": 1,
        "date": 2025,
        "products": [
          {
            "product-id": 2,
            "unit-price": 2,
            "quantity": 1,
            "total-price": 2
          },
          {
            "product-id": 2,
            "unit-price": 2,
            "quantity": 1,
            "total-price": 2
          }
        ]
      }
  const tables = {
    "products": [],
    "purchases": []
  }
  storage.set("products", JSON.stringify([product,product]));
  const products = storage.getString("products");
  console.log(JSON.parse(products))
    // try {
    //   await db.executeSql("PRAGMA foreign_keys = OFF;");

    //   await db.executeSql("DROP TABLE IF EXISTS product;");
    //   await db.executeSql("DROP TABLE IF EXISTS product_price;");
    //   await db.executeSql("DROP TABLE IF EXISTS purchase;");
    //   await db.executeSql("DROP TABLE IF EXISTS purchase_items;");
    //   await db.executeSql("PRAGMA foreign_keys = ON;");

    //   await createProductTable(db);
    //   await createProductPricesTable(db);
    //   await createPurchaseTable(db);
    //   await createPurchaseItemsTable(db);
    //   console.log("All tables created successfully");
    // } catch (error) {
    //   console.error("Error creating tables", error);
    //   throw new Error("Failed to create tables");
    // }
  };
  

// export const createTabless = async (db) => {
//     const productPricesQuery = `
//         CREATE TABLE IF NOT EXISTS product_price (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             product_id INTEGER NOT NULL,
//             price REAL NOT NULL,
//             updated_on TEXT NOT NULL,
//             FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
//     )
//     `
//     const purchasesQuery = `
//      CREATE TABLE IF NOT EXISTS purchase (
//         id INTEGER PRIMARY KEY,
//         purchase_date TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
//      )
//     `

//     const purchaseItemsQuery = `
//      CREATE TABLE IF NOT EXISTS purchase_items (
//         id INTEGER PRIMARY KEY,
//         purchase_id INTEGER NOT NULL,
//         product_id INTEGER NOT NULL,
//         price_at_purchase REAL NOT NULL,
//         quantity INTEGER NOT NULL,
//         FOREIGN KEY (purchase_id) REFERENCES purchase(id) ON DELETE CASCADE,
//         FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
//     )`
//     try {
//         await db.executeSql(productsQuery)
//         await db.executeSql(productPricesQuery)
//         await db.executeSql(purchasesQuery)
//         await db.executeSql(purchaseItemsQuery)
//         console.log("Tables created");
//     } catch (error) {
//         console.error(error)
//         throw Error(`Failed to create tables`)
//     }
// }
