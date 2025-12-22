// import { NitroSQLiteConnection } from "react-native-nitro-sqlite";

// export const createProductTable = async (db: NitroSQLiteConnection) => {
//     const productsQuery = `
//         CREATE TABLE IF NOT EXISTS product (
//             id INTEGER PRIMARY KEY,
//             product_name TEXT NOT NULL,
//             product_code TEXT UNIQUE,
//             last_price REAL NOT NULL,
//             sold_by_kg INTEGER NOT NULL
//       )
//     `;
//     try {
//         await db.executeAsync(productsQuery);
//         console.log("Products table created");
//     } catch (error) {
//         console.error(error)
//         throw Error(`Failed to create products table`)
//     }
// }

// /*--------------------
// TODO: complete inserts
// --------------------*/
// export const addProduct = async (db: NitroSQLiteConnection, product: any) => {
//     console.log("inside addProduct");
//     const { name, prodCode, unitPrice, soldByKg } = product;
//     const query = "INSERT INTO product (product_name, product_code, last_price, sold_by_kg) VALUES (?, ?, ?, ?);";
//     try {
//         const [result] = await db.executeAsync(query, [name, prodCode, unitPrice, soldByKg]);
//         const insertedId = result.insertId; // Get the auto-generated ID // // to pass to productPrice if needed
//         console.log("New Product ID:", insertedId);
//         return insertedId;

//     } catch (error) {
//         console.error("Error inserting product:", error);
//         return null;
//     }
// }

// export const updateProductPrice = async (db, productCode, newPrice) => {
//     const query = `
//       UPDATE product
//       SET last_price = ?
//       WHERE product_code = ?;
//     `;
//     try {
//         await db.executeAsync(query, [newPrice, productCode]);
//         console.log(`Updated price of ${productCode} to ${newPrice}`);
//     } catch (error) {
//         console.error("Error updating price:", error);
//     }
// };


// export const findProductByCode = async (db, productCode) => {
//     // try {
//     //     const result = await db.executeAsync('PRAGMA table_info(product);');
//     //     console.log("schema: ");
//     //     console.log(result);
//     // } catch (error) {
//     //     console.error('Error checking table schema:', error);
//     // }
//     const query = "SELECT * FROM product WHERE product_code = ?;";
//     try {
//         const [result] = await db.executeAsync(query, [productCode]);
//         if (result.rows.length > 0) {
//             console.log(`Found product ${result.rows.item(0)}`);
//             return result.rows.item(0);
//         } else {
//             return null;
//         }
//     } catch (error) {
//         console.error("Error finding product:", error);
//         // if (error.code == 0) {
//         //     await addProduct(db, {
//         //         name: "testProduct",
//         //         prodCode: "1234567890",
//         //         quantity: 0,
//         //         unitPrice: 0,
//         //         totalPrice: 0,
//         //         soldByKg: 0,
//         //     });
//         // }
//         return null;
//     }
// };

// export const getAllProducts = async (db) => {
//     try {
//         const [result] = await db.executeAsync(`SELECT * FROM product;`);
//         if (result.rows.length > 0) {
//             return result.rows;
//         } else {
//             return null;
//         }
//     } catch (error) {
//         console.error(`Error reading products`, error);
//     }
// }