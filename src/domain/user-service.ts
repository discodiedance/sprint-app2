import { WithId } from "mongodb";
import { userCollection } from "../db/db";
import { userMapper } from "../middlewares/user/user-mapper";
import { InputUserType } from "../types/user/input";
import { OutputUserType, UserType } from "../types/user/output";
import bcrypt from "bcrypt";

export class UserService {
  static async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  static async createUser(newUser: InputUserType): Promise<OutputUserType> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      newUser.password,
      passwordSalt
    );

    const createdUser: UserType = {
      login: newUser.login,
      email: newUser.email,
      passwordHash,
      passwordSalt,
      createdAt: new Date().toISOString(),
    };

    const result = await userCollection.insertOne({ ...createdUser });

    return userMapper({ ...createdUser, _id: result.insertedId });
  }

  static async checkCredentials(
    loginOrEmail: string,
    password: string
  ): Promise<WithId<UserType> | null> {
    const user = await UserService.findByLoginOrEmail(loginOrEmail);

    if (!user) return null;

    const passwordHash = await this._generateHash(password, user.passwordSalt);
    if (user.passwordHash !== passwordHash) {
      return null;
    }
    return user;
  }

  static async findByLoginOrEmail(loginOrEmail: string) {
    const user = await userCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });

    return user;
  }
}
