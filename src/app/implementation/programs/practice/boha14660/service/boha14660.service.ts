import { Observable } from 'rxjs';
import { PracticeBoha14660Repository } from '../../repository/practice-boha14660-repository';
import { Inject, Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';
import fnsFormat from 'date-fns/format';
import { APP_DATE_FORMAT } from '@webdpt/framework/config';

@Injectable({
  providedIn: 'root'
})
export class Boha14660Service {

  constructor(
    private practiceBoha14660Repository: PracticeBoha14660Repository,
    @Inject(APP_DATE_FORMAT) private dwDateFormat: string) {
  }
  /**
   * 查询单头
   * @param pageIndex
   * @param pageSize
   */
   public getList(): Observable<any> {
    return this.practiceBoha14660Repository.getHeaderList();

  }
}
