import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { DwCellButtonEditorComponent } from './cell-button-editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DwToolTipModule } from 'ng-quicksilver/tooltip';
import { DwInputModule } from 'ng-quicksilver/input';
import { DwInputNumberModule } from 'ng-quicksilver/input-number';
import { DwFormModule } from 'ng-quicksilver/form';
import { DwDatePickerModule } from 'ng-quicksilver/date-picker';
import { DwSelectModule } from 'ng-quicksilver/select';
import { DwButtonModule } from 'ng-quicksilver/button';
import { DwIconModule } from 'ng-quicksilver/icon';

import { ButtonEditorFilterComponent } from './button-editor-filter.component';
import { DwAgGridDateInputComponent } from './ag-grid-date-input.component';
import { FloatingButtonEditorFilterComponent } from './floating-button-editor-filter.component';
import { DwAgGridDateEditorComponent } from './ag-grid-date-editor.component';
import { DwAgTextCellEditorComponent } from './ag-text-cell-editor.component';
import { DwAgTextColumnFilterComponent } from './ag-text-column-filter.component';
import { DwAgTextColumnFloatingFilterComponent } from './ag-text-column-floating-filter.component';
import { DwAgNumberCellEditorComponent } from './ag-number-cell-editor.component';
import { DwAgSelectCellEditorComponent } from './ag-select-cell-editor.component';
import { DwAgLargeTextCellEditorComponent } from './ag-large-text-cell-editor.component';
import { TranslateModule } from '@ngx-translate/core';
import { DwAgGridValidationEditorComponent } from './ag-grid-validation-editor';
import fnsParse from 'date-fns/parse';


const dateFilterCompare = (filterLocalDateAtMidnight, cellValue): any => {
  cellValue = fnsParse(cellValue, 'dd/MM/yyyy', new Date());
  if (filterLocalDateAtMidnight.getFullYear() === cellValue.getFullYear() &&
    filterLocalDateAtMidnight.getDate() === cellValue.getDate() &&
    filterLocalDateAtMidnight.getMonth() === cellValue.getMonth()) {
    return 0;
  }
  if (cellValue.getTime() < filterLocalDateAtMidnight.getTime()) {
    return -1;
  }
  if (cellValue.getTime() > filterLocalDateAtMidnight.getTime()) {
    return 1;
  }
  return false;
};

export const AG_GRID_COMPONENTS = [
  DwCellButtonEditorComponent,
  ButtonEditorFilterComponent,
  DwAgGridDateInputComponent,
  FloatingButtonEditorFilterComponent,
  DwAgGridDateEditorComponent,
  DwAgTextCellEditorComponent,
  DwAgTextColumnFilterComponent,
  DwAgTextColumnFloatingFilterComponent,
  DwAgNumberCellEditorComponent,
  DwAgSelectCellEditorComponent,
  DwAgLargeTextCellEditorComponent,
  DwAgGridValidationEditorComponent
];

export const AG_GRID_FW_COMPONENTS: any =  {
  floatingCellButtonEditor: FloatingButtonEditorFilterComponent,
  buttonEditorFilter: ButtonEditorFilterComponent,
  agDateInput: DwAgGridDateInputComponent,
  dateEditor: DwAgGridDateEditorComponent,
  dateFilterComparator: dateFilterCompare,
  cellButtonEditor: DwCellButtonEditorComponent,

  // 平台將預設的editor換成ng-zorro
  agTextCellEditor: DwAgTextCellEditorComponent,
  agNumberCellEditor: DwAgNumberCellEditorComponent,
  agSelectCellEditor: DwAgSelectCellEditorComponent,
  agLargeTextCellEditor: DwAgLargeTextCellEditorComponent,
  agDateCellEditor: DwAgGridDateEditorComponent
  // agTextColumnFilter: DwAgTextColumnFilterComponent,
  // agTextColumnFloatingFilter: DwAgTextColumnFloatingFilterComponent
};

export const enum AG_GRID_FW_COMPONENT {
  CellButtonEditor = 'cellButtonEditor',
  ButtonEditorFilter = 'buttonEditorFilter',
  FloatingButtonEditor = 'floatingCellButtonEditor'
}

export const agGridEditModuleWithComponents = AgGridModule.withComponents([
  ...AG_GRID_COMPONENTS
]);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DwToolTipModule,
    DwInputModule,
    DwInputNumberModule,
    DwFormModule,
    DwDatePickerModule,
    DwSelectModule,
    DwButtonModule,
    DwIconModule,
    TranslateModule,
    // TODO: Function calls are not supported in decorators but 'AgGridModule' was called.
    agGridEditModuleWithComponents
  ],
  declarations: [
    ...AG_GRID_COMPONENTS
  ],
  exports: [
    AgGridModule
  ]
})
export class DwAgGridEditorsModule {
  static forAgGridComponents(): ModuleWithProviders<DwAgGridEditorsModule> {
    return {
      ngModule: DwAgGridEditorsModule,
      providers: [
        ...agGridEditModuleWithComponents.providers
      ]
    };
  }
}
