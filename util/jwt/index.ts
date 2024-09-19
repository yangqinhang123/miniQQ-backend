import jwt from "jsonwebtoken"; //这个在中间件无法使用
import { ResCode, RejectData } from "../res/code";
import { logError, logSpecial } from "../io/log";
import { jwtConfig } from "../../lib/config";
import { Request } from "express";

/**JWT的配置 */
interface JwtConfigType {
  /**密匙 */
  secret: string;
  /**有效时间，单位s */
  expiresIn: number;
}
/**JWT的传入数据 1 */
export interface JwtInfo {
  user_name: string;
  user_email: string;
  user_avatar: string;
  nickName: string;
  permission: number;
}
/**解密出来的内容  （除了用户传入的T） */
export interface JudgeData {
  /**JWT 的发布时间  */
  iat: number;
  /**JWT 的过期时间 */
  exp: number;
}
/**JWT 类 泛型是被加密的数据 */
export class JwtClass<T extends string | object | Buffer> {
  private config: JwtConfigType;
  constructor(config: JwtConfigType) {
    this.config = config;
  }
  /**创建token
   * @param info 用户的信息
   */
  createToken(info: T) {
    try {
      const token = jwt.sign(info, this.config.secret, {
        expiresIn: this.config.expiresIn,
      });
      return token;
    } catch (error) {
      logError("生成token失败", error);
      throw new RejectData();
    }
  }
  /**验证token，返回解密的内容
   * @example
   * 在使用的路由上，必须添加 export const dynamic = "force-dynamic"; //否则build时会报错 DynamicServerError: Dynamic server usage: Page couldn't be rendered statically because it used `headers`.
   */
  judgeToken(token: string): Promise<T & JudgeData> {
    return new Promise<T & JudgeData>((resolve, reject) => {
      try {
        if (!token) throw "token为空";
        jwt.verify(token, this.config.secret, (error, result) => {
          if (error) {
            // logError(`token验证失败, ${error}`);
            reject(
              new RejectData(ResCode.UNAUTHORIZED, "登录态失效，请重新登陆")
            );
          } else {
            resolve(result as T & JudgeData);
          }
        });
      } catch (error: any) {
        logError("judgeToken函数失败", error);
        reject(new RejectData(ResCode.UNAUTHORIZED, "身份验证失败"));
      }
    });
  }
  /**根据request数据，鉴权，并获取token中的用户信息
   * @example
   * 在使用的路由上，必须添加 export const dynamic = "force-dynamic"; //否则build时会报错 DynamicServerError: Dynamic server usage: Page couldn't be rendered statically because it used `headers`.
   */
  async getTokenAndData(request: Request): Promise<T & JudgeData> {
    try {
      const data = await this.judgeToken(
        request.headers["authorization"] || ""
      );
      return data;
    } catch (error) {
      logError("@身份验证失败", error);
      return Promise.reject(error); //这里不用再处理成 new rejectData了，因为 this.judgeToken 函数里处理了
    }
  }
}
/**默认的jwt验证实例 */
const JWT = new JwtClass<JwtInfo>(jwtConfig);
export default JWT;
