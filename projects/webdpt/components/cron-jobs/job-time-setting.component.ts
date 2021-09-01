import { Component, forwardRef, Host, Input, OnInit, Optional, SkipSelf } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { Frequency, RRule, RRuleSet, rrulestr } from 'rrule';

const MONTHS = [
  {label: '1', value: 1},
  {label: '2', value: 2},
  {label: '3', value: 3},
  {label: '4', value: 4},
  {label: '5', value: 5},
  {label: '6', value: 6},
  {label: '7', value: 7},
  {label: '8', value: 8},
  {label: '9', value: 9},
  {label: '10', value: 10},
  {label: '11', value: 11},
  {label: '12', value: 12},
];

const WEEKS_OF_MONTH = [
  {label: '1st-week-of-month', value: 1},
  {label: '2nd-week-of-month', value: 2},
  {label: '3rd-week-of-month', value: 3},
  {label: '4th-week-of-month', value: 4},
  {label: 'last-week-of-month', value: -1}
];

const DAYS_OF_WEEK = [
  {label: 'MO', value: 0},
  {label: 'TU', value: 1},
  {label: 'WE', value: 2},
  {label: 'TH', value: 3},
  {label: 'FR', value: 4},
  {label: 'SA', value: 5},
  {label: 'SU', value: 6}
];

@Component({
  selector: 'dw-job-time-setting',
  templateUrl: 'job-time-setting.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DwJobTimeSettingComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DwJobTimeSettingComponent),
      multi: true
    }
  ],
  styleUrls: ['./job-time-setting.component.css']
})
export class DwJobTimeSettingComponent implements ControlValueAccessor, OnInit, Validator {
  cycleMonth: 'everyMonth' | 'customMonth' = 'everyMonth';
  cycleDays = 'everyDay';
  cycleWeek = 'everyWeek';
  cronType: 'daily' | 'cycle' = 'daily';
  time_radio = '0';
  results: Date[] = [];
  timezone: string;
  mainForm: FormGroup;
  simpleForm: FormGroup;
  dailyForm: FormGroup;
  rruleForm: FormGroup;
  type2Form: FormGroup;
  months = MONTHS;
  weeksOfMonth = WEEKS_OF_MONTH;
  daysOfWeek = DAYS_OF_WEEK;
  daysOfMonthSelect: { label: string, value: number }[];
  daysOfMonth: { label: string, value: number }[];
  hoursOfDay: number[];
  minutesOfHour: number[];
  errors: any;

  @Input() dwSize: 'large' | 'small' | 'default' = 'small';
  // @Input() dwShowTypeSwitcher: boolean = true;
  @Input() dwJobType: 'SIMPLE' | 'CYCLE' | 'RRULE' | ('SIMPLE' | 'CYCLE' | 'RRULE')[];
  @Input() dwShowRRuleResult = true;
  @Input() formControlName: string;
  @Input() formControl: FormControl;

