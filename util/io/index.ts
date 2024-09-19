//本文件进行一些I/O操作
import fs from "fs";
import stream from "stream";
import path from "path";
import axios from "axios";
import { jwtConfig } from "../../lib/config/index";
import FormData from "form-data";
import { logSpecial } from "./log";
import { getAbsPath } from "../other/index";
/**写入base64文件到指定路径下。 最好使用 writeFileOnServer 函数，除非你想保存文件在本机路径上
 * @param base64 base64文件
 * @param path 指定路径
 * @param name 文件名-需要包含后缀
 * @returns 返回拼接后的路径 path + name
 */
export const writeBase64File = (base64: string, path: string, name: string) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const fileBuffer = Buffer.from(base64, "base64");
      if (!path.endsWith("/")) path = path + "/";
      const filePath = path + name; // 指定保存的路径和文件名
      const realPath = await writeFile(filePath, fileBuffer);
      resolve(realPath);
    } catch (error) {
      reject(error);
    }
  });
};
/**写入Buffer文件在指定路径下。路径不存在时将会创建路径 */
export const writeFile = (filePath: string, buffer: Buffer) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const directory = path.dirname(filePath);
      fs.mkdir(directory, { recursive: true }, (err) => {
        if (err) {
          reject(err);
        } else {
          fs.writeFile(filePath, buffer, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(filePath);
            }
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
/**删除指定路径的文件 */
export const deleteFile = (path: string) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      fs.unlink(path, (err) => {
        if (err) reject(err);
        else resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};
/**删除指定文件夹及其所有文件。 */
export const deleteFolderRecursive = (folderPath: string) => {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const currentPath = `${folderPath}/${file}`;

      if (fs.lstatSync(currentPath).isDirectory()) {
        // 递归删除子文件夹
        deleteFolderRecursive(currentPath);
      } else {
        // 删除文件
        fs.unlinkSync(currentPath);
      }
    });
    // 删除空文件夹
    fs.rmdirSync(folderPath);
  }
};
/**在文件末尾追加，不存在的话会新增目录 */
export const appendToFile = (
  text: string | Buffer,
  filePath: string,
  errFn?: (err: NodeJS.ErrnoException | null) => void
) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const directory = path.dirname(filePath);
      fs.mkdir(directory, { recursive: true }, (err) => {
        if (err) {
          reject(err);
          return;
        }
        fs.appendFile(filePath, text, (err) => {
          if (err) {
            errFn?.(err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};
/**获得路径文件夹下的所有文件 */
export const getDir = (directoryPath: string) => {
  return new Promise<fs.Dirent[]>(async (resolve, reject) => {
    try {
      fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(files);
      });
    } catch (error) {
      reject(error);
    }
  });
};
/**判断文件(文件夹)是否存在。 */
export const fileExists = (filePath: string): boolean => {
  return fs.existsSync(filePath);
};

/**不执行任何操作的黑洞流 */
export const blackHoleStream = new stream.Writable({
  write(chunk, encoding, callback) {
    callback(); // 不执行任何操作，模拟黑洞流
  },
});

/**写入base64在服务器上。开发环境中调用接口，生产环境中直接存
 * @param base64 base64文件
 * @param path 指定路径
 * @param name 文件名-需要包含后缀
 * @returns 返回拼接后的路径 path + name
 */
export const writeFileOnServer = async (
  base64: string,
  path: string,
  name: string
) => {
  try {
    if (process.env.NODE_ENV === "development") {
      if (!path.endsWith("/")) path = path + "/";
      const realPath = path + name;
      const tempAbsPath = getAbsPath(`/temp`) + "/";
      //生成表单
      const formData = new FormData();
      const tempFileName = new Date().getTime() + name;
      const localPath = await writeBase64File(
        base64,
        tempAbsPath,
        tempFileName
      ); //先写入存在本机temp文件夹
      formData.append("file", fs.createReadStream(tempAbsPath + tempFileName)); //再读出
      const res = (
        await axios.post(
          `https://aigc.yy.com/api/file/localUpload?fullPath=${encodeURIComponent(
            realPath
          )}&secret=${jwtConfig.secret}`,
          formData,
          {
            headers: formData.getHeaders(),
          }
        )
      ).data;
      await deleteFile(localPath); //然后删掉
      return res as string;
    } else {
      return await writeBase64File(base64, path, name);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
function dataURLtoBlob(dataurl: string) {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)?.[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime || "" });
}
