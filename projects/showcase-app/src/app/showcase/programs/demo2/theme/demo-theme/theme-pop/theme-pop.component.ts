import { Component } from '@angular/core';
@Component({
  selector: 'cust-theme-pop',
  template: `
  <ul class="tttt" style="list-style-type:none;">
    <li>
     <button dw-button dwType="primary" dwThemeDirective dwReference='佈景元件按鈕'>Click me</button>
    </li>
    <li>
     <a
       dwThemeDirective
       dwReference='佈景元件'
       dwPlacement='top'
       dwTrigger='hover'>Hover me</a>
    </li>
  </ul>
  `,
  styles: [`
  ul li::before{
    display:none
  }
  ul li {
    display: inline;
  }
` ]
})
export class ThemePopComponent {

  constructor() { }


}

