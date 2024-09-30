import { Request, Response } from "express";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { logError, logSpecial, reqLogger } from "../io/log";
import JWT, { JudgeData, JwtInfo } from "../jwt";
import { RejectData, ResCode, ResponseData } from "../res/code";
import response from "../res";
import { jsonParse } from "../other";
import { jwtConfig } from "../../lib/config";
import { mergeObj } from "../mergeObj";
import QQ_DB from "../../database/all/qq_db";

@Middleware({ type: "before" })
export class ExcludeMiddleware implements ExpressMiddlewareInterface {
  async use(req: Request, res: Response, next: (err?: any) => any) {
    logSpecial("统一鉴权");
    logSpecial(req.path);
    try {
      if (
        req.path === "/user/addUser" ||
        req.path === "/login" ||
        /^\/file\/getFile\/[^\/]+$/.test(req.path)
      ) {
        logSpecial("到这");
        return next(); // 不执行全局中间件
      }
      if (await permissionJudge(req)) {
        return next();
      }
    } catch (error: any) {
      logSpecial("出错啦", error);

      return res.status(200).json(response.errorWithReject(error));
    }

    // throw new HttpError(403, 'Access denied to this route');
  }
}

// @Middleware({ type: "after" })
// export class ResponseMiddleware implements ExpressMiddlewareInterface {
//   use(req: Request, res: Response, next: (err?: any) => any) {
//     logSpecial('统一响应')
//     const extend: { [key: string]: any } = {};
//     const originalSend = res.send.bind(res);
//     const oldToken = req.headers["authorization"];
//     if (oldToken) {
//       try {
//         const token2 = oldToken.split(".")[1];
//         const data = Buffer.from(token2, "base64").toString();
//         const {
//           iat,
//           user_avatar,
//           user_email,
//           user_name,
//           nickName,
//           permission,
//         } = jsonParse<JwtInfo & JudgeData>(data);
//         //即将过期就返回一个新token，前端做刷新
//         const effectiveTime = iat + jwtConfig.expiresIn * (2 / 3); //需要刷新的有效期 这里设置如果超过有效期的三分之二，就刷新
//         const allTime = iat + jwtConfig.expiresIn; //总共的有效期
//         const nowTime = Date.now() / 1000;
//         // logSpecial(effectiveTime, nowTime, '距离需要刷新还有' + (effectiveTime - nowTime), '距离真正过期还有' + (allTime - nowTime));
//         if (effectiveTime < nowTime && nowTime < allTime) {
//           //nowTime在 2/3 ~ 1 之间才刷新
//           const newToken = JWT.createToken({
//             user_name,
//             user_email,
//             user_avatar,
//             nickName,
//             permission,
//           });
//           logSpecial(user_name, "需要刷新token", newToken);
//           extend["token"] = newToken;

//           //   return mergeObj(res, {
//           //     headers: { token: newToken },
//           //   });
//         }
//       } catch (error) {
//         logError("生成新token失败", error);
//       }
//     }
//     res.send = function (body: ResponseData) {
//       writeLog(req.headers as { [key: string]: string }, body.code, body);
//       return originalSend(mergeObj(body, extend, { text: 111 })); // 返回处理后的响应体
//     };

//     next();
//   }
// }

/**token鉴权，并判断用户是否有某个模块的权限。 注：目前模块权限判断，不是实时从数据库中获取，所以如果修改了权限，需要让用户刷新获取新的token
 * - 超管直接放行
 * @param request 请求数据
 * @param model 模块名。不填则代表不模块鉴权
 * @returns 如果有权限，true，无权限，返回false
 */
export const permissionJudge = async (request: Request) => {
  const { user_name } = await JWT.getTokenAndData(request);
  const { permission } = (
    await QQ_DB.findAll("user", { where: { user_name } })
  )[0];
  if (permission) {
    return true;
  } else {
    return false;
  }
};
