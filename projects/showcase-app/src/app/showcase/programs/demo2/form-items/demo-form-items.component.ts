const cascaderBase = require('!raw-loader!./components/cascader/cascader-base.component.ts');
const cascaderLoading = require('!raw-loader!./components/cascader/cascader-loading.component.ts');
const datePickerBase = require('!raw-loader!./components/date-picker/date-picker-base.component.ts');
const datePickerDisabled = require('!raw-loader!./components/date-picker/date-picker-disabled.component.ts');
const datePickerFooter = require('!raw-loader!./components/date-picker/date-picker-footer.component.ts');
const datePickerOpen = require('!raw-loader!./components/date-picker/date-picker-open.component.ts');
const inputGroupBase = require('!raw-loader!./components/input-group/input-group-base.component.ts');

const inputBase = require('!raw-loader!./components/input/input-base.component.ts');
const inputForm = require('!raw-loader!./components/input/input-form.component.ts');
const inputSize = require('!raw-loader!./components/input/input-size.component.ts');
const rangePickerBase = require('!raw-loader!./components/range-picker/range-picker-base.component.ts');
const rangePickerRange = require('!raw-loader!./components/range-picker/range-picker-range.component.ts');
const selectBase = require('!raw-loader!./components/select/select-base.component.ts');
const selectSearch = require('!raw-loader!./components/select/select-search.component.ts');
const selectTags = require('!raw-loader!./components/select/select-tags.component.ts');
const textareaAutosize = require('!raw-loader!./components/textarea/textarea-autosize.component.ts');
const textareaBase = require('!raw-loader!./components/textarea/textarea-base.component.ts');
const timePickerBase = require('!raw-loader!./components/time-picker/time-picker-base.component');
const timePickerDisabledTime = require('!raw-loader!./components/time-picker/time-picker-disabled-time.component');
const timePickerDisabled = require('!raw-loader!./components/time-picker/time-picker-disabled.component');
const timePickerForm = require('!raw-loader!./components/time-picker/time-picker-form.component');
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation, OnInit } from '@angular/core';
import {
  CascaderBaseComponent,
  CascaderDocComponent,
  CascaderLoadingComponent,
  DatePickerBaseComponent,
  DatePickerDisabledComponent,
  DatePickerDocComponent,
  DatePickerFooterComponent,
  DatePickerOpenComponent,
  FormItemsCommonDocComponent,
  InputBaseComponent,
  InputDocumentComponent,
  InputFormComponent,
  InputGroupBaseComponent,
  InputGroupDocComponent,
  InputSizeComponent,
  RangePickerBaseComponent,
  RangePickerDocComponent,
  RangePickerRangeComponent,
  SelectBaseComponent,
  SelectDocComponent,
  SelectSearchComponent,
  SelectTagsComponent,
  TextareaAutosizeComponentComponent,
  TextareaBaseComponent,
  TextareaDocComponent,
  TimePickerBaseComponent,
  TimePickerDisabledComponent,
  TimePickerDisabledTimeComponent,
  TimePickerDocComponent,
  TimePickerFormComponent
} from './components';

