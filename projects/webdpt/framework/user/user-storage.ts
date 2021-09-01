import { SessionStorage } from '@webdpt/framework/storage';
import { Injectable } from '@angular/core';
import { DwUserModule } from './user.module';

/**
 * 獲取儲存的格式
 * @export
 */
@Injectable({
  providedIn: DwUserModule
})
export class DwUserStorage extends SessionStorage {
}

