
type Obj = Record<any, any>;
type UnionToIntersection<U> = (
  U extends any ? (arg: U) => void : never
) extends (arg: infer I) => void
  ? I
  : never;
/**合并对象。 基于Object.assign。
 * @param mainObj 主对象。不能为空
 * @param otherObj 要被合并到主对象上的对象
 * @returns 返回一个新对象，避免修改原始对象
 */
export const mergeObj = <T extends Obj, D extends Obj[]>(
  mainObj: T,
  ...otherObj: D
): T & UnionToIntersection<D[number]> => {
  return Object.assign({}, mainObj, ...otherObj);
};
