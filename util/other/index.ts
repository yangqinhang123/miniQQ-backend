import path from "path";
/**拼接得到原路径（基于项目根目录）在本机的绝对路径。 path.join(process.cwd(), projectPath)
 * @param projectPath 本项目里的绝对路径 ，如 /app/api/xxx
 */
export const getAbsPath = (projectPath: string) => {
  return path.join(process.cwd(), projectPath);
};

/**传入泛型就有类型提示的 JSON.parse  */
export const jsonParse = <T>(json: string): T => {
  return JSON.parse(json) as T;
};
