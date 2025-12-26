import { NitroSQLiteConnection, QueryResult, QueryResultRow } from "react-native-nitro-sqlite";

export const createReceiptTable = async (db: NitroSQLiteConnection) => {
    const receiptsQuery: string = `
     CREATE TABLE IF NOT EXISTS receipt (
        id INTEGER PRIMARY KEY,
        image_uri TEXT NOT NULL,
        serialized_ocr TEXT NOT NULL,
        receipt_date TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
     )
    `;
    try {
        await db.executeAsync(receiptsQuery)
        console.log("Receipt table created");
    } catch (error) {
        console.error(error)
        throw Error(`Failed to create Receipt table`)
    }
}

export const addReceipt = async (db: NitroSQLiteConnection, uri: string, serializedOcr: string, date: number) => {
    const query: string = "INSERT INTO receipt (image_uri, serialized_ocr, receipt_date) VALUES (?, ?, ?);";
    try {
        const result: QueryResult<QueryResultRow> = await db.executeAsync(query, [uri, serializedOcr, date.toString()]);
        const insertedId: number | undefined = result.insertId; // Get the auto-generated ID // // to pass to productPrice if needed
        console.log("Receipt ID:", insertedId);
        return insertedId;

    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getReceipts = async (db: NitroSQLiteConnection) => {
    const query = "SELECT * FROM receipt;";
    try {
        const result: QueryResult<QueryResultRow> = await db.executeAsync(query);
        if (!result.rows) return null;
        if (result.rows.length > 0) {
            console.log(result);
            // return result.rows;
            return null;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting receipt:", error);
        return null;
    }
}