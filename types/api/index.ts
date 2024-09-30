import { chat_history } from "../databases/qq_db";

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
  user_name: string;
  /**密码 */
  user_pwd: string;
}

/**查询用户 - 请求参数 */
export interface QueryUserParamType {
  /**QQ号关键词 */
  key_word: string;
}

/**添加联系人 - 请求参数 */
export interface AddContactParamType {
  /**联系人A的qq号（自己或对方） */
  personA: string;
  /**联系人B的qq号（自己或对方） */
  personB: string;
}

/**查询所有联系人 - 请求参数 */
export interface QueryContactListParamType {
  /**qq号 */
  user_name: string;
}

/**查询所有有关自己的聊天记录 - 请求参数 */
export interface GetChatHistoryParamType {
  /**qq号 */
  user_name: string;
}

/**批量添加聊天记录 */
export interface AddChatHistoryParamType {
  /**聊天记录列表 */
  chat_list: chat_history[];
}

/**设置用户头像 - 请求参数 */
export interface SetUserAvatarParamType {
  /**头像url */
  avatar_url: string;
}

/**删除某一条聊天记录 - 请求参数 */
export interface DeleChatParamType {
  /**该条聊天记录的id */
  id: string
}
