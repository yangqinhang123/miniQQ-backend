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
  AddContactParamType,
  DeleContactParamType,
  LoginReqType,
  QueryContactListParamType,
} from "../../types/api";
import { judge } from "../../util/res/handle";
import { stringJoi } from "../../util/joi";
import QQ_DB from "../../database/all/qq_db";
import { logSpecial } from "../../util/io/log";
import JWT from "../../util/jwt";
import { RejectData, ResCode } from "../../util/res/code";
import { Op } from "sequelize";

@JsonController("/contact")
export class ContactController {
  @Post("/addContact")
  async addContact(@Body() requestBody: AddContactParamType) {
    try {
      const { personA, personB } = await judge(requestBody, {
        personA: stringJoi(),
        personB: stringJoi(),
      });
      const res = await QQ_DB.findAll("contact_table", {
        where: {
          [Op.or]: [
            { personA_user_name: personA, personB_user_name: personB },
            { personA_user_name: personB, personB_user_name: personA },
          ],
        },
      });
      if (res.length !== 0 && res[0].dataValues.is_del === 0) {
        return response.success({
          isOk: false,
          msg: "已是好友",
        });
      } else if (res.length !== 0 && res[0].dataValues.is_del === 1) {
        await QQ_DB.update(
          "contact_table",
          {
            is_del: 0,
          },
          {
            where: {
              id: res[0].dataValues.id,
            },
          }
        );
        return response.success({
          isOk: true,
          msg: "添加成功",
        });
      }else {
        await QQ_DB.add("contact_table", {
          create_time: Date.now(),
          personA_user_name: personA,
          personB_user_name: personB,
          is_del: 0,
        });
        return response.success({
          isOk: true,
          msg: "添加成功",
        });
      }
    } catch (error: any) {
      return response.errorWithReject(error);
    }
  }

  @Post("/deleContact")
  async deleContact(
    @Body() requestBody: DeleContactParamType,
    @HeaderParam("authorization") token: string
  ) {
    try {
      const { user_name } = await JWT.judgeToken(token);
      const { target_user } = await judge(requestBody, {
        target_user: stringJoi(),
      });
      await QQ_DB.update(
        "contact_table",
        { is_del: 1 },
        {
          where: {
            [Op.or]: [
              { personA_user_name: user_name, personB_user_name: target_user },
              { personA_user_name: target_user, personB_user_name: user_name },
            ],
          },
        }
      );
      return response.success("操作成功");
    } catch (error: any) {
      return response.errorWithReject(error);
    }
  }

  @Get("/queryContactList")
  async queryContactList(@HeaderParam("authorization") token: string) {
    try {
      const { user_name } = await JWT.judgeToken(token);
      const res = await QQ_DB.findAll("contact_table", {
        where: {
          [Op.or]: [
            { personA_user_name: user_name },
            { personB_user_name: user_name },
          ],
          is_del: 0,
        },
      });

      const contactList = res.map((item: any) => {
        if (item.dataValues.personA_user_name === user_name) {
          return item.dataValues.personB_user_name;
        } else {
          return item.dataValues.personA_user_name;
        }
      });
      const finalRes = await QQ_DB.findAll("user", {
        where: {
          user_name: {
            [Op.in]: contactList,
          },
        },
        attributes: {
          exclude: ["user_pwd"],
        },
      });
      return response.success(finalRes.map((item: any) => item.dataValues));
    } catch (error: any) {
      logSpecial("查询联系人列表", error);
      return response.errorWithReject(error);
    }
  }
}
