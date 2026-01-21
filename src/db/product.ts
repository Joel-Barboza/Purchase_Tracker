import {
  NITRO_SQLITE_NULL,
  NitroSQLiteConnection,
  QueryResult,
  QueryResultRow,
} from 'react-native-nitro-sqlite';
import { CategoryName, Product } from '../utils/types';

export const createProductTable = async (
  db: NitroSQLiteConnection,
): Promise<void> => {
  const productsQuery = `
        CREATE TABLE IF NOT EXISTS product (
            id INTEGER PRIMARY KEY,
            product_name TEXT NOT NULL,
            product_code TEXT UNIQUE,
            last_price REAL NOT NULL,
            sold_by_kg INTEGER NOT NULL,
            category TEXT NOT NULL
      )
    `;
  try {
    await db.executeAsync(productsQuery);
    console.log('Products table created');
  } catch (error) {
    console.error(error);
    throw Error(`Failed to create products table`);
  }
};

export const addProduct = async (
  db: NitroSQLiteConnection,
  product: Product,
): Promise<number | undefined> => {
  const { name, prodCode, unitPrice, soldByKg, category } = product;
  const query =
    'INSERT INTO product (product_name, product_code, last_price, sold_by_kg, category) VALUES (?, ?, ?, ?, ?);';
  try {
    const result: QueryResult<QueryResultRow> = await db.executeAsync(query, [
      name,
      prodCode ?? NITRO_SQLITE_NULL,
      unitPrice,
      soldByKg,
      category,
    ]);
    const insertedId: number | undefined = result.insertId; // Get the auto-generated ID // // to pass to productPrice if needed
    console.log('New Product ID:', insertedId);
    return insertedId;
  } catch (error) {
    console.error('Error inserting product:', error);
    return;
  }
};

export const updateProductPrice = async (
  db: NitroSQLiteConnection,
  productCode: string,
  newPrice: number,
): Promise<void> => {
  const query: string = `
      UPDATE product
      SET last_price = ?
      WHERE product_code = ?;
    `;
  try {
    await db.executeAsync(query, [newPrice, productCode]);
    console.log(`Updated price of ${productCode} to ${newPrice}`);
  } catch (error) {
    console.error('Error updating price:', error);
  }
};

export const updateProductCategory = async (
  db: NitroSQLiteConnection,
  productCode: string,
  newCategory: CategoryName,
): Promise<void> => {
  const query: string = `
      UPDATE product
      SET category = ?
      WHERE product_code = ?;
    `;
  try {
    await db.executeAsync(query, [newCategory, productCode]);
    console.log(`Updated category of ${productCode} to ${newCategory}`);
  } catch (error) {
    console.error('Error updating category:', error);
  }
};

export const findProductByCode = async (
  db: NitroSQLiteConnection,
  productCode: string,
): Promise<QueryResultRow | undefined> => {
  const query: string = 'SELECT * FROM product WHERE product_code = ?;';
  try {
    const result: QueryResult<QueryResultRow> = await db.executeAsync(query, [
      productCode,
    ]);
    if (!result.rows) return;
    if (result.rows.length > 0) {
      console.log(`Found product ${result.rows.item(0)}`);
      return result.rows.item(0);
    } else {
      return;
    }
  } catch (error) {
    console.error('Error finding product:', error);
    // if (error.code == 0) {
    //     await addProduct(db, {
    //         name: "testProduct",
    //         prodCode: "1234567890",
    //         quantity: 0,
    //         unitPrice: 0,
    //         totalPrice: 0,
    //         soldByKg: 0,
    //     });
    // }
    return;
  }
};

export const getAllProducts = async (db: NitroSQLiteConnection) => {
  try {
    const result: QueryResult<QueryResultRow> = await db.executeAsync(
      `SELECT * FROM product;`,
    );
    if (!result.rows) return;
    if (result.rows.length > 0) {
      return result.rows;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error reading products`, error);
  }
};
