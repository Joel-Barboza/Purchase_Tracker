import {
  NITRO_SQLITE_NULL,
  NitroSQLiteConnection,
  QueryResult,
  QueryResultRow,
} from 'react-native-nitro-sqlite';
import { PurchaseRow, Store } from '../utils/types';

export const createPurchaseTable = async (
  db: NitroSQLiteConnection,
): Promise<void> => {
  const purchasesQuery = `
     CREATE TABLE IF NOT EXISTS purchase (
      id INTEGER PRIMARY KEY,
      image_uri TEXT,
      serialized_ocr TEXT,
      store TEXT,
      date INTEGER NOT NULL DEFAULT (unixepoch())
     )
    `;
  try {
    await db.executeAsync(purchasesQuery);
    console.log('Purchase table created');
  } catch (error) {
    console.error(error);
    throw Error(`Failed to create Purchase table`);
  }
};

export const addPurchase = async (
  db: NitroSQLiteConnection,
  image_uri: string | null,
  serialized_ocr: string | null,
  store: Store,
): Promise<number | undefined> => {
  const query =
    'INSERT INTO purchase (image_uri, serialized_ocr, store) VALUES (?, ?, ?);';
  try {
    const result: QueryResult<QueryResultRow> = await db.executeAsync(query, [
      image_uri ?? NITRO_SQLITE_NULL,
      serialized_ocr ?? NITRO_SQLITE_NULL,
      store.name ?? NITRO_SQLITE_NULL,
    ]);
    const insertedId: number | undefined = result.insertId; // Get the auto-generated ID // // to pass to productPrice if needed
    console.log('Purchase ID:', insertedId);
    return insertedId;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getAllPurchases = async (
  db: NitroSQLiteConnection,
): Promise<PurchaseRow[] | undefined> => {
  const query = 'SELECT * FROM purchase;';
  try {
    const result: QueryResult<PurchaseRow> = await db.executeAsync<PurchaseRow>(
      query,
    );
    if (!result.rows) return;
    if (result.rows.length > 0) {
      return result.rows._array;
    } else {
      return;
    }
  } catch (error) {
    console.error('Error getting purchase data:', error);
    return;
  }
};
