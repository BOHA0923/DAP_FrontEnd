import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';

import { DwLanguagePreService } from '@webdpt/framework/program-info';

/**
 * 作業標題
 *
 * @see 運用於Menu或頁籤管理，執行期指定作業標題
 * @usageNotes 標題多語言編號[titleKey]和作業編號[programId]至少傳入一種提供翻譯。是否提示[dwShowTooltip]
 * @example <dw-program-title [titleKey]="'menu.menuId'" [programId]="" [dwShowTooltip]="true"></dw-program-title>
 * @example <dw-program-title [titleKey]="'menu.menuId'" [programId]="'dw-group'"></dw-program-title>
 * @example <dw-program-title [titleKey]="'basic-translate-id'" [programId]=""></dw-program-title>
 * @example <dw-program-title [titleKey]="" [programId]="'home'"></dw-program-title>
 */
@Component({
  selector: 'dw-program-title',
  templateUrl: './program-title.component.html',
  styleUrls: ['./program-title.component.less'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DwProgramTitleComponent implements OnInit {
  @ViewChild('dwProgramTitleTpl') dwProgramTitleTpl: TemplateRef<any>;

  programIdSpan = '';
  transProgramId = '';
  private _titleKey: string;
  private _programId: string;
  menuPre = this.dwLanguagePreService.menu;
  programPre = this.dwLanguagePreService.program;

  @Input()
  dwShowTooltip = false; // 是否提示

  get tooltipTitle(): any {
    if (!this.dwShowTooltip) {
      return '';
    } else {
      return this.dwProgramTitleTpl;
    }
  }

  @Input()
  set titleKey(titleKey: string) {
    this._titleKey = titleKey;
  }

  get titleKey(): string {
    return this._titleKey || '';
  }

  @Input()
  set programId(programId: string) {
    this._programId = programId;
    this.programIdChange(this._programId);
  }

  constructor(
    private dwLanguagePreService: DwLanguagePreService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cd.detectChanges();
  }

  private programIdChange(programId: string): void {
    this.programIdSpan = '';
    this.transProgramId = '';

    if (programId) {
      this.programIdSpan = programId;
      this.transProgramId = this.programPre + programId;
    }
  }
}
