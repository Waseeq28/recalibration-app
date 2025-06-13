import "react-native-get-random-values";
import { createRxDatabase, addRxPlugin } from "rxdb";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import {
  getRxStorageSQLiteTrial,
  getSQLiteBasicsExpoSQLiteAsync,
} from "rxdb/plugins/storage-sqlite";
import * as SQLite from "expo-sqlite";
import CryptoJS from "crypto-js";
import { collections } from "./schemas";

addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);

const customHashFunction = (input: string): Promise<string> => {
  const hash = CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
  return Promise.resolve(hash);
};

export const initializeRxDb = async () => {
  const db = await createRxDatabase({
    name: "recalibration-app",
    storage: wrappedValidateAjvStorage({
      storage: getRxStorageSQLiteTrial({
        sqliteBasics: getSQLiteBasicsExpoSQLiteAsync(SQLite.openDatabaseAsync),
      }),
    }),
    multiInstance: false,
    hashFunction: customHashFunction,
  });
  await db.addCollections(collections);
  return db;
};
