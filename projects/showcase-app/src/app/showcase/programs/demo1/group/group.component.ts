import { Component, OnInit } from '@angular/core';

import { SearchConditionModel } from './model/search-condition.model';
import { GroupService } from './service/group.service';

@Component({
  selector: 'app-dw-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
  providers: [SearchConditionModel, GroupService] // 在應用組件中註冊的提供商只在該組件及其子組件中可用
})
export class GroupComponent implements OnInit {
  constructor(
    // tslint:disable-next-line:typedef
  ) { }

  ngOnInit(): void {
  }
}
