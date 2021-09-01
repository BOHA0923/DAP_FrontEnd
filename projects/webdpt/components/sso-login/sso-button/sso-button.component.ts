import { Component, OnInit, Input } from '@angular/core';
import { DwSsoService } from '@webdpt/framework/iam';

@Component({
  selector: 'app-sso-button',
  templateUrl: './sso-button.component.html',
  styleUrls: ['./sso-button.component.less']
})
export class DwSsoButtonComponent implements OnInit {

  private _url: string;
  private _text: string;
  private _newWin: boolean;

  @Input()
  set url(url: string) {
    this._url = url;
  }
  get url(): string {
    return this._url;
  }

  @Input()
  set text(text: string) {
    this._text = text;
  }
  get text(): string {
    return this._text;
  }

  @Input()
  set newWin(newWin: boolean) {
    if (typeof newWin === 'string') {
      this._newWin = JSON.parse(newWin);
    } else {
      this._newWin = newWin;
    }

  }
  get newWin(): boolean {
    return this._newWin;
  }

  @Input() otherParams: {};

  constructor(private ssoService: DwSsoService) {
  }

  public redirectUrl(): void {
    this.ssoService.redirectUrl(this.url, this.newWin, this.otherParams);
  }

  ngOnInit(): void {
  }

}
