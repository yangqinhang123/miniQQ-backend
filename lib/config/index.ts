/**后端 - 数据库相关配置 */
export const databaseConfig = {
  /**数据库host */
  host: "localhost",
  /**数据库用户 */
  user: "root",
  /**数据库密码 */
  pass: "abc328676",
};

/**JWT的配置 */
export const jwtConfig = {
  secret: "6666",
  expiresIn: 60 * 60 * 1, //有效期一小时。在有效期内刷新页面，会刷新token有效期
};

/**在本机上存文件的路径的基础路径（绝对路径） */
export const uploadPath = "/Users/john/images/";

