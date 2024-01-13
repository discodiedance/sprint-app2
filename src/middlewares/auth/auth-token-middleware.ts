import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../aplication/jwt-service";
import { QueryUserRepository } from "../../repositories/query-repository/query-user-repository";

export const authTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.send(401);
    return;
  }

  const accessToken = req.headers.authorization.split(" ")[1];

  const userId = await jwtService.getUserIdByToken(accessToken);
  if (userId) {
    req.user = await QueryUserRepository.getUserById(userId);
    next();
  }
  res.send(401);
};