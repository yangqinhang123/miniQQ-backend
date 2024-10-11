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
  }
}

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
  )[0].dataValues;
  logSpecial('permisson', permission)
  if (permission) {
    return true;
  } else {
    return false;
  }
};
