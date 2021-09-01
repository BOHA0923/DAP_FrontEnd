
export interface IStorage {

  /* 獲取單筆資料 */
  get(id: string): any;
  /* 設定資料 */
  set(id: string, value: string): void;
  /* 去除資料 */
  remove(id: string): void;
  /* 清除資料 */
  clear(): void;
  /* 獲取全部資料 */
  getAll(): Array<any>;
}
