import { AfterContentInit, AfterViewInit, ContentChildren, forwardRef, OnDestroy, OnInit, QueryList } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { DwIdBase } from './dw-id-base';
import { DwComponentBase } from './dw-component-base';

export abstract class DwComponent extends DwComponentBase implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {

  custViewReady$: BehaviorSubject<Map<string, DwIdBase>> = new BehaviorSubject<Map<string, DwIdBase>>(null);
  // /**
  //  * 產品單位的單頭欄位
  //  */
  // @ViewChildren(DwIdBase) _origViewChildren: QueryList<DwIdBase>;

  /**
   * 客製作業的單頭欄位
   */
  @ContentChildren(DwIdBase) _custContentChildren: QueryList<DwIdBase>;

  private _childrenContainer: DwComponent[] = [];
  private _parentCustContents: DwIdBase[] = [];
  private _parentContainer: DwComponent;

  constructor(_pc: DwComponent) {
    super();
    this._setParent(_pc);
    // console.log(' dwComponent ctor:' + this._tempid);
  }


  private _setParent(parent: DwComponent): void {
    if (parent) {
      this._parentContainer = parent;
      parent.addChildrenContainer(this);
    }
  }

  public addChildrenContainer(child: DwComponent): void {
    this._childrenContainer.push(child);
  }

  ngAfterViewInit(): void {
    this.afterViewInit();
  }


  setParentCustContents(parentCusts: DwIdBase[]): void {
    this._parentCustContents = parentCusts;
  }

  private contentChildrenReady(): void {

    this._childrenContainer.forEach(
      (childContainer: DwComponent): void => {
        childContainer.setParentCustContents(this._custContentChildren.toArray());
      }
    );

    const custChildren: DwIdBase[] = this._parentCustContents.concat(this._custContentChildren.toArray());
    const ccMap = new Map<string, DwIdBase>(
      custChildren.map(cust => {
        const id = cust.excludeDwId;
        if (id) {
          return [id, cust] as [string, DwIdBase];
        }
      })
    );
    this.custViewReady$.next(ccMap);
  }

  ngAfterContentInit(): void {
    this.contentChildrenReady();
    this.afterContentInit();
  }

  ngOnDestroy(): void {
    // console.log('ngOnDestroy');
    this._childrenContainer = null;
    this._parentCustContents = null;
    this._parentContainer = null;
    this.custViewReady$.complete();
    this.onDestroy();
  }

  ngOnInit(): void {
    this.onInit();
  }

  abstract afterContentInit(): void;

  abstract afterViewInit(): void;

  abstract onInit(): void;

  abstract onDestroy(): void;
}

export const provideDwComponent =
  (component: any): any => {
    return { provide: DwComponent, useExisting: forwardRef(() => component) };
  };
