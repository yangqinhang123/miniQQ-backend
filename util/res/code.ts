
/**状态码 */
export enum ResCode {
  /**200 成功 */
  SUCCESS = 200,
  /**400 参数错误 （客户端请求的语法错误） */
  BAD_REQUEST = 400,
  /**401 未通过权限验证，或登录失效 - 需要跳转到YY统一门户 */
  UNAUTHORIZED = 401,
  /**403 通过权限验证，但是无这个模块的权限。需要跳转到主页 */
  FORBIDDEN = 403,
  /**500 系统错误 */
  SERVER_ERROR = 500,
  /**503 请求失败 （比如当前不可用、跑模型太长时间掐断） */
  FAIL_REQUEST = 503,
}
/**响应数据统一格式 */
export class ResponseData {
  /**状态码 */
  code: ResCode;
  /**响应信息 */
  message: string;
  /**响应数据 */
  data: any;
  /**响应数据统一格式 - 构造函数
   * @param code 状态码
   * @param message 响应信息
   * @param data 响应数据
   */
  constructor(code: ResCode, message: string, data: any = null) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}
/**promise.reject时，或者throw抛出异常使用，可以在上级的catch函数中接受到error，并在catch里搭配response.errorWithReject使用 */
export class RejectData {
  /**错误码 */
  _code: ResCode;
  /**错误信息 */
  _message: string;
  /** 构造函数， promise.reject时使用，可以在上级的catch函数中接受到error，并在catch里搭配response.errorWithReject使用
   * @param _code 错误码
   * @param _message 错误信息
   */
  constructor(_code?: ResCode, _message?: string) {
    this._code = _code || ResCode.SERVER_ERROR;
    this._message = _message || "系统错误";
  }
}
