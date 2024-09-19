import dayjs from "dayjs";
/**把时间转为 YYYY-MM-DD HH:mm:ss
 * @param date 要传递给dayjs的参数，不传递则使用当前时间
 * @returns 字符串
 */
export const formatDay = (date?: dayjs.ConfigType) => {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};

/**获得日期 YYYY-MM-DD
 * @param date 要传递给dayjs的参数，不传递则使用当前时间
 * @returns 字符串
 */
export const getToday = (date?: dayjs.ConfigType) => {
  return dayjs(date).format("YYYY-MM-DD");
};

/**超出长度截断字符串，可以添加末尾字符
 * @param str 字符串
 * @param maxLength 最大长度
 * @param tip 如果超出长度，末尾的提示字符
 * @returns 新字符串
 */
export const sliceStr = (str: string, maxLength: number, tip = "") => {
  if (str.length < maxLength) return str;
  else return str.slice(0, maxLength) + tip;
};


