/**
 * 用户服务类
 */
import db from "../../data-source";
import { User } from "../entities/qq_db/user.entity";
import QQ_DB from "../../database/all/qq_db";
import { logSpecial } from "../../util/io/log";

export class UserService {
  table_name: "user";
  constructor() {
    this.table_name = "user";
  }
  // 查询全部用户
  async queryList() {
    const userList = await QQ_DB.findAll(this.table_name);
    return userList
    // return userList.map((item: any) => item["dataValues"]);
  }

  /**
   * 添加用户
   * @param user_name 账号
   * @param user_pwd 密码
   * @param nickName 昵称
   * @param user_email 邮箱
   * @param user_avatar 头像
   * @param permission 账号权限
   */
  async addUser(
    user_name: string,
    user_pwd: string,
    nickName: string,
    user_email: string,
    user_avatar: string,
    permission: number
  ) {
    return await QQ_DB.add(this.table_name, {
      user_name,
      user_pwd,
      nickName,
      user_email,
      user_avatar,
      create_time: Date.now(),
      permission,
    });
  }
}
