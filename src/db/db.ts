import { MongoClient } from "mongodb";
import { BlogType } from "../types/blog/output";
import { PostType } from "../types/post/output";
import { UserDBType } from "../types/user/output";
import { CommentType } from "../types/comment/output";
import { mongoUri } from "../config";
import { APIReqeustsType } from "../types/common";
import { DeviceType } from "../types/security/input";

console.log(mongoUri);

const client = new MongoClient(mongoUri);

const db = client.db("minigram");

export const blogCollection = db.collection<BlogType>("blogs");
export const postCollection = db.collection<PostType>("posts");
export const userCollection = db.collection<UserDBType>("users");
export const commentCollection = db.collection<CommentType>("comments");
export const apiRequestsCollection =
  db.collection<APIReqeustsType>("api-request");
export const deviceAuthSessionsCollection =
  db.collection<DeviceType>("devices");

export const runDb = async () => {
  try {
    await client.connect();
    console.log("Client connected to DB");
  } catch (e) {
    console.log(`"${e}"`);
    await client.close();
  }
};
