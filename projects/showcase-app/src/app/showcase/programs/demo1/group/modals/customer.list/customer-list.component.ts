import { DwModalRef } from 'ng-quicksilver/modal';
import { Component, OnInit } from '@angular/core';
import { Demo1CustomerRepository } from '../../../repository';

@Component({
  selector: 'app-dw-customer-list',
  templateUrl: './customer-list.component.html',
  styles: [`
    .customize-footer {
      border-top: 1px solid #e9e9e9;
      padding: 10px 18px 0 10px;
      text-align: right;
      border-radius: 0 0 0 0;
      margin: 15px -16px -5px -16px;
    }
    dw-radio-group {
      width: 100%;
    }
  `]
})
export class CustomerListComponent implements OnInit {

  customerName: string;
  customers: any[] = [];

  constructor(private subject: DwModalRef,
              private customer: Demo1CustomerRepository) {

  }

  emitDataOutside(): void {

    if (this.customerName) {
    // this.subject.next(this.customerName);
    this.handleCancel('onOk');
    } else {
      this.handleCancel();
    }
  }

  handleCancel(type?: string): void {
    type ? this.subject.triggerOk() : this.subject.triggerCancel();
   // this.subject.destroy(type ? type : 'onCancel');
  }

  ngOnInit(): void {

    this.customer.getCustomers().subscribe(
      (customers) => {
        this.customers = customers;
      }
    );

  }

}
