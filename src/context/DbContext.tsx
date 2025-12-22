import React, { createContext, JSX, useCallback, useContext, useEffect, useState } from "react";
import { connectToDatabase, createTables } from "../db/db";
import { NitroSQLite, NitroSQLiteConnection } from "react-native-nitro-sqlite";
import { Alert, Text, View } from "react-native";

const DbContext = createContext<NitroSQLiteConnection | null>(null);

export const useDb = (): NitroSQLiteConnection | null => useContext(DbContext);

export const DbProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [db, setDb] = useState<NitroSQLiteConnection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  const loadData = useCallback(async (): Promise<void> => {
    try {
      const connection: NitroSQLiteConnection | undefined = await connectToDatabase();
      if (!connection) {
        Alert.alert(
          "Database not available",
          "The database could not be accessed."
        );
        return;
      }

      await connection.executeAsync("PRAGMA foreign_keys = ON;");
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
    return <Loading />;
  }


  return (
    <DbContext.Provider value={db} >
      {children}
    </DbContext.Provider>
  );

}


const Loading = (): JSX.Element => {
  const [text, setText] = useState<string>("Loading");
  const [counter, setCounter] = useState<number>(0);
  const loadingTextSprites: string[] = ["Loading   ", "Loading.  ", "Loading.. ", "Loading..."];

  setTimeout((): void => {
    setCounter((counter + 1) % 4);
    setText(loadingTextSprites[counter]);
  }, 300);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center",backgroundColor: "white"}}>
      <Text>
        {text}
      </Text>
    </View>
  )
}