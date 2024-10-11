import { createExpressServer, useExpressServer } from "routing-controllers";
import { json, urlencoded } from "body-parser";
import "reflect-metadata";
import ds from "./data-source";
import { UserController } from "./src/controllers/user.controller";
import express from "express";
import { LoginController } from "./src/controllers/login.controller";
import { ExcludeMiddleware } from "./util/Middleware";
import { ResInterceptor } from "./util/Interceptor";
import { Server } from "socket.io";
import { logSpecial } from "./util/io/log";
import { createServer } from "http";
import expressWs from "express-ws";
import { ContactController } from "./src/controllers/contact.controller";
import { jsonParse } from "./util/other";
import { ChatMsgType, MsgType } from "./types/others";
import {
  ChatController,
  isHaveChat,
} from "./src/controllers/chatHistory.controller";
import QQ_DB from "./database/all/qq_db";
import { ImageController } from "./src/controllers/file.controller";
import { initAndAddWs } from "./util/WebSocket/initAndAddWs";

async function init() {
  const route = express.Router();
  const app = express();
  expressWs(app);

  // body 解析相关中间件
  // 解析 json 格式
  app.use(json());
  // 解析 urlencoded body
  // 会在 request 对象上挂载 body 属性，包含解析后的数据。
  // 这个新的 body 对象包含 key-value 键值对，若设置 extended 为 true，则键值可以是任意累心个，否则只能是字符串或数组。
  app.use(urlencoded({ extended: true }));

  // 将当前实例注册到 routing-controllers
  useExpressServer(app, {
    controllers: [
      UserController,
      LoginController,
      ContactController,
      ChatController,
      ImageController,
    ],
    routePrefix: "/api",
    middlewares: [ExcludeMiddleware],
    interceptors: [ResInterceptor],
  });
  /**
   * route.ws('/url',(ws, req)=>{  })
   * 建立WebSocket服务，并指定对应接口url，及相应回调
   * ws为实例化的对象，req即为请求
   *
   * ws.send方法用来向客户端发送信息
   * ws.on方法用于监听事件（如监听message事件，或监听close事件）
   * */
  route.ws("/mySocketUrl", (ws, req) => {
    
    const params = req.query;
    logSpecial('连接', params["user_name"])
    initAndAddWs(ws, params["user_name"] as string);
    // broadcast({ type: "test", data: "来自服务端端消息" }, TARGET_USER.ALL);
  });

  app.use(route);
  app.listen(3000, "192.168.121.176", () => {
    console.log(`  App is running at http://localhost:3000\n`);
    console.log("  Press CTRL-C to stop\n");
  });
}

init();
