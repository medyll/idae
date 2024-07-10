import express, { Request, Response } from "express";
import DatabaseService from "./services/DatabaseService";
import DatabaseManager from "./database/DatabaseManager";
import mongoose, { Schema, Model, Document } from "mongoose";
const app = express();
const port = 3000;
interface DynamicDocument extends Document {
  // Définissez les propriétés du document ici
}

const getDynamicModel = (collectionName: string): Model<DynamicDocument> => {
  if (mongoose.models[collectionName]) {
    return mongoose.models[collectionName] as Model<DynamicDocument>;
  }

  const schema = new Schema({}, { strict: false });
  return mongoose.model<DynamicDocument>(
    collectionName,
    schema,
    collectionName
  );
};
function getCollectionName(collectionName: string) {
  let dbName, collection;
  if (collectionName.includes(".")) {
    [dbName, collection] = collectionName.split(".");
  } else {
    collection = collectionName;
  }

  return collection;
}

app.use(express.json());

// Middleware to connect to the appropriate database
app.use("/:collectionName", DatabaseManager.connectToDatabase);

app.get("/:collectionName", async (req: Request, res: Response) => {
  try {
    const { collectionName } = req.params;
    console.log("1-----");

    const collection = getCollectionName(collectionName);
    console.log("2-----", collectionName, "col", collection);

    const databaseService = new DatabaseService(collection);

    console.log("3-----");

    const documents = await databaseService.findAll(req.query);

    console.log("4-----");
    res.send(documents);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/:collectionName/:id", async (req: Request, res: Response) => {
  try {
    const { collectionName, id } = req.params;
    const collection = getCollectionName(collectionName);
    const databaseService = new DatabaseService(collection);
    const document = await databaseService.findById(id);
    if (!document) {
      return res.status(404).send({ error: "Document not found" });
    }
    res.send(document);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/:collectionName/:id", async (req: Request, res: Response) => {
  try {
    const { collectionName, id } = req.params;
    const collection = getCollectionName(collectionName);
    const databaseService = new DatabaseService(collection);
    const result = await databaseService.deleteById(id);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/:collectionName/", async (req: Request, res: Response) => {
  try {
    const { collectionName } = req.params;
    const collection = getCollectionName(collectionName);
    const databaseService = new DatabaseService(collection);
    const result = await databaseService.deleteManyByQuery(req.query);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

const directCommands = [
  "findAll",
  "create",
  "update",
  "deleteById",
  "deleteManyByQuery",
];

app.all(
  "/:collectionName/:command/:params?",
  async (req: Request, res: Response) => {
    try {
      const { collectionName, command, params } = req.params;
      const collection = getCollectionName(collectionName);
      if (!directCommands.includes(command)) {
        return res.status(400).send({ error: "Command not supported" });
      }

      const databaseService = new DatabaseService(collection);
      const decodedParams = params
        ? databaseService.decodeUrlParams(params)
        : {};
      /** @ts-ignore */
      const result = await databaseService[command](decodedParams);

      res.status(200).send(result);
    } catch (error) {
      /** @ts-ignore */
      res.status(400).send({ error: error.message });
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
