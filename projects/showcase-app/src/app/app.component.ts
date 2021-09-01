import { Component } from '@angular/core';
import { DwLanguageService } from '@webdpt/framework/language';

@Component({
  selector: 'app-root',
  template: `
  <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(langService: DwLanguageService) {}
}
