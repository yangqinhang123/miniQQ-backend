import {
  Body,
  Controller,
  Get,
  HeaderParam,
  HeaderParams,
  JsonController,
  Post,
  QueryParams,
} from "routing-controllers";
import response from "../../util/res";
import {
  AddChatHistoryParamType,
  AddContactParamType,
  DeleChatParamType,
  GetChatHistoryParamType,
  LoginReqType,
  QueryContactListParamType,
} from "../../types/api";
import { judge } from "../../util/res/handle";
import { arrayJoi, numberJoi, stringJoi } from "../../util/joi";
import QQ_DB from "../../database/all/qq_db";
import { logSpecial } from "../../util/io/log";
import JWT from "../../util/jwt";
import { RejectData, ResCode } from "../../util/res/code";
import { Op } from "sequelize";
import Joi from "joi";
import { chat_history } from "../../types/databases/qq_db";

@JsonController("/chat")
export class ChatController {
  @Post("/addChatHistory")
  async addContact(@Body() requestBody: AddChatHistoryParamType) {
    try {
      const { chat_list } = await judge(requestBody, {
        chat_list: arrayJoi({
          items: [
            Joi.object({
              id: stringJoi(),
              create_time: numberJoi(),
              from: stringJoi(),
              to: stringJoi(),
              msg: stringJoi(),
              is_del: numberJoi(),
            }),
          ],
        }),
      });
      //   await QQ_DB.modelMap['user'].bulkCreate(chat_list);
      for (let i = 0; i < chat_list.length; i++) {
        const element = chat_list[i];
        if (!(await isHaveChat(element))) {
          await QQ_DB.add("chat_history", chat_list[i]);
        }
      }
      return response.success({
        isOk: true,
        msg: "添加成功",
      });
    } catch (error: any) {
      logSpecial("添加聊天记录", error);
      return response.errorWithReject(error);
    }
  }

  @Get("/getChatHistory")
  async getChatHistory(@HeaderParam("authorization") token: string) {
    try {
      const { user_name } = await JWT.judgeToken(token);
      const res = await QQ_DB.findAll("chat_history", {
        where: {
          [Op.or]: [{ from: user_name }, { to: user_name }],
          is_del: 0,
        },
        order: [["create_time", "ASC"]],
      });

      return response.success(res.map((item: any) => item.dataValues));
    } catch (error: any) {
      logSpecial("查询所有有关自己的聊天记录", error);
      return response.errorWithReject(error);
    }
  }

  @Post("/deleChat")
  async deleChat(@Body() requestBody: DeleChatParamType) {
    try {
      const { id } = await judge(requestBody, {
        id: stringJoi(),
      });
      await QQ_DB.update(
        "chat_history",
        {
          is_del: 1,
        },
        {
          where: {
            id,
          },
        }
      );
      return response.success("操作成功");
    } catch (error: any) {
      logSpecial("删除聊天记录失败", error);
      return response.errorWithReject(error);
    }
  }
}
/**
 * 判断数据库里是否已有该条聊天记录
 * @param item
 * @returns
 */
export const isHaveChat = async (item: chat_history) => {
  const res = await QQ_DB.findAll("chat_history", {
    where: {
      id: item.id,
    },
  });
  if (res && res.length !== 0) {
    return true;
  } else {
    return false;
  }
};
