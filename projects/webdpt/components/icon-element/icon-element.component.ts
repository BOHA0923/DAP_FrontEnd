import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dw-icon-element',
  templateUrl: './icon-element.component.html',
  styleUrls: ['./icon-element.component.less'],
  providers: []
})
export class DwIconElementComponent implements OnInit {
  @Input()
  set dwIconClass(dwIconClass: string) {
    const parseResult = this.parseIconClass(dwIconClass);
    this.dwType = parseResult.dwType;
    this.dwTheme = parseResult.dwTheme;
    this.cssClass = parseResult.cssClass;
  }

  public dwType = '';
  public dwTheme = ''; // 'fill'丨'outline'丨'twotone'
  public cssClass = '';

  constructor() {
  }

  ngOnInit(): void {
  }

  private parseIconClass(iconClass: string): any {
    const result = {
      dwType: '',
      dwTheme: '', // 'fill'丨'outline'丨'twotone'
      cssClass: ''
    };

    if (iconClass) {
      const arr = iconClass.split(' ');

      arr.forEach(
        (classItem: string) => {
          if (classItem.indexOf('dwType:') !== -1) {
            result.dwType = classItem.replace('dwType:', '');
          } else if (classItem.indexOf('dwTheme:') !== -1) {
            result.dwTheme = classItem.replace('dwTheme:', '');
          } else {
            result.cssClass = result.cssClass + ' ' + classItem;
          }
        }
      );

      result.cssClass.trim();
    }

    return result;
  }
}
