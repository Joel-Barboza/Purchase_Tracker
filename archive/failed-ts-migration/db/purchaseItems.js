import { useDb } from "../src/context/DbContext";

export const createPurchaseItemsTable = async (db) => {
    const purchaseItemsQuery = `
     CREATE TABLE IF NOT EXISTS purchase_items (
        id INTEGER PRIMARY KEY,
        purchase_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        total_price INTEGER NOT NULL,
        FOREIGN KEY (purchase_id) REFERENCES purchase(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
    )`;
    try {
        await db.executeSql(purchaseItemsQuery)
        console.log("Purchase items table created");
    } catch (error) {
        console.error(error)
        return null;
    }
}

export const addPurchaseItem = async (db, purchaseId, productId, unitPrice, quantity, total_price) => {
    const query = "INSERT INTO purchase_items (purchase_id, product_id, unit_price, quantity, total_price) VALUES (?, ?, ?, ?, ?);";
    try {
        await db.executeSql(query, [purchaseId, productId, unitPrice, quantity, total_price]);
        console.log(`Insert purchase Item of ${[purchaseId, productId, unitPrice, quantity, total_price]}`);
    } catch (error) {
        console.error("Error Inserting purchase item:", error);
    }
}