
export const createProductPricesTable = async (db) => {
    const productPricesQuery = `
        CREATE TABLE IF NOT EXISTS product_price (
            id INTEGER PRIMARY KEY,
            product_id INTEGER NOT NULL,
            price REAL NOT NULL,
            updated_on TEXT NOT NULL,
            FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
    )`;
    try {
        await db.executeSql(productPricesQuery)
        console.log("Product prices table created");
    } catch (error) {
        console.error(error)
        throw Error(`Failed to create product prices table`)
    }
}

export const addProductPrice = async(db, prodId, price, date) => {
    const query = "INSERT INTO product_price (product_id, price, updated_on) VALUES (?, ?, ?);";
    try {
        await db.executeSql(query, [prodId, price, date]);
        console.log(`Insert price of ${prodId} to ${price}`);
    } catch (error) {
        console.error("Error Inserting price:", error);
    }
}

export const getProductPriceById = async(db, prodId) => {
    const query = "SELECT price FROM product_price WHERE product_id = ?;";
    try {
        const [result] = await db.executeSql(query, [prodId]);
        console.log(`Insert price of ${prodId} to ${price}`);
        if (result.rows.length > 0) {
            return result.rows.item(0);
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error Inserting price:", error);
        return null;
    }
}

