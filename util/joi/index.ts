import Joi from "joi";

//Joi参数校验，一些通用的校验值


/**基础config */
interface BaseConfig {
    /**是否必填，默认true */
    required?: boolean;
}

interface StringJoiConfig extends BaseConfig {
    /**是否允许空字符串，默认false */
    allowEmpty?: boolean;
    /**最大长度，最好填写，与数据库中匹配 */
    maxLength?: number;
    /**限制值的枚举 */
    validValue?: any[]
}
/**字符串类型的数据*/
export const stringJoi = ({ allowEmpty = false, maxLength, required = true, validValue }: StringJoiConfig = {}) => {
    let rule = Joi.string()
    if (allowEmpty) rule = rule.allow('')
    if (maxLength) rule = rule.max(maxLength)
    if (validValue) rule = rule.valid(...validValue)
    if (required) rule = rule.required()
    return rule
}
interface NumberJoiConfig extends BaseConfig {
    /**最大数字 */
    max?: number;
    /**最小数字 */
    min?: number;
    /**允许的值 */
    validValue?: any[];
}
/**数字类型的数据  */
export const numberJoi = ({ required = true, max, min, validValue }: NumberJoiConfig = {}) => {
    let rule = Joi.number()
    if (max) rule = rule.max(max)
    if (min) rule = rule.min(min)
    if (validValue) rule = rule.valid(...validValue)
    if (required) rule = rule.required()
    return rule
}

interface BooleanJoiConfig extends BaseConfig { }
/**布尔值类型的数据 */
export const booleanJoi = ({ required = true }: BooleanJoiConfig = {}) => {
    let rule = Joi.boolean()
    if (required) rule = rule.required()
    return rule
}

interface DateJoiConfig extends BaseConfig { }
/**日期类型的校验 */
export const dateJoi = ({ required = true }: DateJoiConfig = {}) => {
    let rule = Joi.date()
    if (required) rule = rule.required()
    return rule
}

interface ArrayJoiConfig extends BaseConfig {
    /**数组中允许的元素类型 */
    items?: Joi.SchemaLikeWithoutArray[]
    /**数组长度 */
    length?: number
}
export const arrayJoi = ({ items, required = true, length }: ArrayJoiConfig = {}) => {
    let rule = Joi.array()
    if (items) rule = rule.items(...items)
    if (length) rule = rule.length(length)
    if (required) rule = rule.required()
    return rule
}


/**分页请求的基础参数校验 */
export const pagingJoi = {
    page: numberJoi(),
    size: numberJoi()
}
/**tinyint类型的Joi。 必填 */
export const tinyintJoi = numberJoi({ validValue: [0, 1] })
/**时间范围类型Joi的判断 （非必填） */
export const timeRangeJoi = arrayJoi({ required: false, items: [stringJoi()], length: 2 })
