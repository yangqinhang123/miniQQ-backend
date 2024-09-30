import { chat_history } from "../databases/qq_db";

/**0和1,0无1有 */
export type Tinyint = 0 | 1;

export interface MsgType {
  type: string;
  data: any;
}
export interface ChatMsgType {
  type: "chat";
  data: chat_history;
}
