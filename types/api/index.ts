/**分页查询 - 基础返回数据 */
export interface Paging<T> {
  /**总条数 */
  count: number;
  /**当前页数（用户传来的） */
  page: number;
  /**当前一页个数 （查到多少就是多少） */
  size: number;
  /**数据列表 */
  list: T[];
}
/**注册新用户 - 请求参数 */
export interface RegisterReqType {
  /**qq号 */
  user_name: string;
  /**密码 */
  user_pwd: string;
  /**昵称 */
  nickName: string;
  /**邮箱 */
  user_email: string;
  /**头像 */
  user_avatar: string;
}
/**登录请求类型 */
export interface LoginReqType {
  /**qq号 */
  user_name: string,
  /**密码 */
  user_pwd: string
}
