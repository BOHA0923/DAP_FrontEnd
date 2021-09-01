import {
  AfterContentInit, AfterViewInit, ContentChildren,
  Directive,
  DoCheck,
  EmbeddedViewRef,
  Input,
  isDevMode,
  IterableChangeRecord,
  IterableChanges,
  IterableDiffer,
  IterableDiffers,
  NgIterable,
  OnChanges, OnInit, Optional, QueryList,
  SimpleChanges,
  TemplateRef,
  TrackByFunction, ViewChildren,
  ViewContainerRef
} from '@angular/core';
import { DwIdDirective } from './dw-id.directive';




/* TODO: 繼承NgForOf，並加一個flag暫停createEmbbedView
*        要注意DwContainer的ngAfterViewInit要手動開啟所有的flag，最好是可以符合原本ngFor的所有用法......
*/

export class DwForOfContext<T> {
  constructor(
    public $implicit: T, public dwForOf: NgIterable<T>, public index: number,
    public count: number) { }

  get first(): boolean { return this.index === 0; }

  get last(): boolean { return this.index === this.count - 1; }

  get even(): boolean { return this.index % 2 === 0; }

  get odd(): boolean { return !this.even; }
}

class RecordViewTuple<T> {
  constructor(public record: any, public view: EmbeddedViewRef<DwForOfContext<T>>) { }
}

@Directive({ selector: '[dwFor][dwForOf]' })
export class DwForOfDirective<T> implements OnInit, DoCheck, OnChanges, AfterContentInit, AfterViewInit {
  ngOnInit(): void {
    // console.log('dw for ngOnInit');
    this._viewContainer.createEmbeddedView(this._template);
  }

  ngAfterViewInit(): void {
    // console.log('dw for ngAfterViewInit', this._viewChildren);
  }

  @ContentChildren(DwIdDirective) _contentChildren: QueryList<DwIdDirective>;
  @ViewChildren(DwIdDirective) _viewChildren: QueryList<DwIdDirective>;

  @Input() dwForOf: NgIterable<T>;

  @Input()
  set dwForTrackBy(fn: TrackByFunction<T>) {
    if (isDevMode() && fn != null && typeof fn !== 'function') {
      // TODO(vicb): use a log service once there is a public one available
      if (<any>console && <any>console.warn) {
        console.warn(
          `trackBy must be a function, but received ${JSON.stringify(fn)}. ` +
          `See https://angular.io/docs/ts/latest/api/common/index/NgFor-directive.html#!#change-propagation for more information.`);
      }
    }
    this._trackByFn = fn;
  }

  get dwForTrackBy(): TrackByFunction<T> { return this._trackByFn; }

  private _differ: IterableDiffer<T> | null = null;
  private _trackByFn: TrackByFunction<T>;

  constructor(
    private _viewContainer: ViewContainerRef, @Optional() private _template: TemplateRef<DwForOfContext<T>>,
    private _differs: IterableDiffers) { }

  @Input()
  set dwForTemplate(value: TemplateRef<DwForOfContext<T>>) {
    // TODO(TS2.1): make TemplateRef<Partial<NgForRowOf<T>>> once we move to TS v2.1
    // The current type is too restrictive; a template that just uses index, for example,
    // should be acceptable.
    if (value) {
      this._template = value;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('dwForOf' in changes) {
      // React on ngForOf changes only once all inputs have been initialized
      const value = changes['dwForOf'].currentValue;
      if (!this._differ && value) {
        try {
          this._differ = this._differs.find(value).create(this.dwForTrackBy);
        } catch (e) {
          throw new Error(
            `Cannot find a differ supporting object '${value}' of type '${getTypeNameForDebugging(value)}'. N
            gFor only supports binding to Iterables such as Arrays.`);
        }
      }
    }
  }

  ngDoCheck(): void {
    // console.log('dwFor ngDoCheck!');
    if (this._differ) {
      const changes = this._differ.diff(this.dwForOf);
      if (changes) {
        this._applyChanges(changes);
        console.log(this._viewChildren);
        console.log(this._contentChildren);
      }
    }
  }

  ngAfterContentInit(): void {
    // console.log('dw for ngAfterContentInit', this._contentChildren);
  }

  private _applyChanges(changes: IterableChanges<T>): void {
    const insertTuples: RecordViewTuple<T>[] = [];
    changes.forEachOperation(
      (item: IterableChangeRecord<any>, adjustedPreviousIndex: number, currentIndex: number) => {
        if (item.previousIndex == null) {
          const view = this._viewContainer.createEmbeddedView(
            /* tslint:disable-next-line:no-non-null-assertion */
            this._template, new DwForOfContext<T>(null!, this.dwForOf, -1, -1), currentIndex
          );
          const tuple = new RecordViewTuple<T>(item, view);
          insertTuples.push(tuple);
        } else if (currentIndex == null) {
          this._viewContainer.remove(adjustedPreviousIndex);
        } else {
          /* tslint:disable-next-line:no-non-null-assertion */
          const view = this._viewContainer.get(adjustedPreviousIndex)!;
          this._viewContainer.move(view, currentIndex);
          const tuple = new RecordViewTuple(item, <EmbeddedViewRef<DwForOfContext<T>>>view);
          insertTuples.push(tuple);
        }
      });

    for (let i = 0; i < insertTuples.length; i++) {
      this._perViewChange(insertTuples[i].view, insertTuples[i].record);
    }

    for (let i = 0, ilen = this._viewContainer.length; i < ilen; i++) {
      const viewRef = <EmbeddedViewRef<DwForOfContext<T>>>this._viewContainer.get(i);
      viewRef.context.index = i;
      viewRef.context.count = ilen;
    }

    changes.forEachIdentityChange((record: any) => {
      const viewRef =
        <EmbeddedViewRef<DwForOfContext<T>>>this._viewContainer.get(record.currentIndex);
      viewRef.context.$implicit = record.item;
    });
  }

  private _perViewChange(view: EmbeddedViewRef<DwForOfContext<T>>, record: IterableChangeRecord<any>): void {
    view.context.$implicit = record.item;
  }
}

export function getTypeNameForDebugging(type: any): string {
  return type['name'] || typeof type;
}
