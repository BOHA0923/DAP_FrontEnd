import { Params } from '@angular/router';

export interface IDwRouteInfo {
    id: string; // 等於執行期的programId => operation.code
    title: string; // 標題：多語言編號，對應到翻譯檔的key，預設以作業編號翻譯。
    menuId?: string; // 從Menu開啟作業時記錄，為了與Menu互動
    routerLink: string;
    queryParams?: Params;
    params?: Params;
    selected?: boolean;
    scrollHeight?: number;
    scrollTop?: number;
    iconClass?: string;
    canClose?: boolean;
    canMultiOpen?: boolean;
    defaultOpen?: boolean;
    type?: string;
    outerUrl?: string;
    reload?: boolean;
    module?: string;
}

