import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { DwImageViewerFileService } from './dw-image-viewer-file.service';

@Component({
  selector: 'dw-image-viewer-file-icon',
  templateUrl: './dw-image-viewer-file-icon.component.html',
  styleUrls: ['./dw-image-viewer-file-icon.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DwImageViewerFileIconComponent implements OnInit {
  public fileIcon = null;

  @Input()
  set mimeType(mimeType: string) {
    if (mimeType) {
      if (mimeType.indexOf('image/') === 0) {
        this.fileIcon = 'file-image';
      } else if (mimeType.indexOf('video/') === 0) {
        this.fileIcon = 'video-camera';
      } else if (mimeType.indexOf('audio/') === 0) {
        this.fileIcon = 'customer-service';
      } else if (mimeType.indexOf('text/') === 0) {
        this.fileIcon = 'file-text';
      } else {
        this.fileIcon = this.dwImageViewerFileService.mimeToIcon(mimeType);
      }
    } else {
      this.fileIcon = this.dwImageViewerFileService.mimeToIcon(mimeType);
    }
  }

  @Input()
  fileIconColor: string;
  constructor(
    private dwImageViewerFileService: DwImageViewerFileService
  ) { }

  ngOnInit(): void {
  }
}
