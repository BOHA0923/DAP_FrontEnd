import { DwModalRef } from 'ng-quicksilver/modal';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'dw-login-block-modal',
  templateUrl: './login-block-modal.component.html',
  styleUrls: ['./login-block-modal.component.less']
})
export class DwLoginBlockModalComponent implements OnInit {
  _description: SafeHtml;
  @Input()
  set description(value: any) {
    this._description = this._sanitizer.bypassSecurityTrustHtml(value);
  }
  get description(): any {
    return this._description;
  }
  @Input()
  title: string;
  @Input()
  btnTitle: string;
  constructor(

    private _sanitizer: DomSanitizer,
    private modalSubject: DwModalRef
  ) { }
  close(): void {
    this.modalSubject.destroy(true);
  }

  ngOnInit(): void {
  }

}
