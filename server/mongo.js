//mongo.js
//set up for all the mongo requests
import { MongoClient, ObjectId } from "mongodb";

//this is needed to be able to get the env from the .env
import "dotenv/config";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
const collectionName = process.env.MONGODB_COLLECTION;

let client;
let collection;

export async function connectToDB() {
  if (!collection) {
    client = new MongoClient(uri);
    await client.connect();
    collection = client.db(dbName).collection(collectionName);
  }
  return collection;
}

/**
 * Make sure we are connected
 * 
 */
async function getCollection() {
  if (!collection) {
    client = new MongoClient(uri);
    await client.connect();
    collection = client.db(dbName).collection(collectionName);
  }
  return collection;
}


/**
 * Convert Mongo doc to frontend-friendly object (string id)
 */
function transform(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

//add the data to the database
/**
 * insert a new ui document
 * ui should be a JSON object
 */
export async function insertUI(ui) {
  const coll = await getCollection();
  const now = new Date();
  const toInsert = {
    ...ui,
    createdAt: now,
    updatedAt: now,
  };
  const result = await coll.insertOne(toInsert);
  return result.insertedId.toString();
}

//list all the saved uis
/**
 * list saved uis 
 * most recent first
 */
export async function listUIs(limit = 100) {
  const coll = await getCollection();
  const docs = await coll.find({}).sort({ updatedAt: -1 }).limit(limit).toArray();
  return docs.map(transform);
}


//get a ui from the database
/**
 * get a ui by id
 */
export async function getUIById(id) {
  const coll = await getCollection();
  try {
    const doc = await coll.findOne({ _id: new ObjectId(id) });
    return transform(doc);
  } catch (err) {
    return null;
  }
}


//edit a ui not currently using
//not sure if will use
/**
 * update ui by id
 * returns the updated document
 */
export async function updateUI(id, ui) {
  const coll = await getCollection();
  const now = new Date();
  try {
    const { value } = await coll.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...ui, updatedAt: now } },
      { returnDocument: "after" }
    );
    return transform(value);
  } catch (err) {
    return null;
  }
}

//delete not currently using
/**
 * delete ui by id
 */
export async function deleteUI(id) {
  const coll = await getCollection();
  try {
    await coll.deleteOne({ _id: new ObjectId(id) });
    return true;
  } catch (err) {
    return false;
  }
}

