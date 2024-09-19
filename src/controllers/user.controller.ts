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
} from "routing-controllers";
import { UserService } from "../services/user.service";
import { logError, logSpecial } from "../../util/io/log";
import { ResponseData } from "../../util/res/code";
import { user } from "../../types/databases/qq_db";
import response from "../../util/res";
import { stringJoi } from "../../util/joi";
import { RegisterReqType } from "../../types/api";
import { judge } from "../../util/res/handle";

@JsonController("/user")
export class UserController {
  userService;
  constructor() {
    this.userService = new UserService();
  }

  @Get("/queryList")
  async queryList() {
    const userList = await this.userService.queryList();
    return response.success<user[]>(userList);
  }

  @Post("/addUser")
  async addUser(
    @Body() requestBody: RegisterReqType,
  ) {
    try {
      const { user_avatar, user_email, user_name, nickName, user_pwd } =
        await judge(requestBody, {
          user_name: stringJoi(),
          user_pwd: stringJoi(),
          nickName: stringJoi(),
          user_email: stringJoi(),
          user_avatar: stringJoi(),
        });
      // const user_avatar =
      //   "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
      await this.userService.addUser(
        user_name,
        user_pwd,
        nickName,
        user_email,
        user_avatar
      );
      return response.success(null);
    } catch (error: any) {
      logError("注册新用户接口", error);
      return response.errorWithReject(error);
    }
  }
}
