// import { Injectable } from '@angular/core';

// import { SessionStorage } from '../../../storage/session-storage';

// @Injectable()
// export class DwRecursiveMenuStorageService {
//   private storageId = 'recursiveMenuStorage';
//   private data = {
//     selectMenuId: ''
//   };

//   constructor(
//     private sessionStorage: SessionStorage
//   ) {
//     this.data = this.get();
//     if (!this.data) {
//       this.data = {
//         selectMenuId: ''
//       };
//     }
//   }

//   /* 獲取資料 */
//   get(): any {
//     const str = sessionStorage.getItem(this.storageId);
//     const obj = JSON.parse(str);
//     return obj;
//   }

//   /* 去除資料 */
//   remove(): void {
//     sessionStorage.removeItem(this.storageId);
//   }

//   set selectMenuId(selectMenuId: string) {
//     this.data.selectMenuId = selectMenuId;
//     const str = JSON.stringify(this.data);
//     sessionStorage.setItem(this.storageId, str);
//   }
// }
