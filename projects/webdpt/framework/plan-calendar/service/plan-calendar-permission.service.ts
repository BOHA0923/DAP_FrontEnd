import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * 行事曆權限服務
 */
@Injectable()
export class DwPlanCalendarPermissionService {
  constructor(
    public translateService: TranslateService,
  ) {
  }

  /**
   * 參與者權限預設屬性
   */
  public attendeePermissionList(): Array<any> {
    return [
      {
        key: 'EDIT', // 修改活動
        hasPermission: false,
        titleKey: this.translateService.instant('dw-plan-calendar-modify-schedule')
      },
      {
        key: 'INVITE', // 邀請參與者
        hasPermission: false,
        titleKey: this.translateService.instant('dw-plan-calendar-invite-participants')
      },
      {
        key: 'VIEW', // 查看參與者列表
        hasPermission: false,
        titleKey: this.translateService.instant('dw-plan-calendar-view-participants-list')
      }
    ];
  }

  /**
   * 行事曆權限
   *
   * @param calendarPermission 使用者行事曆權限
   * @param defaultCal 是否為預設行事曆
   */
  permission(calendarPermission: string, defaultCal: boolean): any {
    const permission = {
      // readDetail: false, // 查看詳情
      // readAttendee: false, // 查看參與者
      modifyDetail: false, // 修改詳情(可進編輯頁)
      // modifyAttendee: false, // 修改參與者(可進編輯頁)
      // add: false, // 新增(可進編輯頁)
      delete: false, // 刪除
      unsubscribe: false // 取消訂閱
    };

    if (calendarPermission === 'MANAGE') { // 管理行事曆及協作設置
      permission.modifyDetail = true;

      // 不是預設行事曆才可以刪除
      if (!defaultCal) {
        permission.delete = true;
      }
    } else {
      permission.unsubscribe = true;
    }

    return permission;
  }

  /**
   * 活動權限
   *
   * @param calendarPermission 使用者行事曆權限
   * @param attendeePermission 使用者活動參與者權限，參加活動才能有活動參與者權限
   * @param attendeeStatus 使用者活動參與狀態。不確定:TENTATIVE, 參加:CONFIRMED, 不參加:CANCELED
   */
  eventPermission(calendarPermission: string, attendeePermission: Array<string>, attendeeStatus: string): any {
    const permission = {
      readDetail: false, // 活動查看詳情
      readAttendee: false, // 活動查看參與者
      modifyDetail: false, // 活動修改詳情(可進活動編輯頁)
      modifyAttendee: false, // 活動修改參與者(可進活動編輯頁)
      add: false, // 活動新增(可進活動編輯頁)
      delete: false // 活動刪除
    };

    // 行事曆協作權限
    switch (calendarPermission) {
      case 'MANAGE': // 管理行事曆及協作設置
        permission.readDetail = true;
        permission.readAttendee = true;
        permission.modifyDetail = true;
        permission.modifyAttendee = true;
        permission.add = true;
        permission.delete = true;
        break;

      case 'EDIT': // 可創建及修改活動
        permission.readDetail = true;
        permission.readAttendee = true;
        permission.modifyDetail = true;
        permission.modifyAttendee = true;
        permission.add = true;
        permission.delete = true;
        break;
      case 'READ_DETAIL': // 可查看所有活動詳情
        permission.readDetail = true;
        permission.readAttendee = true;
        break;
      case 'READ_ONLY': // 只能看到是否忙碌
        break;
    }

    // 參加活動才能有活動參與者權限
    if (attendeeStatus === 'CONFIRMED') { // 參加
      permission.readDetail = true; // 活動參與者權限都不勾，參與者也還是要活動查看詳情

      attendeePermission.forEach(
        (attendeePermissionItem: string) => {
          switch (attendeePermissionItem) {
            case 'EDIT': // 修改活動
              permission.readDetail = true;
              permission.readAttendee = true;
              permission.modifyDetail = true;
              permission.modifyAttendee = true;
              break;
            case 'INVITE': // 邀請參與者
              permission.readDetail = true;
              permission.readAttendee = true;
              permission.modifyAttendee = true;
              break;
            case 'VIEW': // 查看參與者列表
              permission.readDetail = true;
              break;
          }
        }
      );
    } else if (attendeeStatus === 'TENTATIVE') {
      permission.readDetail = true;
    }

    return permission;
  }
}
