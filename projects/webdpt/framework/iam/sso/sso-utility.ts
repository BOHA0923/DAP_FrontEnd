export class SsoUtility {
  /**
   * 取得SSO網址
   *
   * @param url SSO 前往的 url
   * @param [otherParams] 要前往的額外參數, 若名稱相同, 以此為優先
   * @returns SSO URL
   */
  static getSsoUrl(url: string,  userToken: string, otherParams?: {}): string {
    // 鼎捷雲登入後，取得的userToken內，只存在用戶資訊，
    // 從鼎捷雲SSO進入產品服務時，用鼎捷雲的userToken即使能通過驗證，但缺少租戶資訊供雲端產品識別資料，
    // 所以需要sso-button增加處理租戶id+沒有租戶id的userToken轉換成有租戶id用戶id的userToken。

    // 為了要在網址結尾後加page[sso-login], 所以需確認網址結尾為'/'.
    const arrUrl = url.split('?');
    if (arrUrl[0].substr(-1) !== '/') {
      arrUrl[0] += '/';
    }

    // 將 routerLink 與其餘的參數, 一起轉成 object.
    const objLocation = new URL(url);
    const urlParams = SsoUtility.getJsonFromUrl(objLocation);

    // 預設的 userToken, 登入時取到的.
    const defaultParams = {
      userToken: userToken
    };

    // 有可能是 undefined.
    if (!otherParams) {
      otherParams = {};
    }

    // 匯整成 1 個 object, 優先序高的放在最後, 為了要後值蓋前值.
    const params = Object.assign({}, defaultParams, urlParams, otherParams);

    // 將所有的參數組成 query parameters.
    const qryString = Object.keys(params).map((_key) => {
      return encodeURIComponent(_key) + '=' + encodeURIComponent(params[_key]);
    }).join('&');

    const newUrl = arrUrl[0] + 'sso-login?' + qryString;

    return newUrl;
  }


  /**
   * 解析 url 的 query parameters 成 object.
   *
   * param {*} strLocation
   * returns {*} object.
   */
  static getJsonFromUrl(objLocation: any): any {
    const query = objLocation.search.substr(1); // 解析 $location( URL string) 的 search.
    const result = {};

    // 如果沒有額外參數, 就不需要往下解析.
    if (!query) {
      return result;
    }

    query.split('&').forEach(
      (params: any) => {
        const item = params.split('=');
        result[item[0]] = decodeURIComponent(item[1]);
      }
    );

    return result;
  }

}
