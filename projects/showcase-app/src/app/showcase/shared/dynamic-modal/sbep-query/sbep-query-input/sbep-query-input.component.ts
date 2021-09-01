import { Component, OnInit, Input, forwardRef, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { map } from 'rxjs/operators';

import { SbepQueryModalService } from '../service/sbep-query-modal.service';
import { SbepQueryServerPagingService } from '../data-source/sbep-query-server-paging.service';

@Component({
  selector: 'app-sbep-query-input',
  templateUrl: './sbep-query-input.component.html',
  styleUrls: ['./sbep-query-input.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SbepQueryInputComponent),
      multi: true
    }
  ]
})


export class SbepQueryInputComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  private _config: any;
  public selected: Array<any> = []; // ngModel[預選值/選取值], array<String>.
  public selectedAllValue: Array<any> = []; // ngModel[預選值/選取值], array<String>.

  @Input() resourceUrl: string;
  @Input() title: string;
  @Input() width: string;
  @Input() multiSelect: string;
  @Input() selectWindowId: string;
  @Input() formControlName: string;

  @Output() selectedValue = new EventEmitter();


  constructor(
    private sbepQueryModalService: SbepQueryModalService,
    private http: HttpClient
  ) {
  }


  ngOnInit(): void {
    this._config = {
      title: this.title,
      width: this.width,
      multiSelect: JSON.parse(this.multiSelect),
      dataSource: new SbepQueryServerPagingService(
        this.http,
        this.resourceUrl,
        this.selectWindowId
      )
    };
  }


  /**
   * 需要等待同步的時間, 在 writeValue 初始化時, onTouched() 還沒有綁進來.
   * 會偶發 ExpressionChangedAfterItHasBeenCheckedError 錯誤, 所以需使用 setTimeout.
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.notifyValueChange();
    });
  }

  /**
   * 當 ngModel 為 object 陣列時需要用這判斷是否為已選取
   *
   * returns {boolean}
   */
  public compareWith(o1: any, o2: any): boolean {
    return (o1 && o2) ? (o1.id === o2.id) : (JSON.stringify(o1) === JSON.stringify(o2));
  }

  /**
   * 當取消選取時, 也要把 this.selected 的對應選項移除.
   * param {*} $event: 刪除後. 還存在的 [dwValue] 的陣列值.
   */
  public ngModelChange($event: any): void {
    // 當 $event 為 [] 時, 表示最後一個選項也被刪除了, 要直接清空 this.selected.
    if ($event.length === 0) {
      this.selected = [];
      this.selectedAllValue = [];
      this.notifyValueChange();
      return;
    }

    // 把未刪除已選取的選單重新指定給 this.selected.
    this.selected = $event;

    // 比對 EventEmitter 的值, 將不存在 this.selected 的選項刪除.
    const delIdx = []; // 準備刪除的 index.
    this.selectedAllValue.forEach((ele, idx) => {
      let id = null;
      if (ele.hasOwnProperty('id')) {
        id = ele.id;
      }
      if (ele.hasOwnProperty('dwId')) {
        id = ele.dwId;
      }

      const ret = $event.filter(value => {
        return (value.id === id);
      });

      if (ret.length === 0) {
        delIdx.push(idx);
      }
    });

    if (delIdx.length > 0) {
      delIdx.forEach(idx => {
        this.selectedAllValue.splice(idx, 1); // 有對應到, 則取出, 刪除.
      });
    }

    this.notifyValueChange();
  }

  /**
   * 開窗.
   *
   */
  public openWin(): void {
    this.sbepQueryModalService.open(this._config, this.selected).pipe(
      map(param => {
        // todo: 預留擴充.
        return param;
      })
    ).subscribe(
      (ret: any) => {
        this.selected = [];  // 因為是使用push, 需要先清空.
        this.selectedAllValue = ret;
        ret.forEach(ele => {
          // 因為在開窗裡, 選取後, 明確回傳 id, name.
          this.selected.push({
            id: ele.dwId,
            name: ele.dwName
          });

        });

        this.notifyValueChange();
      });

  }


  // ==== implements ControlValueAccessor 後 , 必需實作的 method.

  // 初始化時, 從元件設定的 ngModel 帶進入的值, 每一次作業的formControl的值改變, 這裡都會執行, 所以要先清空舊值.
  public writeValue(obj: Array<any>): void {
    this.selected = [];
    this.selectedAllValue = [];
    if (obj === null) {
      return;
    }

    // 如果是單選時, 只取一個值.
    if (JSON.parse(this.multiSelect) === false) {
      obj.splice(1, (obj.length - 1));
    }

    obj.forEach(ele => {
      let items = {};
      if (ele.hasOwnProperty('id') && ele.hasOwnProperty('name')) {
        items = {
          id: ele.id,
          name: ele.name
        };
      } else {
        items = {
          id: ele,
          name: ele
        };
      }
      this.selected.push(items);
      this.selectedAllValue.push(items);
    });

  }

  /**
   * 值改變時, 把值寫回.
   *
   */
  public notifyValueChange(): void {
    if (this.onChange) {
      this.onChange(this.selected);
    }

    // todo: dwId, dwName 不確定是否該移除, 先留著, 讓 validateForm.controls 取到的值, 直接對應.
    const selectedAllValue = JSON.parse(JSON.stringify(this.selectedAllValue));
    // selectedAllValue.forEach(ele => {
    //   if (ele.hasOwnProperty('dwId')) {
    //     delete ele.dwId;
    //   }
    //   if (ele.hasOwnProperty('dwName')) {
    //     delete ele.dwName;
    //   }
    // });

    const emitValue = {};
    emitValue[this.formControlName] = selectedAllValue;

    this.selectedValue.emit(emitValue);
  }


  // 值改變時, 把值寫回.
  public onChange: (value: Array<any>) => {}; // 宣告-初始化, 準備被覆寫.
  public onTouched: () => {};  // 宣告-初始化, 準備被覆寫.

  public registerOnChange(fn: any): void {
    this.onChange = fn; // 會覆寫上方的 public onChange().
  }
  public registerOnTouched(fn: any): void {
    this.onTouched = fn; // 會覆寫上方的 public onTouched().
  }

}
