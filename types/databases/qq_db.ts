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
