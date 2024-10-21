import { chat_history } from "../databases/qq_db";

/**0和1,0无1有 */
export type Tinyint = 0 | 1;

export interface MsgType {
  /**消息类型，类型为error，客户端接收到会退出登录 */
  type: "chat" | "error";
  data: any;
}
export interface ChatMsgType {
  type: "chat";
  data: chat_history;
}
