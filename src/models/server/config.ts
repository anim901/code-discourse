import env from "@/app/env";

import { Client, Storage, Avatars, Databases, Users } from "node-appwrite";

let client = new Client(); //  Appwrite client instance to connect to your Appwrite server.

client
  .setEndpoint(env.appwrite.endpoint) // server url
  .setProject(env.appwrite.projectId) // project id
  .setKey(env.appwrite.apikey); // API key
// It tells Appwrite:
// "This is an authorized server, allow it to perform high-level operations."

const databases = new Databases(client); // Databases instance to perform database-related operations (CRUD) in Appwrite.
const users = new Users(client);
const avatars = new Avatars(client); // Avatars instance to generate user avatars, QR codes, browser icons, and other utility images provided by Appwrite.
const storage = new Storage(client); // Storage instance to handle file uploads, downloads, and file management within your Appwrite project’s storage service.

export { client, databases, avatars, storage, users };
