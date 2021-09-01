import { DwModalRef } from 'ng-quicksilver/modal';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'dw-announcement-modal',
  templateUrl: './announcement-modal.component.html',
  styleUrls: ['./announcement-modal.component.less']
})
export class DwAnnouncementModalComponent implements OnInit {

  _description: SafeHtml;
  @Input()
  set description(value: any) {
    this._description = this._sanitizer.bypassSecurityTrustHtml(value);
  }
  get description(): any {
    return this._description;
  }
  isIgnore: boolean = false;

  constructor(

    private _sanitizer: DomSanitizer,
    private modalSubject: DwModalRef
  ) { }

  close(): void {
    this.modalSubject.destroy(this.isIgnore);
  }
  ngOnInit(): void {
  }
}