  constructor(
    private fb: FormBuilder,
    @Optional() @Host() @SkipSelf()
    private controlContainer: ControlContainer
  ) {

    this.hoursOfDay = this.getNumberSerials(0, 23);
    this.minutesOfHour = this.getNumberSerials(0, 59);
    // this.daysOfMonth1 = this.getDaysOfMonthWithLabel(1, 10);
    // this.daysOfMonth2 = this.getDaysOfMonthWithLabel(11, 20);
    // this.daysOfMonth3 = this.getDaysOfMonthWithLabel(21, 30);
    // this.daysOfMonth4 = this.getDaysOfMonthWithLabel(31, 31, true);
    this.daysOfMonth = this.daysOfMonthSelect = [].concat(
      this.getDaysOfMonthWithLabel(1, 31, true)
    );
    this.daysOfMonthSelect = [].concat(
      this.getDaysOfMonthWithLabel(1, 31, true)
    );
    this.setTimezoneOffset(this.results[0]);

    this.simpleForm = fb.group({
      time: [null, [this]]
    });

    this.dailyForm = fb.group({
      time: this.simpleForm,
      time1_start_hour: [null, [this]],
      time1_end_hour: [null, [this]],
      time1_start_minute: [0, [this]],
      time1_end_minute: [59, [this]],
      time1_cycle_value: [null, [this]],
      time1_cycle_unit: [1, [this]], // 1:分鐘 2:小時
      time2_start_hour: [null, [this]],
      time2_end_hour: [null, [this]],
      time2_start_minute: [0, [this]],
      time2_end_minute: [59, [this]],
      time2_cycle_value: [null, [this]],
      time2_cycle_unit: [1, [this]], // 1:分鐘 2:小時
      time3_start_hour: [null, [this]],
      time3_end_hour: [null, [this]],
      time3_start_minute: [0, [this]],
      time3_end_minute: [59, [this]],
      time3_cycle_value: [null, [this]],
      time3_cycle_unit: [1, [this]], // 1:分鐘 2:小時
    });

    this.type2Form = fb.group({
      time_radio: [this.time_radio, [this]],
      daily: this.dailyForm
    });

    this.rruleForm = fb.group({
      cycleMonth: [this.cycleMonth],
      months: this.buildFormArray(this.months),
      cycleWeek: [this.cycleWeek],
      weeksOfMonth: this.buildFormArray(this.weeksOfMonth),
      daysOfWeekForWeeksOfMonth: [0],
      cycleDays: [this.cycleDays],
      interval: 1,
      daysOfWeek: this.buildFormArray(this.daysOfWeek),
      daysOfMonth: this.buildFormArray(this.daysOfMonth),
      // daysOfMonth1: [this.daysOfMonth1],
      // daysOfMonth2: [this.daysOfMonth2],
      // daysOfMonth3: [this.daysOfMonth3],
      // daysOfMonth4: [this.daysOfMonth4],
      dtStart: [null],
      until: [null],
      count: [0]
    });

    this.mainForm = fb.group({
      cronType: [this.cronType],
      type2Form: this.type2Form,
      rruleForm: this.rruleForm
    });

  }

  public hasJobType(types: ('SIMPLE' | 'CYCLE' | 'RRULE')[] | 'SIMPLE' | 'CYCLE' | 'RRULE', fullCompare: boolean = false): boolean {
    let found = false;
    let _fullCompare = fullCompare;
    if (this.dwJobType) {
      if ([].concat(this.dwJobType).sort().join(',') === 'CYCLE,RRULE,SAMPLE') {
        return true;
      }

      if (typeof (types) === 'string' && typeof (this.dwJobType) === 'string') {
        found = types === this.dwJobType;
      } else {
        if (typeof (types) === 'string' && this.dwJobType instanceof Array && !fullCompare) {
          found = this.dwJobType.indexOf(types as any) > -1;
        } else {
          // array 對上 array ，用完整比對
          _fullCompare = true;
        }
      }
      if (_fullCompare) {
        const key = [].concat(types).sort().join(',');
        const jobType = [].concat(this.dwJobType).sort().join(',');
        found = key === jobType;
      }
    } else {
      found = true;
    }
    return found;
  }

  private setCustomDayDisable(disabled: boolean): void {
    if (disabled) {
      this.rruleForm.get('interval').disable();
      this.rruleForm.get('daysOfWeek').disable();
      this.rruleForm.get('daysOfMonth').disable();
    } else {
      this.rruleForm.get('interval').enable();
      this.rruleForm.get('daysOfWeek').enable();
      this.rruleForm.get('daysOfMonth').enable();
    }
  }

  onChange = (data: any): void => { };

  onTouched = (): void => { };

  formData: any;

  writeValue(rule: any): void {
    if (rule === null) {
      return;
    }
    this.formData = Object.assign({}, rule);
    switch (rule.schedule_type) {
      case '2':
        // TODO: 解析time_radio, time, time1, time2, time3
        this.mainForm.patchValue({
          cronType: 'daily'
        });
        this.parseScheduleType2();
        break;
      default:
        // TODO: 解析rrule
        this.mainForm.patchValue({
          cronType: 'cycle'
        });
        this.parseRRule();
        break;
    }
    this.startSubscribeChanges();
  }

