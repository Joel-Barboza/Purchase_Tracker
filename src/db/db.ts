import { NitroSQLiteConnection, open } from 'react-native-nitro-sqlite'
import { createPurchaseTable } from './purchase';
import { createPurchaseItemsTable } from './purchaseItems';
import { createProductTable } from './product';
import { createProductPricesTable } from './productPrice';

export const connectToDatabase = async (): Promise<NitroSQLiteConnection | undefined> => {
  try {
    const db = open({ name: 'myDb.sqlite' });
    return db;
  } catch (e) {
    if (e instanceof Error) {
      console.error('Something went wrong connecting to the DB:', e.message);
    } else {
      console.error('Something went wrong connecting to the DB:', e);
    }
  }
}


export const createTables = async (db: NitroSQLiteConnection): Promise<void>=> {
    try {
      await db.executeAsync("PRAGMA foreign_keys = OFF;");


      // await db.executeAsync("DROP TABLE IF EXISTS receipt;");
      // await db.executeAsync("DROP TABLE IF EXISTS product;");
      // await db.executeAsync("DROP TABLE IF EXISTS product_price;");
      // await db.executeAsync("DROP TABLE IF EXISTS purchase;");
      // await db.executeAsync("DROP TABLE IF EXISTS purchase_items;");
      await db.executeAsync("PRAGMA foreign_keys = ON;");


      // await createReceiptTable(db);
      await createProductTable(db);
      await createProductPricesTable(db);
      await createPurchaseTable(db);
      await createPurchaseItemsTable(db);
      console.log("All tables created successfully");
    } catch (error) {
      console.error("Error creating tables", error);
      throw new Error("Failed to create tables");
    }
  };
// The db object now contains the following methods:
// db = {
//   close: () => void,
//   delete: () => void,
//   attach: (dbNameToAttach: string, alias: string, location?: string) => void,
//   detach: (alias: string) => void,
//   transaction: (fn: (tx: Transaction) => void) => Promise<void>,
//   executeAsync: (query: string, params?: any[]) => QueryResult,
//   executeAsyncAsync: (
//     query: string,
//     params?: any[]
//   ) => Promise<QueryResult>,
//   executeAsyncBatch: (commands: BatchQueryCommand[]) => BatchQueryResult,
//   executeAsyncBatchAsync: (commands: BatchQueryCommand[]) => Promise<BatchQueryResult>,
//   loadFile: (location: string) => FileLoadResult;,
//   loadFileAsync: (location: string) => Promise<FileLoadResult>
// }