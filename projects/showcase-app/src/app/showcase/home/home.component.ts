import { Component, OnInit } from '@angular/core';

import { DwAnnouncementModalService } from '@webdpt/components/announcement';
import { DwSystemConfigService } from '@webdpt/framework/config';
import { DwUserService } from '@webdpt/framework/user';

@Component({
  selector: 'app-showcase-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
// 竹加的



// 竹加的 end

export class ShowcaseHomeComponent implements OnInit {
  // 公告
  public announcement: {
    bgColor: string,
    iconText: string,
    title: string,
    author: string
  }[];

  cardList = []; // 卡片清單
  private deployConfig: any; // 部署參數


  constructor(
    private announcementModalService: DwAnnouncementModalService,
    private userService: DwUserService,
    private configService: DwSystemConfigService
  ) {
    this.configService.getConfig().subscribe(
      configs => {
        this.deployConfig = configs;
        this.initCardList();
      }
    );
  }

  ngOnInit(): void {
    // 公告提示
    // this.announcementModalService.displayAnnouncement('release').subscribe(res => {
    //   // Do something
    // });

    // 公告初始化
    this.announcement = [
      {
        'bgColor': '#15d6ba',
        'iconText': 'UX',
        'title': '【UX組公告】從今天開始連續放假七天',
        'author': '3 天前 by liuliu_Wang'
      },
      {
        'bgColor': 'rgb(255, 102, 0)',
        'iconText': '端',
        'title': '【端平台公告】加班津貼將於11/11發放',
        'author': '3 天前 by liuliu_Wang'
      },
      {
        'bgColor': 'rgb(16, 141, 233)',
        'iconText': '企',
        'title': '【企管部公告】失物招領一件，請至15樓領取',
        'author': '3 天前 by liuliu_Wang'
      },
      {
        'bgColor': 'rgb(249, 200, 6)',
        'iconText': '人',
        'title': '【人資部】下半年績效考核開始',
        'author': '3 天前 by liuliu_Wang'
      }
    ];

  }


  /**
   * 初始卡片清單的資料
   *
   */
  initCardList(): void {
    this.cardList = [
      {
        'title': 'DAP 大屏設計方案', // 站台的名稱(卡片標題)
        'sampleImage': './assets/img/showcase/card01.svg', // 站台畫面截圖(卡片封面)
        'newWin': true, // 是否開新窗
        'ssoLogin': true, // 是否需要 SSO login
        'url': this.deployConfig.screenUrl, // demo 站台的 URL
        'otherParams': {} //  自定義的額外傳遞的參數
      },
      {
        'title': '鼎捷 雲市集',
        'sampleImage': './assets/img/showcase/card02.svg',
        'newWin': true,
        'ssoLogin': true,
        'url': this.deployConfig.marketUrl,
        'otherParams': {}
      },
      {
        'title': '鼎捷 雲控制台',
        'sampleImage': './assets/img/showcase/card03.svg',
        'newWin': true,
        'ssoLogin': true,
        'url': this.deployConfig.consoleUrl,
        'otherParams': {}
      },
      {
        'title': 'DAP 知識庫',
        'sampleImage': './assets/img/showcase/card04.svg',
        'newWin': true,
        'ssoLogin': false,
        'url': '//dap.digiwin.com', // 基本上不大會變, 先直接寫在代碼裡, 日後如果有情境上的需要, 再調整過
        'otherParams': {}
      }
    ];
  }


  /**
   * 點擊卡片清單, 導頁至 demo 站台
   *
   */
  openSiteUrl(card: any): void {
    // 如果 URL 不存在, 無需往下執行
    if (!this.checkSiteUrl(card)) {
      return;
    }

    let newUrl = null; // 目的頁的 URL
    let qryString = null; // 目的頁需要額外傳遞的參數

    // 自定義的額外傳遞的參數
    if (!card.otherParams) {
      card.otherParams = {};
    }

    // 是否需要 SSO Login
    if (card.ssoLogin) {
      // 預設的 userToken, 登入時取到的.
      const defaultParams = {
        userToken: this.userService.getUser('token')
      };

      const params = Object.assign({}, defaultParams, card.otherParams);

      // 將所有的參數組成 query parameters.
      qryString = Object.keys(params).map((_key) => {
        return encodeURIComponent(_key) + '=' + encodeURIComponent(params[_key]);
      }).join('&');

      newUrl = card.url + '/sso-login';
    } else {
      newUrl = card.url;
    }

    // 當有額外需要傳遞的參數時
    if (qryString) {
      newUrl += '?' + qryString;
    }

    // 導頁方式: 開新窗或是本頁導頁
    if (card.newWin) {
      window.open().location.href = newUrl;
    } else {
      document.location.href = newUrl;
    }

  }

  /**
   * 確定 URL 是否存在
   *
   */
  checkSiteUrl(card: any): boolean {
    // 如果 card.url 為空字串時
    if (!card.url) {
      return false;
    }

    // 如果 card.url 為部署參數(未被代換)時
    if (card.url === '@SCREEN_SERVICE_URL@' || card.url === '@CONSOLE_URL@' || card.url === '@MARKET_URL@') {
      return false;
    }

    // 如果 card.url 是為 Tab 與 一堆空字串時
    const cardUrl = card.url.toString().trim().replace(/(\r\n|\n|\r)/g, ''); // 去除 Tab 與空白
    if (!cardUrl) {
      return false;
    }

    return true;
  }

}
