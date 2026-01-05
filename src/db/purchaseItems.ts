import { NitroSQLiteConnection } from "react-native-nitro-sqlite";

export const createPurchaseItemsTable = async (db: NitroSQLiteConnection): Promise<void> => {
  
  const purchaseItemsQuery: string = `
     CREATE TABLE IF NOT EXISTS purchase_items (
        id INTEGER PRIMARY KEY,
        purchase_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        quantity REAL NOT NULL,
        total_price REAL NOT NULL,
        FOREIGN KEY (purchase_id) REFERENCES purchase(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
    )`;
  try {
    await db.executeAsync(purchaseItemsQuery)
    console.log("Purchase items table created");
  } catch (error) {
    console.error(error)
    return;
  }
}

export const addPurchaseItem = async (
  db: NitroSQLiteConnection, purchaseId: number, productId: number, unitPrice: number, quantity: number, total_price: number
): Promise<void> => {

  const query = "INSERT INTO purchase_items (purchase_id, product_id, unit_price, quantity, total_price) VALUES (?, ?, ?, ?, ?);";
  try {
    await db.executeAsync(query, [purchaseId, productId, unitPrice, quantity, total_price]);
    console.log(`Insert purchase Item of ${[purchaseId, productId, unitPrice, quantity, total_price]}`);
  } catch (error) {
    console.error("Error Inserting purchase item:", error);
  }
}