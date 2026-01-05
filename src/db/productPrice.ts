import { NitroSQLiteConnection, QueryResultRow } from "react-native-nitro-sqlite";

export const createProductPricesTable = async (db: NitroSQLiteConnection) => {
  const productPricesQuery: string = `
    CREATE TABLE IF NOT EXISTS product_price (
        id INTEGER PRIMARY KEY,
        product_id INTEGER NOT NULL,
        price REAL NOT NULL,
        updated_on INTEGER NOT NULL DEFAULT (unixepoch()),
        FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
    )`;
  try {
    await db.executeAsync(productPricesQuery)
    console.log("Product prices table created");
  } catch (error) {
    console.error(error)
    throw Error(`Failed to create product prices table`)
  }
}

export const addProductPrice = async (
  db: NitroSQLiteConnection, prodId: number, price: number
): Promise<void> => {
  const query: string = "INSERT INTO product_price (product_id, price) VALUES (?, ?);";
  try {
    await db.executeAsync(query, [prodId, price]);
    console.log(`Insert price of ${prodId} to ${price}`);
  } catch (error) {
    console.error("Error Inserting price:", error);
  }
}

export const getProductPriceById = async (
  db: NitroSQLiteConnection, prodId: number
): Promise<QueryResultRow[] | undefined> => {
  const query = "SELECT * FROM product_price WHERE product_id = ?;";
  // const query = "SELECT price FROM product_price WHERE product_id = ?;";
  console.log(prodId);
  try {
    const result = await db.executeAsync(query, [prodId]);
    // console.log(`Insert price of ${prodId} to ${price}`);
    if (!result.rows) return;
    if (result.rows.length > 0) {
      return result.rows._array;
    } else {
      return;
    }
  } catch (error) {
    console.error("Error getting product prices:", error);
    return;
  }
}

