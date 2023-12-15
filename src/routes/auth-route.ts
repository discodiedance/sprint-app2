import { Router, Request, Response } from "express";
import { UserService } from "../domain/user-service";
import { RequestWithBody } from "../types/common";
import { InputLoginOrEmailType } from "../types/auth/input";

export const authRoute = Router({});

authRoute.post(
  "/login",
  async (req: RequestWithBody<InputLoginOrEmailType>, res: Response) => {
    const result = await UserService.checkCredentials(
      req.body.loginOrEmail,
      req.body.password
    );
    if (result === false) {
      res.sendStatus(401);
    }
    return res.sendStatus(204);
  }
);