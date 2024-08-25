import { UserModel } from "../../db/db";
import { userMapper } from "../../middlewares/user/user-mapper";
import { SortDataUserType } from "../../types/user/input";
import { OutputUserType, UserDBType } from "../../types/user/output";

export class QueryUserRepository {
  static async getAllUsers(sortData: SortDataUserType) {
    const sortBy = sortData.sortBy ?? "createdAt";
    const sortDirection = sortData.sortDirection ?? "desc";
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;
    const searchLoginTerm = sortData.searchLoginTerm ?? null;
    const searchEmailTerm = sortData.searchEmailTerm ?? null;

    let filterLogin = {};
    let filterEmail = {};

    if (searchLoginTerm) {
      filterLogin = {
        login: {
          $regex: searchLoginTerm,
          $options: "i",
        },
      };
    }

    if (searchEmailTerm) {
      filterEmail = {
        email: {
          $regex: searchEmailTerm,
          $options: "i",
        },
      };
    }

    const filter = {
      $or: [filterLogin, filterEmail],
    };

    const users = await UserModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize);

    const totalCount: number = await UserModel.countDocuments(filter);
    const pageCount: number = Math.ceil(totalCount / +pageSize);

    return {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: users.map(userMapper),
    };
  }

  static async getUserById(id: string): Promise<OutputUserType | null> {
    const user = await UserModel.findOne({ id: id });
    if (!user) {
      return null;
    }
    return userMapper(user);
  }

  static async findyByLogin(login: string) {
    const user: UserDBType | null = await UserModel.findOne({
      "accountData.login": login,
    });
    return user;
  }

  static async findyByEmail(email: string): Promise<UserDBType | null> {
    const user: UserDBType | null = await UserModel.findOne({
      "accountData.email": email,
    });
    return user;
  }

  static async findByLoginOrEmail(loginOrEmail: string) {
    const user: UserDBType | null = await UserModel.findOne({
      $or: [
        {
          "accountData.email": {
            $regex: loginOrEmail,
            $options: "i",
          },
        },
        {
          "accountData.login": {
            $regex: loginOrEmail,
            $options: "i",
          },
        },
      ],
    });
    return user;
  }

  static async findUserByConfirmationCode(
    emailConfirmationCode: string
  ): Promise<UserDBType | null> {
    const user: UserDBType | null = await UserModel.findOne({
      "emailConfirmation.confirmationCode": emailConfirmationCode,
    });
    return user;
  }

  static async findUserByRecoveryConfirmationCode(
    passwordRecoveryCode: string
  ): Promise<UserDBType | null> {
    const user: UserDBType | null = await UserModel.findOne({
      "passwordRecoveryConfirmation.recoveryCode": passwordRecoveryCode,
    });
    return user;
  }

  static async findPasswordSaltByUserId(
    userId: string
  ): Promise<string | null> {
    const user: UserDBType | null = await UserModel.findOne({
      id: userId,
    });
    return user!.accountData.passwordSalt;
  }

  //--------------------------for e2e tests--------------------------
  static async findConfirmationCodeByEmail(email: string) {
    const user = await UserModel.findOne({
      "accountData.email": email,
    });
    return user!.emailConfirmation.confirmationCode;
  }

  static async findPasswordRecoveryConfirmationCodeByEmail(email: string) {
    const user = await UserModel.findOne({
      "accountData.email": email,
    });
    return user!.passwordRecoveryConfirmation.recoveryCode;
  }
}
