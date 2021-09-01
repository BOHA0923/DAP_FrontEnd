import { DwModalRef } from 'ng-quicksilver/modal';
import { Component, OnInit } from '@angular/core';
import { Demo1EmployeeRepository } from '../../../repository';

@Component({
  selector: 'app-dw-employee-list',
  templateUrl: './employee-list.component.html',
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
export class EmployeeListComponent implements OnInit {

  employeeName: string;
  employees: any[] = [];

  constructor(private subject: DwModalRef,
              private employee: Demo1EmployeeRepository) {

  }

  emitDataOutside(): void {

    if (this.employeeName) {
    // this.subject.next(this.employeeName);
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

    this.employee.getEmployees().subscribe(
      (employees) => {
        this.employees = employees;
      }
    );

  }

}
