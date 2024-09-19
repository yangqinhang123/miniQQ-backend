import { appendToFile, blackHoleStream } from "./index";
import { formatDay, getToday, sliceStr } from "../index";
import { serverFileBaseUrl } from "../../lib/config/index";
import { getAbsPath } from "../other/index";

const getServetPath = getAbsPath;

// 自从部署到Docker后，原有的日志系统无法使用了，如果还有查看日志的需要，尝试把它们存到下面这个路径中
// const getServetPath = (url: string) => {
//     return serverFileBaseUrl + url
// }

/**根据参数生成固定格式的log
 * @param message 日志
 * @param notSlice 是否超长度不截断，用于一些重要日志。默认false截断
 * @returns
 */
const getLog = (message: any[], notSlice: boolean = false) => {
  const maxLength = 500;
  const _message = message.map((k) =>
    typeof k === "object" ? JSON.stringify(k) : k
  );
  const log = `${formatDay()} | ${String(_message.join("  "))}`;
  if (notSlice) return log;
  return sliceStr(log, maxLength, `...超出${maxLength}字，已截断`);
};

//生产环境下，重写全局的console 开启日志记录本地 （终端是否展示？）  （为什么重写，而不是像下面请求一样new一个console，是因为需要记录next框架的log和数据库的log）
(async function () {
  if (typeof process != "undefined" && process.env.NODE_ENV === "production") {
    // const { appendToFile } = await import('../io')
    // const path = await import('path');
    const _log = console.log;
    const _error = console.error;
    const _warn = console.warn;
    const logFn = function (...message: any[]) {
      _log(...message);
      appendToFile(
        `\n🔵INFO ${getLog(message)}\n`,
        getServetPath(`/logs/log/${getToday()}.log`)
      );
    };
    console.log = logFn;
    console.info = logFn;
    console.warn = function (...message: any[]) {
      _warn(...message);
      appendToFile(
        `\n🟠WARN ${getLog(message, true)}\n`,
        getServetPath(`/logs/log/${getToday()}.log`)
      );
    };
    console.error = function (...message: any[]) {
      _error(...message);
      appendToFile(
        `\n🔴FAIL ${getLog(message, true)}\n`,
        getServetPath(`/logs/error/${getToday()}.log`)
      );
    };
  }
})();

/**给请求返回值使用的console。该日志仅在文件中存在，不会输出到控制台 */
export const reqLogger = (function () {
  const reqLogger = new console.Console(blackHoleStream, blackHoleStream);
  const _log = reqLogger.log;
  const _error = reqLogger.error;
  const logFn = function (...message: any[]) {
    const msg = `\n✅${getLog(message)}\n`;
    _log(msg);
    appendToFile(msg, getServetPath(`/logs/request/${getToday()}.log`));
  };
  reqLogger.log = logFn;
  reqLogger.info = logFn;
  reqLogger.warn = logFn;
  reqLogger.error = function (...message: any[]) {
    const msg = `\n❌${getLog(message, true)}\n`;
    _error(msg);
    appendToFile(msg, getServetPath(`/logs/request/${getToday()}.log`));
  };
  return reqLogger;
})();

/**打印错误日志。控制台会是红色的日志 */
export const logError = (...message: any[]) =>
  console.error("\x1B[31m", "————ERROR：", ...message, "\x1B[0m");

/**打印蓝色的日志，更加显眼 */
export const logSpecial = (...message: any[]) =>
  console.log("\x1B[36m", "———— ", ...message, "———— ", new Date(), "\x1B[0m");
