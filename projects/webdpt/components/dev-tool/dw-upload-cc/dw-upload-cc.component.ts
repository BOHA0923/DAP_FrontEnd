import { Component, OnInit, isDevMode } from '@angular/core';

@Component({
  selector: 'app-dw-upload-cc',
  templateUrl: './dw-upload-cc.component.html',
  styleUrls: ['./dw-upload-cc.component.less']
})
export class DwUploadCcComponent implements OnInit {
  public dw_env_production: boolean;

  constructor(
  ) { }

  ngOnInit(): void {
    this.dw_env_production = isDevMode();
  }
}
