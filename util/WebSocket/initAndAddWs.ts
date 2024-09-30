import QQ_DB from "../../database/all/qq_db";
import { isHaveChat } from "../../src/controllers/chatHistory.controller";
import { ChatMsgType, MsgType } from "../../types/others";
import { logSpecial } from "../io/log";
import { jsonParse } from "../other";
import WebSocket from "../../node_modules/@types/ws/index";
enum TARGET_USER {
  ALL = "all",
}
interface ClientObjType {
  /**客户端当前登录用户的qq号（用于区分各个客户端） */
  user_name: string;
  ws_instance: WebSocket.WebSocket;
}
// 存储所有连接的客户端
export const clients = new Set<ClientObjType>();
// 创建一个 Proxy
const handler: any = {
  add(target: any, value: any) {
    console.log(`添加元素: ${value}`);
    target.add(value);
    return true; // 返回 true 表示设置成功
  },
  delete(target: any, value: any) {
    console.log(`删除元素: ${value}`);
    target.delete(value);
    return true; // 返回 true 表示删除成功
  },
  clear(target: any) {
    console.log("清空 Set");
    target.clear();
  },
  // 拦截其他方法，如 has
  has(target: any, value: any) {
    console.log(`检查元素: ${value}`);
    return target.has(value);
  },
};
// const clients = new Proxy(client, {
//   get(target, property, receiver) {
//     // 拦截方法调用，确保调用上下文正确
//     const originalMethod = Reflect.get(target, property, receiver);
//     if (typeof originalMethod === "function") {
//       return function (...args: any[]) {
//         // 调用原始方法并确保上下文指向原始 Set 对象
//         return originalMethod.apply(target, args);
//       };
//     }
//     return originalMethod;
//   },
// });

/**
 * 初始化websocket实例，并记录
 * @param ws websocket实例
 * @param user_name 客户端当前登录用户的qq号（用于区分各个客户端）
 */
export const initAndAddWs = (ws: WebSocket.WebSocket, user_name: string) => {
  if (judgeClientIsHave(user_name)) {
    ws.send(
      JSON.stringify({
        type: "tip",
        data: {
          msgType: "error",
          msg: "用户已连接或已在其他地方连接，不可重复连接噢！",
        },
      })
    );
    ws.close();
    return;
  }
  const obj = {
    user_name: user_name,
    ws_instance: ws,
  };
  clients.add(obj);
  ws.on("message", function (msg: any) {
    logSpecial(msg);
    const res = jsonParse<ChatMsgType>(msg);
    logSpecial(res);
    if (res.type === "chat") {
      /**自己发给自己的信息就不发了 */
      if (res.data.to === user_name) {
        return;
      }
      logSpecial("送出去");
      sendMsgToTargetUser(res, res.data.to);
    }
    // ws.send(`收到客户端的消息为：${msg}，再返回去`);
  });
  ws.on("close", function (e: any) {
    logSpecial("连接关闭", user_name);
    clients.delete(obj);
    // clearInterval(timer);
    // timer = null;
  });
};

// 广播消息给所有连接的客户端
function sendMsgToTargetUser(
  message: MsgType,
  target_user: string | TARGET_USER
) {
  clients.forEach(async (client) => {
    if (target_user === TARGET_USER.ALL) {
      client.ws_instance.send(JSON.stringify(message));
      return;
    }
    if (
      client.user_name === target_user &&
      client.ws_instance.readyState === 1
    ) {
      logSpecial(message);
      logSpecial("找到你啦");
      client.ws_instance.send(JSON.stringify(message));
    } else {
      // 用户不在线，先把信息存到数据库 且当前信息为聊天信息
      if (message.type === "chat") {
        if (!(await isHaveChat(message.data))) {
          await QQ_DB.add("chat_history", message.data);
        }
      }
    }
  });
}
/**
 * 判断该用户是否已经连接了
 * @param clientObj 当前请求连接的客户端
 * @returns
 */
export const judgeClientIsHave = (user_name: string) => {
  let flag = false;
  logSpecial(clients)
  clients.forEach((item) => {
    if (item.user_name === user_name) {
      flag = true;
    }
  });
  return flag;
};

/**
 * 断开某个用户的连接
 * @param user_name 用户qq号
 */
export const disconnect = (user_name: string) => {
  clients.forEach((item) => {
    if (item.user_name === user_name) {
      item.ws_instance.close();
      clients.delete(item);
    }
  });
};
