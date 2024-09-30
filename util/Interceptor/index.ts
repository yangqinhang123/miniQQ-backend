import { Interceptor, InterceptorInterface, Action } from "routing-controllers";
import { ResCode, ResponseData } from "../res/code";
import { jwtConfig } from "../../lib/config";
import { logSpecial, logError, reqLogger } from "../io/log";
import JWT, { JwtInfo, JudgeData } from "../jwt";
import { jsonParse } from "../other";
import { mergeObj } from "../mergeObj";

@Interceptor()
export class ResInterceptor implements InterceptorInterface {
  intercept(action: Action, content: ResponseData) {
    // return content.replace(/Mike/gi, 'Michael');
    logSpecial("统一响应");
    writeLog(action.request.headers, content.code, {...content});
    // const extend: { [key: string]: any } = {};
    const oldToken = action.request.headers["Authorization"];
    if (oldToken) {
      try {
        const token2 = oldToken.split(".")[1];
        const data = Buffer.from(token2, "base64").toString();
        const {
          iat,
          user_avatar,
          user_email,
          user_name,
          nickName,
          permission,
        } = jsonParse<JwtInfo & JudgeData>(data);
        //即将过期就返回一个新token，前端做刷新
        const effectiveTime = iat + jwtConfig.expiresIn * (2 / 3); //需要刷新的有效期 这里设置如果超过有效期的三分之二，就刷新
        const allTime = iat + jwtConfig.expiresIn; //总共的有效期
        const nowTime = Date.now() / 1000;
        // logSpecial(effectiveTime, nowTime, '距离需要刷新还有' + (effectiveTime - nowTime), '距离真正过期还有' + (allTime - nowTime));
        if (effectiveTime < nowTime && nowTime < allTime) {
          //nowTime在 2/3 ~ 1 之间才刷新
          const newToken = JWT.createToken({
            user_name,
            user_email,
            user_avatar,
            nickName,
            permission,
          });
          logSpecial(user_name, "需要刷新token", newToken);
          action.response.setHeader("token", newToken);
          //   return mergeObj(content, {
          //     headers: { token: newToken },
          //   });
        }
      } catch (error) {
        logError("生成新token失败", error);
      }
    }
    return content;
  }
}
/**根据请求的headers里的自定义字段log和自带字段Authorization，拿出请求参数，制作成日志。出错不会打断其它代码 */
const writeLog = async (
  header: { [key: string]: string },
  _code: ResCode,
  resData: ResponseData
) => {
  try {
    const token = header["authorization"] || "";
    const otherLog = decodeURIComponent(header["log"] || ""); //需要解码
    const { user_name, user_email, user_avatar, nickName } =
      await JWT.judgeToken(token);
    if (_code === ResCode.SUCCESS) {
      reqLogger.log(
        `🧑${user_name} - 「${otherLog}」 - 「📥: ${JSON.stringify(
          resData.data
        )}」`
      );
    } else {
      reqLogger.error(
        `🧑${user_name} | 「${otherLog}」 - 「📥 Error: ${JSON.stringify(
          resData
        )} 详细内容请查看 /logs/error 文件夹」`
      );
    }
  } catch (error) {
    logError("request日志记录失败", error);
  }
};