  setDisabledState(isDisabled: boolean): void {

  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setTimezoneOffset(reference: Date): void {
    const now = reference ? reference : new Date();
    const timezone = now.getTimezoneOffset();
    if (timezone <= 0) {
      this.timezone = 'GMT+' + (timezone / -60);
    } else {
      this.timezone = 'GMT-' + (timezone / 60);
    }
  }

  private getNumberSerials(start: number, end: number): number[] {
    const hours = [];
    for (let i = start, j = 0; i <= end; i++ , j++) {
      hours[j] = i;
    }
    return hours;
  }

  private getDaysOfMonthWithLabel(start: number, end: number, withLastDayOfMonth: boolean = false): { label: string, value: number }[] {
    const days = [];
    for (let i = start, j = 0; i <= end; i++ , j++) {
      days[j] = {label: i, value: i};
    }
    if (withLastDayOfMonth) {
      days[days.length] = {label: 'last-day-of-month', value: 'L'};
    }
    return days;
  }

  registerOnValidatorChange(fn: () => void): void { }

  validate(control: AbstractControl): ValidationErrors | null {
    // 底下的有問題，會造成container form 的invalid不正確
    // if (this.formData && this.dailyForm && this.dailyForm.dirty) {
    //   let controlName;
    //   for (const key in this.dailyForm.controls) {
    //     if (this.dailyForm.controls[key] === control) {
    //       controlName = key;
    //       break;
    //     }
    //   }
    //   if (controlName) {
    //     return this.validateDailyForm(controlName);
    //   }
    // }
    // if (this.dailyForm && this.dailyForm.dirty) {
    //   this.setParentFormErrors(this.errors);
    // }
    // return this.errors;

    if (this.simpleForm && this.dailyForm && this.type2Form) {
      if (this.type2Form.dirty && Object.values(this.type2Form.controls).indexOf(control) > -1) {
        switch (control.value) {
          case '0':
            this.clearFormErrors(this.dailyForm);
            break;
          case '1':
            this.clearFormErrors(this.simpleForm);
            break;
        }
        return this.validateDailyForm('time_radio');
      } else if (this.simpleForm.dirty && Object.values(this.simpleForm.controls).indexOf(control) > -1) {
        this.validateDailyForm('time');
        control.setErrors(this.errors);
        return this.errors;
      } else if (this.dailyForm.dirty && Object.values(this.dailyForm.controls).indexOf(control) > -1) {
        for (const controlKey in this.dailyForm.controls) {
          if (this.dailyForm.controls.hasOwnProperty(controlKey)) {
            if (this.dailyForm.get(controlKey) === control) {
              this.validateDailyForm(controlKey);
              control.setErrors(this.errors);
              return this.errors;
            }
          }
        }
      }

    }
    return null;
  }

  private buildDaysOfWeek(): FormArray {
    const arr = this.daysOfWeek.map(day => {
      return this.fb.control(day.value.toString());
    });
    return this.fb.array(arr);
  }

  // 類型2	只支援時、分
  // time_radio	0：指定執行時間 1：指定週期時段	最後一位：1: 分鐘 2:小時
  // 0	time	11,30,00
  // 1	time1	17,00,00,17,59,00,5,1  17:00:00 ~ 17:59:59 每5分鐘執行1次
  // time2	17,00,00,19,00,00,1,2  17:00:00 ~ 17:59:59 每1小時執行1次
  // time3	17,10,00,19,30,00,5,1  17:00:00 ~ 19:00:00 在10 ~30分內每5分鐘執行1次
  private convertDailyToFormData(): void {
    switch (this.type2Form.get('time_radio').value) {
      case '0':
        this.convertToOnce();
        break;
      case '1':
        this.convertToSlot();
        break;
    }
    this.onChange(Object.assign(this.formData, {
      schedule_type: 2
    }));
  }

  private convertToOnce(): void {

    const data = {
      time_radio: 0,
      time: null
    };
    const time: Date = this.simpleForm.get('time').value;
    if (time) {
      const hour = time.getHours();
      const minutes = time.getMinutes();
      const seconds = time.getSeconds();
      data.time = `${hour},${minutes},${seconds}`;
    }

    if (this.dailyForm.valid) {
      this.onChange(Object.assign(this.formData, data));
    }

  }

  private convertToSlot(): void {
    const formData = {
      time_radio: '1',
      time: null,
      time1_start_hour: null,
      time1_end_hour: null,
      time2_start_hour: null,
      time2_end_hour: null,
      time3_start_hour: null,
      time3_end_hour: null,
      time1_start_minute: 0,
      time1_end_minute: 59,
      time2_start_minute: 0,
      time2_end_minute: 59,
      time3_start_minute: 0,
      time3_end_minute: 59,
      time1_cycle_value: null,
      time2_cycle_value: null,
      time3_cycle_value: null,
      time1_cycle_unit: '1',
      time2_cycle_unit: '1',
      time3_cycle_unit: '1'
    };

    formData.time_radio = this.type2Form.get('time_radio').value;
    formData.time1_start_hour = this.dailyForm.get('time1_start_hour').value;
    formData.time1_end_hour = this.dailyForm.get('time1_end_hour').value;
    formData.time2_start_hour = this.dailyForm.get('time2_start_hour').value;
    formData.time2_end_hour = this.dailyForm.get('time2_end_hour').value;
    formData.time3_start_hour = this.dailyForm.get('time3_start_hour').value;
    formData.time3_end_hour = this.dailyForm.get('time3_end_hour').value;
    formData.time1_start_minute = this.dailyForm.get('time1_start_minute').value;
    formData.time1_end_minute = this.dailyForm.get('time1_end_minute').value;
    formData.time2_start_minute = this.dailyForm.get('time2_start_minute').value;
    formData.time2_end_minute = this.dailyForm.get('time2_end_minute').value;
    formData.time3_start_minute = this.dailyForm.get('time3_start_minute').value;
    formData.time3_end_minute = this.dailyForm.get('time3_end_minute').value;
    formData.time1_cycle_value = this.dailyForm.get('time1_cycle_value').value;
    formData.time2_cycle_value = this.dailyForm.get('time2_cycle_value').value;
    formData.time3_cycle_value = this.dailyForm.get('time3_cycle_value').value;
    formData.time1_cycle_unit = this.dailyForm.get('time1_cycle_unit').value || '1';
    formData.time2_cycle_unit = this.dailyForm.get('time2_cycle_unit').value || '1';
    formData.time3_cycle_unit = this.dailyForm.get('time3_cycle_unit').value || '1';

    const data = {
      time_radio: formData.time_radio,
      time1: null,
      time2: null,
      time3: null
    };
    if (formData.time1_start_hour) {
      data.time1 = `${formData.time1_start_hour || 0},${formData.time1_start_minute || 0},${formData.time1_start_minute || 0},`;
      data.time1 += `${formData.time1_end_hour || 0},${formData.time1_end_minute || 0},${formData.time1_end_minute || 0},`;
      data.time1 += `${formData.time1_cycle_value},${formData.time1_cycle_unit}`;
    }

    if (formData.time2_start_hour) {
      data.time2 = `${formData.time2_start_hour || 0},${formData.time2_start_minute || 0},${formData.time2_start_minute || 0},`;
      data.time2 += `${formData.time2_end_hour || 0},${formData.time2_end_minute || 0},${formData.time2_end_minute || 0},`;
      data.time2 += `${formData.time2_cycle_value},${formData.time2_cycle_unit}`;
    }

    if (formData.time3_start_hour) {
      data.time3 = `${formData.time3_start_hour || 0},${formData.time3_start_minute || 0},${formData.time3_start_minute || 0},`;
      data.time3 += `${formData.time3_end_hour || 0},${formData.time3_end_minute || 0},${formData.time3_end_minute || 0},`;
      data.time3 += `${formData.time3_cycle_value},${formData.time3_cycle_unit}`;
    }

    this.onChange(Object.assign(this.formData, data));
  }

  ngOnInit(): void {}

  isSubscribeChanges = false;

  startSubscribeChanges(): void {
    if (this.isSubscribeChanges) {
      return;
    }
    this.isSubscribeChanges = true;
    this.rruleForm.valueChanges.subscribe(() => {
      this.convertCycleToFormData();
    });

    this.mainForm.get('cronType').valueChanges.subscribe(change => {
      switch (change) {
        case 'daily':
          this.type2Form.get('time_radio').updateValueAndValidity();
          break;

        case 'cycle':
          this.clearFormErrors(this.dailyForm);
          this.clearFormErrors(this.simpleForm);
          this.clearFormErrors(this.type2Form);
          this.rruleForm.get('cycleWeek').updateValueAndValidity();
          this.convertCycleToFormData();
          break;

      }
    });

    if (!this.formControlName && !this.formControl) {
      this.type2Form.get('time_radio').valueChanges.subscribe(change => {
        if (this.type2Form.dirty) {
          switch (change) {
            case '0':
              this.convertToOnce();
              break;
            case '1':
              this.convertToSlot();
              break;
          }
        }
      });
      this.simpleForm.valueChanges.subscribe(change => {
        if (this.simpleForm.dirty) {
          this.convertDailyToFormData();
        }

      });
      this.dailyForm.valueChanges.subscribe(change => {
        if (this.dailyForm.dirty) {
          this.convertToSlot();
        }

      });
    }
  }

  private convertCycleToFormData(): void {
    if (!this.formData) {
      return;
    }
    const cycleDaysControl: AbstractControl = this.rruleForm.get('cycleDays');
    const cycleWeekControl: AbstractControl = this.rruleForm.get('cycleWeek');
    const daysOfMonth: any[] = this.rruleForm.get('daysOfMonth').value;
    const weeksOfMonth: any[] = this.rruleForm.get('weeksOfMonth').value;
    const daysOfWeekForWeeksOfMonth = this.rruleForm.get('daysOfWeekForWeeksOfMonth').value;
    const rruleSet = new RRuleSet();
    const freq: Frequency = Frequency.MONTHLY.valueOf(); // valueOf()是避免options初始化把freq資料型態轉成"Frequency.MONTHLY"
    const options = {
      freq: freq
    };

    if (cycleDaysControl.value === 'everyDay') {
      options['freq'] = Frequency.DAILY;
    }

    // 每月, 月別
    const cycleMonth = this.rruleForm.get('cycleMonth').value;
    if (cycleMonth === 'customMonth') {
      const bymonth: number[] = [];
      const months: any[] = this.rruleForm.get('months').value;
      months.forEach((value, index) => {
        if (value) {
          bymonth.push(index + 1);
        }
      });
      options['bymonth'] = bymonth;
    }

    // 第x週的星期y
    // let hasCustomDays = false;
    // for (let i = 0; i < daysOfMonth.length; i++) {
    //   if (daysOfMonth[i]) {
    //     hasCustomDays = true;
    //     break;
    //   }
    // }
    if (cycleWeekControl.value === 'customWeek') {
      const bysetpos: number[] = [];
      weeksOfMonth.forEach((value, index) => {
        if (value) {
          if (index === 4) {
            bysetpos.push(-1);
          } else {
            bysetpos.push(index + 1);
          }
        }
      });
      options['byweekday'] = [daysOfWeekForWeeksOfMonth];
      options['bysetpos'] = bysetpos;
      options.freq = Frequency.MONTHLY;
    }

    // 指定天數
    // 這裡要確認每個狀態是不是disabled的，不然會殘留disabled之後的值，造成不準確
    if (cycleDaysControl.value === 'customDay' && cycleWeekControl.value === 'everyWeek') {

      // 每幾天
      const interval = this.rruleForm.get('interval').value;
      if (interval > 1) {
        options['freq'] = Frequency.DAILY;
        options['interval'] = interval;
        options['bysetpos'] = null;
      }

      // 自選的每月幾日
      const bymonthday: number[] = [];
      daysOfMonth.forEach((value, index) => {
        if (value) {
          if (index === 31) {
            bymonthday.push(-1);
          } else {
            bymonthday.push(index + 1);
          }
        }
      });
      options['bymonthday'] = bymonthday;

      // 星期幾
      const daysOfWeek: any[] = this.rruleForm.get('daysOfWeek').value;
      const byweekday: number[] = [];
      daysOfWeek.forEach((value, index) => {
        if (value) {
          byweekday.push(index);
        }
      });
      if (byweekday.length > 0) {
        options['byweekday'] = byweekday;
      }
    }

    const dtstart: Date = this.rruleForm.get('dtStart').value;
    if (dtstart) {
      options['dtstart'] = dtstart;
    }

    const until: Date = this.rruleForm.get('until').value;
    if (until) {
      options['until'] = until;
    }

    let rrule: RRule;
    let mockOptions: any = {};
    const count: number = this.rruleForm.get('count').value;
    if (count) {
      options['count'] = count;
      mockOptions = Object.assign(mockOptions, options);
    } else {
      mockOptions = Object.assign(mockOptions, options, {count: 30});
    }
    try {
      rrule = new RRule(options);
      this.updateRRuleSet(mockOptions);
    } catch (e) { }
    this.onChange(Object.assign(this.formData, {
      schedule_type: 4,
      rrule: rrule.toString()
    }));
  }

  private updateRRuleSet(options: any): void {
    if (options instanceof RRule) {
      this.results = options.all();
      return;
    }
    const mockRRule = new RRule(options);
    this.results = mockRRule.all();
  }

  /**
   * 解析time_radio, time, time1, time2, time3
   */
  private parseScheduleType2(): void {
    const timeRadio = this.formData.time_radio;
    const timeString = this.formData.time || '00,00,00';
    const time1String: string = this.formData.time1;
    const time2String: string = this.formData.time2;
    const time3String: string = this.formData.time3;
    if (timeString) {
      const now = new Date();
      const time = timeString.split(',');
      now.setHours(parseInt(time[0], 10));
      now.setMinutes(parseInt(time[1], 10));
      now.setSeconds(parseInt(time[2], 10));
      this.patchSimpleValues({
        time: now
      });
    }
    this.patchType2Values({
      time_radio: timeRadio
    });
    const data = {
      time1_start_hour: null,
      time1_end_hour: null,
      time1_cycle_unit: null,
      time1_cycle_value: null,
      time2_start_hour: null,
      time2_end_hour: null,
      time2_cycle_unit: null,
      time2_cycle_value: null,
      time3_start_hour: null,
      time3_end_hour: null,
      time3_cycle_unit: null,
      time3_cycle_value: null,
      time_radio: '1'
    };
    if (time1String) {
      // 17,00,00,17,59,00,5,1
      const time1 = time1String.split(',');
      data.time1_start_hour = parseInt(time1[0], 10);
      data.time1_end_hour = parseInt(time1[3], 10);
      data.time1_cycle_unit = time1[7];
      data.time1_cycle_value = parseInt(time1[6], 10);
      this.patchDailyValues(data);
    }
    if (time2String) {
      // 17,00,00,17,59,00,5,1
      const time2 = time2String.split(',');
      data.time2_start_hour = parseInt(time2[0], 10);
      data.time2_end_hour = parseInt(time2[3], 10);
      data.time2_cycle_unit = time2[7];
      data.time2_cycle_value = parseInt(time2[6], 10);
      this.patchDailyValues(data);
    }
    if (time3String) {
      // 17,00,00,17,59,00,5,1
      const time3 = time3String.split(',');
      data.time3_start_hour = parseInt(time3[0], 10);
      data.time3_end_hour = parseInt(time3[3], 10);
      data.time3_cycle_unit = time3[7];
      data.time3_cycle_value = parseInt(time3[6], 10);
      this.patchDailyValues(data);
    }

  }

  private patchDailyValues(data: any): void {
    this.dailyForm.patchValue(data);
  }

  private patchSimpleValues(data: any): void {
    this.simpleForm.patchValue(data);
  }

  private patchType2Values(data: any): void {
    this.type2Form.patchValue(data);
  }

  private patchCycleValues(data: any): void {
    this.rruleForm.patchValue(data);
    if (data.daysOfMonth) {
      // TODO: daysOfMonth[31] = true，代表最後一天，BYMONTHDAY=-1
      this.rruleForm.get('daysOfMonth').patchValue(data.daysOfMonth);
    }
    if (data.months) {
      this.rruleForm.get('months').patchValue(data.months);
    }
    if (data.weeksOfMonth) {
      // TODO: weeksOfMonth[4]=true時，等於是最後一週(7天)， 如果加上byweekday表示最後一週的星期幾
      this.rruleForm.get('weeksOfMonth').patchValue(data.weeksOfMonth);
    }
  }

  private buildFormArray(data: { label: string; value: number }[]): FormArray {
    const controls: FormControl[] = [];
    data.forEach((day, index) => {
      controls.push(new FormControl(false));
    });
    return this.fb.array(controls);
  }

  private parseRRule(): void {
    // this.results = rrulestr('RRULE:FREQ=WEEKLY;COUNT=30;INTERVAL=1;WKST=SU;BYDAY=FR,SU;BYMONTHDAY=1,2', {forceset: true}).all();
    const data = {
      cycleMonth: '',
      cycleDays: 'everyDay',
      daysOfMonth: new Array(32),
      months: new Array(12),
      weeksOfMonth: new Array(5),
      dtStart: null,
      until: null,
      count: null,
      daysOfWeekForWeeksOfMonth: 0,
      cycleWeek: 'everyWeek',
      daysOfWeek: new Array(7),
      interval: 1
    };
    let rrule: RRule | RRuleSet;
    if (this.formData.rrule) {
      rrule = rrulestr(this.formData.rrule);
    } else {
      rrule = new RRule();
    }
    const byMonth = rrule.options.bymonth || [];
    const bynMonth = rrule.options.bynmonthday || [];
    const byMonthDay = rrule.options.bymonthday || [];
    const bynMonthDay = rrule.options.bynmonthday || [];
    const byWeekDay = rrule.options.byweekday || [];
    const bySetPos = rrule.options.bysetpos || [];
    const dtStart = rrule.options.dtstart;
    const until = rrule.options.until;
    const count = rrule.options.count;
    const interval = rrule.options.interval;
    const freq = rrule.options.freq;

    data.interval = interval;
    data.cycleMonth = byMonth.length === 0 ? 'everyMonth' : 'customMonth';
    data.count = count;
    data.dtStart = dtStart;
    data.until = until;

    byMonth.concat(bynMonth).forEach((day) => {
      data.months[day - 1] = true;
    });

    byMonthDay.concat(bynMonthDay).forEach((day) => {
      if (day === -1) {
        data.daysOfMonth[31] = true;
      } else if (day > 0) {
        data.daysOfMonth[day - 1] = true;
      }
    });

    if (byMonthDay.length > 0 || byWeekDay.length > 0) {
      data.cycleDays = 'customDay';
    }

    // 第x週的星期y
    if (bySetPos.length > 0 && byWeekDay.length === 1 && byMonth.length === 0 && bynMonthDay.length === 0 && freq === Frequency.MONTHLY) {
      bySetPos.forEach(index => {
        if (index === -1) {
          data.weeksOfMonth[4] = true;
        } else {
          data.weeksOfMonth[index - 1] = true;
        }
      });
      byWeekDay.forEach(day => {
        data.daysOfWeekForWeeksOfMonth = day;
      });
      data.cycleWeek = 'customWeek';
      this.setCustomDayDisable(true);
    } else {
      if (byMonthDay.length > 0 || byWeekDay.length > 0) {
        data.cycleDays = 'customDay';
        byWeekDay.forEach(day => {
          data.daysOfWeek[day] = true;
        });
      }
      this.setCustomDayDisable(byMonthDay.length === 0);
    }
    this.updateRRuleSet(rrule);
    this.patchCycleValues(data);
  }

  private validateDailyForm(controlName: string): any {
    if (!controlName) {
      return this.errors;
    }
    let index = -1;
    const data = {
      schedule_type: 2,
      time_radio: '1',
      time: null,
      time1_start_hour: null,
      time1_end_hour: null,
      time2_start_hour: null,
      time2_end_hour: null,
      time3_start_hour: null,
      time3_end_hour: null,
      time1_start_minute: null,
      time1_end_minute: null,
      time2_start_minute: null,
      time2_end_minute: null,
      time3_start_minute: null,
      time3_end_minute: null,
      time1_cycle_value: null,
      time2_cycle_value: null,
      time3_cycle_value: null,
      time1_cycle_unit: '1',
      time2_cycle_unit: '1',
      time3_cycle_unit: '1'
    };
    data.time_radio = this.type2Form.get('time_radio').value;
    this.errors = null;

    if (controlName.startsWith('time')) {

      data.time = this.simpleForm.get('time').value;
      this.clearFormErrors(this.dailyForm);
      this.clearFormErrors(this.simpleForm);
      this.clearFormErrors(this.type2Form);
      if (data.time_radio === '0') {
        if (!data.time) {
          this.errors = Object.assign({
            time_required: true
          }, this.errors);
        }

      } else if (data.time_radio === '1') {
        index = parseInt(controlName[4], 10);
        // if (index === 1 || isNaN(index)) {
        if (true) {
          data.time1_start_hour = this.dailyForm.get('time1_start_hour').value;
          data.time1_end_hour = this.dailyForm.get('time1_end_hour').value;
          data.time1_start_minute = this.dailyForm.get('time1_start_minute').value;
          data.time1_end_minute = this.dailyForm.get('time1_end_minute').value;
          data.time1_cycle_value = this.dailyForm.get('time1_cycle_value').value;
          if (!this.isNullOrEmpty(data.time1_start_hour) ||
            !this.isNullOrEmpty(data.time1_end_hour) ||
            // !this.isNullOrEmpty(data.time1_start_minute) ||
            // !this.isNullOrEmpty(data.time1_end_minute) ||
            !this.isNullOrEmpty(data.time1_cycle_value)) {
            if (
              this.isNullOrEmpty(data.time1_start_hour) ||
              this.isNullOrEmpty(data.time1_end_hour) ||
              // this.isNullOrEmpty(data.time1_start_minute) ||
              // this.isNullOrEmpty(data.time1_end_minute) ||
              this.isNullOrEmpty(data.time1_cycle_value)
            ) {
              this.errors = Object.assign({
                time1_required: true
              }, this.errors);
            }
          }
        }
        // if (index === 2 || isNaN(index)) {
        if (true) {
          data.time2_start_hour = this.dailyForm.get('time2_start_hour').value;
          data.time2_end_hour = this.dailyForm.get('time2_end_hour').value;
          data.time2_start_minute = this.dailyForm.get('time2_start_minute').value;
          data.time2_end_minute = this.dailyForm.get('time2_end_minute').value;
          data.time2_cycle_value = this.dailyForm.get('time2_cycle_value').value;
          if (!this.isNullOrEmpty(data.time2_start_hour) ||
            !this.isNullOrEmpty(data.time2_end_hour) ||
            // !this.isNullOrEmpty(data.time2_start_minute) ||
            // !this.isNullOrEmpty(data.time2_end_minute) ||
            !this.isNullOrEmpty(data.time2_cycle_value)) {
            if (
              this.isNullOrEmpty(data.time2_start_hour) ||
              this.isNullOrEmpty(data.time2_end_hour) ||
              // this.isNullOrEmpty(data.time2_start_minute) ||
              // this.isNullOrEmpty(data.time2_end_minute) ||
              this.isNullOrEmpty(data.time2_cycle_value)
            ) {
              this.errors = Object.assign({
                time2_required: true
              }, this.errors);
            }
          }
        }
        // if (index === 3 || isNaN(index)) {
        if (true) {
          data.time3_start_hour = this.dailyForm.get('time3_start_hour').value;
          data.time3_end_hour = this.dailyForm.get('time3_end_hour').value;
          data.time3_start_minute = this.dailyForm.get('time3_start_minute').value;
          data.time3_end_minute = this.dailyForm.get('time3_end_minute').value;
          data.time3_cycle_value = this.dailyForm.get('time3_cycle_value').value;
          if (!this.isNullOrEmpty(data.time3_start_hour) ||
            !this.isNullOrEmpty(data.time3_end_hour) ||
            // !this.isNullOrEmpty(data.time3_start_minute) ||
            // !this.isNullOrEmpty(data.time3_end_minute) ||
            !this.isNullOrEmpty(data.time3_cycle_value)) {
            if (
              this.isNullOrEmpty(data.time3_start_hour) ||
              this.isNullOrEmpty(data.time3_end_hour) ||
              // this.isNullOrEmpty(data.time3_start_minute) ||
              // this.isNullOrEmpty(data.time3_end_minute) ||
              this.isNullOrEmpty(data.time3_cycle_value)
            ) {
              this.errors = Object.assign({
                time3_required: true
              }, this.errors);
            }
          }
        }

      }
    }
    this.setParentFormErrors(this.errors);
    return this.errors;
  }

  private setParentFormErrors(errors: any): void {
    if (this.controlContainer && this.controlContainer.control) {
      let controlName = this.formControlName;
      if (this.formControl && this.formControl.parent) {
        for (const controlsKey in this.formControl.parent.controls) {
          if (this.formControl.parent.controls.hasOwnProperty(controlsKey)) {
            if (this.formControl.parent.get(controlsKey) === this.formControl) {
              controlName = controlsKey;
              break;
            }
          }
        }
      }
      let containerErrors = this.controlContainer.control.errors;
      if (containerErrors) {
        delete containerErrors[controlName];
      }
      if (errors) {
        containerErrors = Object.assign({}, containerErrors);
        containerErrors[controlName] = errors;
      }
      if (containerErrors && Object.values(containerErrors).length === 0) {
        containerErrors = null;
      }
      this.controlContainer.control.setErrors(containerErrors);
    }
  }

  private isNullOrEmpty(value: any): boolean {
    return value === false || value === null || value === undefined || value === '';
  }

  private clearFormErrors(form: FormGroup): void {
    for (const key in form.controls) {
      if (form.controls.hasOwnProperty(key)) {
        form.controls[key].setErrors(null);
      }
    }
  }
}
