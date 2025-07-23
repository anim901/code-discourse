import { IndexType, Permission } from "node-appwrite";

import { db, questionCollection } from "@/models/name";
import { databases } from "./config";

export default async function createQuestionCollection() {
  await databases.createCollection(db, questionCollection, questionCollection, [
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);
  console.log("Question collection is created");

  // creating attributes and indexes

  await Promise.all([
    databases.createStringAttribute(db, questionCollection, "title", 100, true),
    databases.createStringAttribute(
      db,
      questionCollection,
      "content",
      10000,
      true
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "authorId",
      50,
      true
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "tags",
      50,
      true,
      undefined,
      true
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "attachmentId",
      50,
      false
    ),
  ]);
  console.log("Question Attribute Created");

  // create Indexes

  /* await Promise.all([
    databases.createIndex(
      db,
      questionCollection,
      "title",
      IndexType.Fulltext,
      ["title"],
      ["asc"]
    ),
    databases.createIndex(
      db, // db id
      questionCollection, // collection id
      "content", // index name -> can be any
      IndexType.Fulltext,
      ["content"], // field name -> chosen only from collection
      ["asc"] // sorting order -> ascending
    ),
  ]);*/
}

// Promise.all will start all three promises at the same time.
// It will wait until all three are finished.
