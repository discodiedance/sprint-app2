import { Router, Request, Response } from "express";
import { blogCollection, postCollection, userCollection } from "../db/db";

export const testingRoute = Router({});

testingRoute.delete("/all-data", async (req: Request, res: Response) => {
  await blogCollection.deleteMany({});
  await postCollection.deleteMany({});
  await userCollection.deleteMany({});
  res.sendStatus(204);
});
