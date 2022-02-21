import { db } from "./db";
import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import { decodeAuthHeader, AuthTokenPayload } from "./auth";

export interface Context {
  db: PrismaClient;
  userId?: string;
}

export const context = ({ req }: { req: Request }): Context => {
  console.log(req);
  const token =
      req && req.headers.authorization
          ? decodeAuthHeader(req.headers.authorization)
          : null;

  return {  
      db,
      userId: token?.userId, 
  };
};