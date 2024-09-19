import { logError } from "../io/log";
import Joi from "joi";
import { RejectData, ResCode } from "./code";
import JWT, { JudgeData, JwtInfo } from "../jwt";
import { jsonParse } from "../other";
import { jwtConfig } from "../../lib/config";
/**Joi参数校验
 * @param object 要被校验的对象
 * @param rules 校验规则，参加Joi文档 （也就是Joi.object的参数） https://joi.dev/api/?v=17.9.1#introduction
 * @returns 如果成功，返回一个校验后的数据或者空对象
 */
export const judge = async <T>(
  object: T,
  rules: { [key in keyof T]: any }
): Promise<T> => {
  try {
    const schema = Joi.object(rules);
    const value = await schema.validateAsync(object);
    return value;
  } catch (error) {
    logError("参数校验失败", error);
    return Promise.reject(new RejectData(ResCode.BAD_REQUEST, "参数错误"));
  }
};
