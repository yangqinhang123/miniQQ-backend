// import { NextResponse, NextRequest } from "next/server";
import { ResCode, ResponseData, RejectData } from "./code";
import { logError, logSpecial, reqLogger } from "../io/log";
// import { headers } from "next/headers";
// import JWT, { JudgeData, JwtInfo } from "../jwt";
// import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
// import { jwtConfig } from "../config";
import JWT, { JudgeData, JwtInfo } from "../jwt";
import { jsonParse } from "../other";
import { jwtConfig } from "../../lib/config";
import { mergeObj } from "../mergeObj";

/**接口返回函数 */
const response = {
  /**默认返回函数
   * @param code 状态码
   * @param message 提示信息
   * @param data 要返回的真正数据
   * @param otherConfig 其它配置项，用于NextResponse.json的第二个参数，默认 { status: 200 }
   * @returns NextResponse.json，用于直接返回接口数据
   * @example return send(200, '操作成功', 'test')  实际上相当于 return NextResponse.json(new responseData(200, '操作成功', 'test'), { status: 200 });
   */
  send<T>(code: ResCode, message: string, data: T) {
    const res = new ResponseData(code, message, data);
    // writeLog(header, code, res);

    // const oldToken = header["Authorization"];
    // if (oldToken) {
    //   try {
    //     const token2 = oldToken.split(".")[1];
    //     const data = Buffer.from(token2, "base64").toString();
    //     const { iat, user_avatar, user_email, user_name, nickName, permission } = jsonParse<
    //       JwtInfo & JudgeData
    //     >(data);
    //     //即将过期就返回一个新token，前端做刷新
    //     const effectiveTime = iat + jwtConfig.expiresIn * (2 / 3); //需要刷新的有效期 这里设置如果超过有效期的三分之二，就刷新
    //     const allTime = iat + jwtConfig.expiresIn; //总共的有效期
    //     const nowTime = Date.now() / 1000;
    //     // logSpecial(effectiveTime, nowTime, '距离需要刷新还有' + (effectiveTime - nowTime), '距离真正过期还有' + (allTime - nowTime));
    //     if (effectiveTime < nowTime && nowTime < allTime) {
    //       //nowTime在 2/3 ~ 1 之间才刷新
    //       const newToken = JWT.createToken({
    //         user_name,
    //         user_email,
    //         user_avatar,
    //         nickName,
    //         permission
    //       });
    //       logSpecial(user_name, "需要刷新token", newToken);
    //       return mergeObj(res, {
    //         headers: { token: newToken },
    //         ...otherConfig,
    //       });
    //     }
    //   } catch (error) {
    //     logError("生成新token失败", error);
    //   }
    // }
    return mergeObj(res);
  },
  /**接口成功的返回函数
   * @param header 请求头
   * @param data 要返回的真正数据
   * @param message 提示信息，默认 '操作成功'
   * @example return resFn.success('test res'); 实际上相当于：return NextResponse.json(new responseData(200, '操作成功', 'test res'), { status: 200 });
   */
  success<T>(data: T, message: string = "操作成功") {
    return this.send(ResCode.SUCCESS, message, data);
  },
  /**失败的返回函数
   * @param header 请求头
   * @param _code 状态码，默认500
   * @param message 提示消息，可以用于提示“密码错误”“参数类型错误”等
   * @example return resFn.error(500, '未知错误'); 实际上相当于：return NextResponse.json(new responseData(500, '未知错误'), { status: 200 });
   */
  error(_code: ResCode = ResCode.SERVER_ERROR, message: string = "系统错误") {
    return this.send(_code, message, null);
  },
  /**搭配rejectData类使用，在catch函数中  response.errorWithReject(error)
   * @param header 请求头
   * 返回值默认为 code: 500, message: 系统错误
   */
  errorWithReject(reject?: RejectData) {
    return this.error(reject?._code, reject?._message);
  },
};


export default response;
