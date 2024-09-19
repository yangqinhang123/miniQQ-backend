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
async function init() {
  // 新增：初始化 DataSource
  //   await ds
  //     .initialize()
  //     .then(() => {
  //       console.log("Data Source has been initialized!");
  //     })
  //     .catch((e: any) => {
  //       console.log("Error during Data Source initialization:", e);
  //     });
  // const app = createExpressServer({
  //   controllers: [UserController, LoginController],
  //   routePrefix: "/api",
  //   middlewares: [ExcludeMiddleware],
  //   interceptors: [ResInterceptor],
  // });
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
    controllers: [UserController, LoginController],
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
    ws.on("connection", () => {
      logSpecial('连接成功')
    })
    // console.log('连接成功', ws)

    ws.send("来自服务端推送的消息");

    ws.on("message", function (msg) {
      logSpecial(msg)
      ws.send(`收到客户端的消息为：${msg}，再返回去`);
    });

    // 使用定时器不停的向客户端推动消息
    // let timer: any = setInterval(() => {
    //   ws.send(`服务端定时推送消息: ${Date.now()}`);
    // }, 1000);

    ws.on("close", function (e) {
      // console.log('连接关闭')
      // clearInterval(timer);
      // timer = null;
    });
  });
  // const server = createServer(app);

  // const io = new Server(server, { cors: { origin: "*" } });
  // io.on("connection", (socket) => {
  //   console.log("连接成功");

  //   // receive a message from the client
  //   socket.on("send", (e) => {
  //     // console.log(e);
  //     logSpecial("onsend");
  //     logSpecial(e);
  //     // socket.emit("back", "服务器返回的消息");
  //   });
  //   socket.on("message", (e) => {
  //     logSpecial("onmessage");
  //     logSpecial(e);
  //   });

  //   socket.on("disconnecting", () => {
  //     console.log("用户离开，连接断开");
  //   });
  // });

  // server.listen("5432", () => {
  //   logSpecial("websocket启动，5432");
  // });

  app.use(route);
  app.listen(3000, () => {
    console.log(`  App is running at http://localhost:3000\n`);
    console.log("  Press CTRL-C to stop\n");
  });
}

init();
