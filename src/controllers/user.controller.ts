/**
 * 用户 controller
 */
import {
  Body,
  BodyParam,
  Controller,
  Get,
  Post,
  HeaderParams,
  Req,
  JsonController,
  HeaderParam,
  QueryParams,
} from "routing-controllers";
import { logError, logSpecial } from "../../util/io/log";
import { ResponseData } from "../../util/res/code";
import { user } from "../../types/databases/qq_db";
import response from "../../util/res";
import { stringJoi } from "../../util/joi";
import {
  QueryUserParamType,
  RegisterReqType,
  SetUserAvatarParamType,
} from "../../types/api";
import { judge } from "../../util/res/handle";
import JWT from "../../util/jwt";
import QQ_DB from "../../database/all/qq_db";
import { Op } from "sequelize";

@JsonController("/user")
export class UserController {

  @Get("/queryUser")
  async queryUser(@QueryParams() query: QueryUserParamType) {
    try {
      const { key_word } = await judge(query, {
        key_word: stringJoi(),
      });
      const res = await QQ_DB.findAll("user", {
        where: {
          [Op.or]: {
            user_name: {
              [Op.like]: `%${key_word}%`,
            },
            nickName: {
              [Op.like]: `%${key_word}%`,
            },
          },
        },
        attributes: {
          exclude: ["user_pwd"],
        },
      });
      return response.success(res.map((item) => item["dataValues"]));
    } catch (error: any) {
      logSpecial("查询用户接口出错", error);
      return response.errorWithReject(error);
    }
  }

  @Get("/currentUser")
  async getCurrentUser(@HeaderParam("authorization") token: string) {
    try {
      const { user_avatar, user_email, user_name, nickName } =
        await JWT.judgeToken(token);
      return response.success({ user_avatar, user_email, user_name, nickName });
    } catch (error: any) {
      logSpecial("获取当前用户信息接口出错", error);
      return response.errorWithReject(error);
    }
  }

  @Post("/addUser")
  async addUser(@Body() requestBody: RegisterReqType) {
    try {
      const { user_avatar, user_email, user_name, nickName, user_pwd } =
        await judge(requestBody, {
          user_name: stringJoi(),
          user_pwd: stringJoi(),
          nickName: stringJoi(),
          user_email: stringJoi(),
          user_avatar: stringJoi(),
        });
      if (await judgeIsHaveUser(user_name)) {
        return response.success({ isOk: false, msg: "账号已存在" });
      }
      await QQ_DB.add("user", {
        user_name,
        user_pwd,
        nickName,
        user_email,
        user_avatar,
        create_time: Date.now(),
        permission: 1,
      });
      return response.success({ isOk: true, msg: "注册成功" });
    } catch (error: any) {
      logError("注册新用户接口", error);
      return response.errorWithReject(error);
    }
  }

  @Post("/setUserAvatar")
  async setUserAvatar(
    @Body() requestBody: SetUserAvatarParamType,
    @HeaderParam("authorization") token: string
  ) {
    try {
      const { user_name } = await JWT.judgeToken(token);
      const { avatar_url } = await judge(requestBody, {
        avatar_url: stringJoi(),
      });
      await QQ_DB.update(
        "user",
        { user_avatar: avatar_url },
        {
          where: {
            user_name,
          },
        }
      );
      return response.success("操作成功");
    } catch (error: any) {
      logSpecial("设置用户头像接口出错", error);
      return response.errorWithReject(error);
    }
  }
}

const judgeIsHaveUser = async (user_name: string) => {
  const res = await QQ_DB.findAll("user", { where: { user_name } });
  if (res.length === 0) {
    return false;
  } else {
    return true;
  }
};
