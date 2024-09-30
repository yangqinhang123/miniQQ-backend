import { Tinyint } from "../others/index";

/**用户表 */
export interface user {
  /**主键 */
  id: number;
  /**开始时间 */
  create_time: number;
  /**用户账号 */
  user_name: string;
  /**用户密码 */
  user_pwd: string;
  /**昵称 */
  nickName: string;
  /**用户邮箱 */
  user_email: string;
  /**用户头像*/
  user_avatar: string;
  /**是否为登录态，1是0不是 */
  permission: number
}
/**联系人列表 */
export interface contact_table {
  /**主键 */
  id: number;
  /**开始时间 */
  create_time: number;
  /**某一方的qq号 */
  personA_user_name: string;
  /**另一方的qq号 */
  personB_user_name: string;
}

/**聊天记录表 */
export interface chat_history {
  /**主键 */
  id: string;
  /**开始时间 */
  create_time: number;
  /**来自谁 */
  from: string;
  /**发给谁 */
  to: string;
  /**具体的消息 */
  msg: string;
  /**假删除标志 */
  is_del: number;
}
