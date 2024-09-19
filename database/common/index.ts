
import dayjs from "dayjs";
import { Op } from "sequelize";
import "server-only"; //代表仅服务端可使用


type DateRange = [string, string];
/**快速生成一个排序规则
 * @param field 字段名
 * @param rule 规则，升序ASC ， 降序DESC
 * @template T 泛型可以帮助写入field参数
 */
export const getOrder = <T extends object>(
  field: keyof T,
  rule: "DESC" | "ASC"
) => {
  return [field, rule] as [string, string];
};

/**生成时间范围规则，在where中使用
 * @param dateRange 时间范围元组。
 * @example 输入：['2023-10-11', '2023-10-13']， 能够查询到 2023-10-11T00:00:00 ~ 2023-10-13T23:59:59 的所有数据
 */
export const getDateRule = (dateRange: DateRange) => {
  const startDate = dayjs(dateRange[0]).startOf("day");
  const endDate = dayjs(dateRange[1]).endOf("day");
  return {
    [Op.gt]: startDate.toDate(),
    [Op.lt]: endDate.toDate(),
  };
};
