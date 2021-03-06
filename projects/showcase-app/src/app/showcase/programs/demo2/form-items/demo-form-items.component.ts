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
      title: 'Input ?????????',
      doc: InputDocumentComponent,
      examples: [
        {
          title: '????????????',
          type: InputBaseComponent,
          id: 'input-base',
          code: inputBase
        },
        {
          title: 'Form??????',
          type: InputFormComponent,
          id: 'input-form',
          code: inputForm
        },
        {
          title: '????????????',
          type: InputSizeComponent,
          id: 'input-size',
          code: inputSize
        }
      ]
    },
    {
      selector: 'dw-form-textarea',
      title: 'Textarea ?????????',
      doc: TextareaDocComponent,
      examples: [
        {
          title: '????????????',
          type: TextareaBaseComponent,
          id: 'textarea-base',
          code: textareaBase
        },
        {
          title: '???????????????',
          type: TextareaAutosizeComponentComponent,
          id: 'textarea-autosize',
          code: textareaAutosize
        }
      ]
    },
    {
      selector: 'dw-form-input-group',
      title: 'Input Group ???????????????',
      doc: InputGroupDocComponent,
      examples: [
        {
          title: '???/????????????',
          type: InputGroupBaseComponent,
          id: 'input-group-base',
          code: inputGroupBase
        }
      ]
    },
    {
      selector: 'dw-form-select',
      title: 'Select ?????????',
      doc: SelectDocComponent,
      examples: [
        {
          title: '????????????',
          type: SelectBaseComponent,
          id: 'select-base',
          code: selectBase
        },
        {
          title: '?????????',
          type: SelectSearchComponent,
          id: 'select-search',
          code: selectSearch
        },
        {
          title: '????????????',
          type: SelectTagsComponent,
          id: 'select-tags',
          code: selectTags
        }
      ]
    },
    {
      selector: 'dw-date-picker',
      title: 'DatePicker ???????????????',
      doc: DatePickerDocComponent,
      examples: [
        {
          title: '????????????',
          type: DatePickerBaseComponent,
          id: 'date-picker-base',
          code: datePickerBase
        },
        {
          title: '??????',
          type: DatePickerDisabledComponent,
          id: 'date-picker-disabled',
          code: datePickerDisabled
        },
        {
          title: '????????????',
          type: DatePickerOpenComponent,
          id: 'date-picker-open',
          code: datePickerOpen
        },
        {
          title: '??????',
          type: DatePickerFooterComponent,
          id: 'date-picker-footer',
          code: datePickerFooter
        }
      ]
    },
    {
      selector: 'dw-form-range-picker',
      title: 'RangePicker ?????????????????????',
      doc: RangePickerDocComponent,
      examples: [
        {
          title: '????????????',
          type: RangePickerBaseComponent,
          id: 'range-picker-base',
          code: rangePickerBase
        },
        {
          title: '?????????????????????',
          type: RangePickerRangeComponent,
          id: 'range-picker-range',
          code: rangePickerRange
        }
      ]
    },
    {
      selector: 'dw-time-picker',
      title: 'TimePicker ???????????????',
      doc: TimePickerDocComponent,
      examples: [
        {
          title: '????????????',
          type: TimePickerBaseComponent,
          id: 'time-picker-base',
          code: timePickerBase
        },
        {
          title: 'Form??????',
          type: TimePickerFormComponent,
          id: 'time-picker-form',
          code: timePickerForm
        },
        {
          title: '??????',
          type: TimePickerDisabledComponent,
          id: 'time-picker-disabled',
          code: timePickerDisabled
        },
        {
          title: '????????????',
          type: TimePickerDisabledTimeComponent,
          id: 'time-picker-disabled-time',
          code: timePickerDisabledTime
        }
      ]
    },
    {
      selector: 'dw-form-cascader',
      title: 'Cascader ???????????????',
      doc: CascaderDocComponent,
      examples: [
        {
          title: '????????????',
          type: CascaderBaseComponent,
          id: 'cascader-base',
          code: cascaderBase
        },
        {
          title: '????????????',
          type: CascaderLoadingComponent,
          id: 'cascader-loading',
          code: cascaderLoading
        }
      ]
    },
    {
      selector: 'dw-form-items-common-doc',
      title: '????????????',
      doc: FormItemsCommonDocComponent
    }
  ];
}
