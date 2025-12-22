// import { useDb } from "../context/DbContext";

// export const createPurchaseTable = async (db) => {
//     const purchasesQuery = `
//      CREATE TABLE IF NOT EXISTS purchase (
//         id INTEGER PRIMARY KEY,
//         purchase_date TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
//      )
//     `;
//     try {
//         await db.executeAsync(purchasesQuery)
//         console.log("Purchase table created");
//     } catch (error) {
//         console.error(error)
//         throw Error(`Failed to create Purchase table`)
//     }
// }

// export const addPurchase = async (db, date) => {
//     const query = "INSERT INTO purchase (purchase_date) VALUES (?);";
//     try {
//         const [result] = await db.executeAsync(query, [date.toString()]);
//         const insertedId = result.insertId; // Get the auto-generated ID // // to pass to productPrice if needed
//         console.log("Purchase ID:", insertedId);
//         return insertedId;
        
//     } catch (error) {
//         console.error(error);
//         return null;
//     }
// }

// export const getPurchases = async (db) => {
//     const query = "SELECT * FROM purchase;";
//     try {
//         const [result] = await db.executeAsync(query);
//         if (result.rows.length > 0) {
//             return result.rows;
//         } else {
//             return null;
//         }
//     } catch (error) {
//         console.error("Error Inserting price:", error);
//         return null;
//     }
// }