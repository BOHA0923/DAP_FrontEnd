import { Component, OnInit } from '@angular/core';

import { OrderSearchConditionModel } from './model/search-condition.model';
import { OrderService } from './service/order.service';

@Component({
  selector: 'app-dw-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  providers: [OrderSearchConditionModel, OrderService] // 在應用組件中註冊的提供商只在該組件及其子組件中可用
})
export class OrderComponent implements OnInit {
  constructor(
  ) { }

  ngOnInit(): void {
  }
}
