import {
  Controller,
  Post,
  UploadedFile,
  Get,
  Param,
  Req,
  HeaderParam,
} from "routing-controllers";
import { RejectData, ResCode } from "../../util/res/code";
import { writeFile } from "../../util/io";
import response from "../../util/res";
import { logSpecial } from "../../util/io/log";
import multer from "multer";
import { createHash } from "crypto";
import JWT from "../../util/jwt";
import fs from 'fs'
// 配置 multer 存储选项
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/Users/john/images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // 使用时间戳和原始文件名
  },
});

@Controller("/file")
export class ImageController {
  // 上传图片接口
  @Post("/upload")
  async uploadImage(
    @UploadedFile("file")
    file: Express.Multer.File,
    @HeaderParam("authorization") token: string
  ) {
    try {
      logSpecial(file);
      logSpecial(file.filename);
      if (!file) {
        throw new RejectData(ResCode.BAD_REQUEST, "文件为空！");
      }
      const { user_name } = await JWT.judgeToken(token);
      //   logSpecial(file);
      const finalFileName = getFileName(
        user_name,
        getMd5(file),
        getSuffix(file.originalname)
      );
      await writeFile(getFullPath(finalFileName), file.buffer);
      return response.success({
        msg: "上传成功",
        url: `${getPublicPath(finalFileName)}`,
      });
    } catch (error: any) {
      logSpecial("上传图片接口出错", error);
      return response.errorWithReject(error);
    }
  }

  @Get("/getFile/:filename")
  getImage(@Param("filename") filename: string) {
    const filePath = getFullPath(filename);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      throw new Error("文件未找到");
    }

    return fs.createReadStream(filePath); // 直接返回文件流
  }
}

export const fileUploadOptions = () => ({
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, "/Users/john/images/");
    },
    filename: (req: any, file: any, cb: any) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  //   fileFilter: (req: any, file: any, cb: any) => {},
  //   limits: {
  //     fieldNameSize: 255,
  //     fileSize: 1024 * 1024 * 2,
  //   },
});

/**获得文件的md5，用来作为唯一索引  -  文件过大时，获取md5会很长很长时间。 或者可以考虑，用 文件名+文件最后修改时间做“唯一”标识*/
const getMd5 = (file: Express.Multer.File) => {
  const hash = createHash("md5"); // 创建 MD5 哈希对象

  // 更新哈希值
  hash.update(file.buffer);

  // 计算最终的哈希值
  const md5Value = hash.digest("hex");
  return md5Value;
};

/**
 * 生成唯一文件名
 * @param user_name 用户qq号
 * @param md5 文件md5值
 * @param suffix 文件后缀，例如：.jpg
 */
const getFileName = (user_name: string, md5: string, suffix: string) => {
  return `${user_name}-${md5}${suffix}`;
};

const getFullPath = (fileName: string) => {
  return uploadPath + fileName;
};

const getSuffix = (originFileName: string) => {
  return `.${originFileName.split(".")[1]}`;
};

const getPublicPath = (filename: string) => {
    return `http://192.168.121.176:3000/api/file/getFile/${filename}`
}

const uploadPath = "/Users/john/images/";
