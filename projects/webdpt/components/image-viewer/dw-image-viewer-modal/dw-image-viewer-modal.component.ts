import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';

import { IDwImageViewerAction, IDwImageViewerChangeData } from '../interface/dw-image-viewer-file.interface';

@Component({
  selector: 'dw-image-viewer-modal',
  templateUrl: './dw-image-viewer-modal.component.html',
  styleUrls: ['./dw-image-viewer-modal.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DwImageViewerModalComponent implements OnInit {
  @Input() uid: string;
  @Input() fileSrc: string | File;
  @Input() name: string;
  @Input() type: string;
  @Input() title: string;
  @Input() viewerAction: IDwImageViewerAction;
  @Input() containerStyle: { [klass: string]: any; }; // 瀏覽容器樣式
  @Input() toolbarStyle: { [klass: string]: any; }; // 工具列樣式
  @Input() titleStyle: { [key: string]: any; }; // 標題樣式
  @Input() onPrevious: (uid: string) => Observable<IDwImageViewerChangeData>;
  @Input() onNext: (uid: string) => Observable<IDwImageViewerChangeData>;

  constructor() { }

  ngOnInit(): void {
  }
}
