import { Injectable, Inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DwModalService } from 'ng-quicksilver/modal';

import { DwSysMenuIconComponent } from '../modals/dw-sys-menu-icon/dw-sys-menu-icon.component';


@Injectable()
export class DwSysMenuIconService {

  constructor(
    private modalService: DwModalService,
  ) { }

  public iconClassSelect(fControl: AbstractControl): void {
    this.modalService.create({
      // dwTitle: this.modifyTitle,
      dwContent: DwSysMenuIconComponent,
      dwOnOk: (data: any): void => {
        fControl.setValue(data.iconClassSelect);
      },
      dwOnCancel(): void { },
      dwFooter: null,
      dwComponentParams: {
        iconClass: fControl.value
      }
    });
  }

  public iconClassDelete(fControl: AbstractControl): void {
    fControl.setValue('');
  }
}
