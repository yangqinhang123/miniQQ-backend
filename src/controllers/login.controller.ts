import {
  Body,
  Controller,
  HeaderParams,
  JsonController,
  Post,
} from "routing-controllers";
import response from "../../util/res";
import { LoginReqType } from "../../types/api";
import { judge } from "../../util/res/handle";
import { stringJoi } from "../../util/joi";
import QQ_DB from "../../database/all/qq_db";
import { logSpecial } from "../../util/io/log";
import JWT from "../../util/jwt";
import { RejectData, ResCode } from "../../util/res/code";

@JsonController("/login")
export class LoginController {
  @Post("/")
  async login(@Body() requestBody: LoginReqType) {
    try {
      const { user_name, user_pwd } = await judge(requestBody, {
        user_name: stringJoi(),
        user_pwd: stringJoi(),
      });
      const user = (await QQ_DB.findAll("user", { where: { user_name } }))[0];
      logSpecial(user.user_pwd);
      logSpecial(user_pwd)
      if (user_pwd === user.user_pwd) {
        return response.success({
          token: JWT.createToken({
            user_name: user.user_name,
            user_email: user.user_email,
            user_avatar: user.user_avatar,
            nickName: user.nickName,
            permission: 1,
          }),
        });
      }else {
        throw new RejectData(ResCode.UNAUTHORIZED, '密码错误')
      }
    } catch (error: any) {
      return response.errorWithReject(error);
    }
  }
  
}
