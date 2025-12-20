import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { connectToDatabase, createTables } from "../../db/db";

const DbContext = createContext(null);

export const useDb = () => useContext(DbContext);

export const DbProvider = ({ children }) => {
    const [db, setDb] = useState(null);
    const [loading, setLoading] = useState(true);


    const loadData = useCallback(async () => {
        try {
            const connection = await connectToDatabase();
            await connection.executeSql("PRAGMA foreign_keys = ON;");
            await createTables(connection);
            setDb(connection);
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        loadData()
    }, [loadData])


    if (loading) {
        return null;
    }


    return (
        <DbContext.Provider value={db}>
            {children}
        </DbContext.Provider>
    );

}