@Component({
  selector: 'dw-form-items',
  templateUrl: './demo-form-items.component.html',
  styles: [
      `
      dw-form-items .ant-layout-header {
        background: #fff;
      }

      dw-form-items .ant-layout-sider {
        background: #fff;
      }

      dw-form-items tr.ant-table-row td:first-child {
        word-break: normal;
      }

      dw-form-items .ant-layout-sider{
        position: relative;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoFormItemsComponent {

  constructor() {}

  demoComponents = [
    {
      selector: 'dw-form-input',
      title: 'Input 輸入框',
      doc: InputDocumentComponent,
      examples: [
        {
          title: '基本使用',
          type: InputBaseComponent,
          id: 'input-base',
          code: inputBase
        },
        {
          title: 'Form表單',
          type: InputFormComponent,
          id: 'input-form',
          code: inputForm
        },
        {
          title: '三種尺寸',
          type: InputSizeComponent,
          id: 'input-size',
          code: inputSize
        }
      ]
    },
    {
      selector: 'dw-form-textarea',
      title: 'Textarea 本文域',
      doc: TextareaDocComponent,
      examples: [
        {
          title: '基本使用',
          type: TextareaBaseComponent,
          id: 'textarea-base',
          code: textareaBase
        },
        {
          title: '自定義尺寸',
          type: TextareaAutosizeComponentComponent,
          id: 'textarea-autosize',
          code: textareaAutosize
        }
      ]
    },
    {
      selector: 'dw-form-input-group',
      title: 'Input Group 輸入框組合',
      doc: InputGroupDocComponent,
      examples: [
        {
          title: '前/后置标签',
          type: InputGroupBaseComponent,
          id: 'input-group-base',
          code: inputGroupBase
        }
      ]
    },
    {
      selector: 'dw-form-select',
      title: 'Select 選擇器',
      doc: SelectDocComponent,
      examples: [
        {
          title: '基本使用',
          type: SelectBaseComponent,
          id: 'select-base',
          code: selectBase
        },
        {
          title: '搜尋框',
          type: SelectSearchComponent,
          id: 'select-search',
          code: selectSearch
        },
        {
          title: '多選標籤',
          type: SelectTagsComponent,
          id: 'select-tags',
          code: selectTags
        }
      ]
    },
    {
      selector: 'dw-date-picker',
      title: 'DatePicker 日期選擇框',
      doc: DatePickerDocComponent,
      examples: [
        {
          title: '基本使用',
          type: DatePickerBaseComponent,
          id: 'date-picker-base',
          code: datePickerBase
        },
        {
          title: '禁用',
          type: DatePickerDisabledComponent,
          id: 'date-picker-disabled',
          code: datePickerDisabled
        },
        {
          title: '開閉日曆',
          type: DatePickerOpenComponent,
          id: 'date-picker-open',
          code: datePickerOpen
        },
        {
          title: '頁腳',
          type: DatePickerFooterComponent,
          id: 'date-picker-footer',
          code: datePickerFooter
        }
      ]
    },
    {
      selector: 'dw-form-range-picker',
      title: 'RangePicker 日期範圍選擇框',
      doc: RangePickerDocComponent,
      examples: [
        {
          title: '基本使用',
          type: RangePickerBaseComponent,
          id: 'range-picker-base',
          code: rangePickerBase
        },
        {
          title: '自定義日期範圍',
          type: RangePickerRangeComponent,
          id: 'range-picker-range',
          code: rangePickerRange
        }
      ]
    },
    {
      selector: 'dw-time-picker',
      title: 'TimePicker 時間選擇框',
      doc: TimePickerDocComponent,
      examples: [
        {
          title: '基本使用',
          type: TimePickerBaseComponent,
          id: 'time-picker-base',
          code: timePickerBase
        },
        {
          title: 'Form表單',
          type: TimePickerFormComponent,
          id: 'time-picker-form',
          code: timePickerForm
        },
        {
          title: '禁用',
          type: TimePickerDisabledComponent,
          id: 'time-picker-disabled',
          code: timePickerDisabled
        },
        {
          title: '禁用時間',
          type: TimePickerDisabledTimeComponent,
          id: 'time-picker-disabled-time',
          code: timePickerDisabledTime
        }
      ]
    },
    {
      selector: 'dw-form-cascader',
      title: 'Cascader 聯級選擇框',
      doc: CascaderDocComponent,
      examples: [
        {
          title: '基本使用',
          type: CascaderBaseComponent,
          id: 'cascader-base',
          code: cascaderBase
        },
        {
          title: '動態加載',
          type: CascaderLoadingComponent,
          id: 'cascader-loading',
          code: cascaderLoading
        }
      ]
    },
    {
      selector: 'dw-form-items-common-doc',
      title: '共用屬性',
      doc: FormItemsCommonDocComponent
    }
  ];
}
