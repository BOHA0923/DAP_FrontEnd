import { Component, OnInit } from '@angular/core';

import { SearchConditionModel } from './model/search-condition.model';
import { AsisService } from './service/asis.service';

@Component({
  selector: 'app-dw-asis',
  templateUrl: './asis.component.html',
  styleUrls: ['./asis.component.css'],
  providers: [SearchConditionModel, AsisService] // 在應用組件中註冊的提供商只在該組件及其子組件中可用
})
export class AsisComponent implements OnInit {
  constructor(
    // tslint:disable-next-line:typedef
  ) { }

  ngOnInit(): void {
  }
}
