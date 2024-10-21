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
import { clients, judgeClientIsHave, judgeClientIsHaveAndClearClient } from "../../util/WebSocket/initAndAddWs";

@JsonController("/login")
export class LoginController {
  @Post("/")
  async login(@Body() requestBody: LoginReqType) {
    try {
      const { user_name, user_pwd } = await judge(requestBody, {
        user_name: stringJoi(),
        user_pwd: stringJoi(),
      });
      const res = await QQ_DB.findAll("user", { where: { user_name } });
      if (res.length === 0) {
        // throw new RejectData(ResCode.UNAUTHORIZED, "账号不存在");
        return response.success({
          isOk: false,
          msg: "账号不存在",
        });
      }
      judgeClientIsHaveAndClearClient(user_name)
      // if (judgeClientIsHave(user_name)) {
      //   return response.success({
      //     isOk: false,
      //     msg: "账号已在其他地方登录",
      //   });
      //   // throw new RejectData(ResCode.FORBIDDEN, "账号已在其他地方登录");
      // }
      const user = res[0].dataValues;
      logSpecial(user.user_pwd);
      logSpecial(user_pwd);
      if (user_pwd === user.user_pwd) {
        return response.success({
          isOk: true,
          msg: "登录成功",
          token: JWT.createToken({
            user_name: user.user_name,
            user_email: user.user_email,
            user_avatar: user.user_avatar,
            nickName: user.nickName,
            permission: user.permission,
          }),
        });
      } else {
        return response.success({
          isOk: false,
          msg: "密码错误",
        });
        // throw new RejectData(ResCode.UNAUTHORIZED, "密码错误");
      }
    } catch (error: any) {
      logSpecial('登录错误', error)
      return response.errorWithReject(error);
    }
  }
}
