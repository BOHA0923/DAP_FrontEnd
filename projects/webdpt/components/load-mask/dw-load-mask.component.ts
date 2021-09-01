import {
    Component,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
    ElementRef,
    AfterViewInit,
    HostListener,
    OnDestroy,
    Inject,
    Input
} from '@angular/core';
import { NavigationStart, Router, NavigationEnd } from '@angular/router';
import { filter, distinct } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { DW_USING_TAB } from '@webdpt/framework/config';

@Component({
    selector: 'dw-div-mask',
    templateUrl: './dw-load-mask.component.html',
    styleUrls: ['./dw-load-mask.component.css']
    // encapsulation: ViewEncapsulation.None
})
export class DwDivMaskComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('maskDiv') maskDiv: ElementRef;
    onScrollFn: EventListenerOrEventListenerObject;
    onDocClickFn: EventListenerOrEventListenerObject;
    routeSub: Subscription;
    routeSub2: Subscription;
    private _targetDiv: HTMLElement;
    private menuFlod: HTMLElement;
    private menuUnFlod: HTMLElement;
    private tabWrap: HTMLElement;
    private _resizing: boolean;
    @Input()
    set targetDiv(val: HTMLElement) {
        this._targetDiv = val;
    }
    get targetDiv(): HTMLElement {
        return this._targetDiv;
    }
    private _maskTriggers: HTMLElement[] = [];
    @Input()
    set maskTriggers(elems: HTMLElement[]) {
        this._maskTriggers = elems;
        // console.log(elems);
    }
    get maskTriggers(): HTMLElement[] {
        return this._maskTriggers;
    }
    private _showMask: boolean;
    @Input()
    set showMask(val: boolean) {
        this._showMask = val;
        this.menuFlod = this.doc.querySelector('.anticon-menu-fold');
        this.menuUnFlod = this.doc.querySelector('.anticon-menu-unfold');
        this.tabWrap = this.doc.querySelector('.ant-tabs-nav-wrap');
        if (val) {
            // if (!this._resizing) {
            setTimeout(() => {
                const maskDivNate = this.maskDiv.nativeElement;
                const targetDivNate = this.targetDiv;
                // this.maskDiv.nativeElement.style.height = 0 + 'px';
                maskDivNate.style.width = targetDivNate.offsetWidth + 'px';
                maskDivNate.style.height = targetDivNate.offsetHeight + 'px';
                maskDivNate.style.top = targetDivNate.getBoundingClientRect().top + targetDivNate.scrollTop + 'px';
                maskDivNate.style.left = targetDivNate.getBoundingClientRect().left + targetDivNate.scrollLeft + 'px';
                window.addEventListener('scroll', this.onScrollFn, true);
                // if (this.menuFlod) {
                //     this.menuFlod.addEventListener('click', this.onDocClickFn, true);
                // }
                // if (this.menuUnFlod) {
                //     this.menuUnFlod.addEventListener('click', this.onDocClickFn, true);
                // }
                if (this.tabWrap) {
                    this.tabWrap.addEventListener('click', this.onDocClickFn, true);
                }
                this._maskTriggers.forEach((elem) => {
                    elem.addEventListener('click', this.onDocClickFn, true);
                });
            }, 0);

            // }
        } else {
            window.removeEventListener('scroll', this.onScrollFn, true);
            // if (this.menuFlod) {
            //     this.menuFlod.removeEventListener('click', this.onDocClickFn, true);
            // }
            // if (this.menuUnFlod) {
            //     this.menuUnFlod.removeEventListener('click', this.onDocClickFn, true);
            // }
            if (this.tabWrap) {
                this.tabWrap.removeEventListener('click', this.onDocClickFn, true);
            }
            this._maskTriggers.forEach((elem) => {
                elem.removeEventListener('click', this.onDocClickFn, true);
            });
        }
    }
    get showMask(): boolean {
        return this._showMask;
    }
    @Input()
    customStyle: { [key: string]: string; };


    @HostListener('window:resize', ['$event'])
    onResize($event: any): void {
        if (!this._resizing) {
            // this.maskDiv.nativeElement.style.height = 0 + 'px';
            this.adjustMask(600);
        }

    }
    constructor(
        private router: Router,
        private elem: ElementRef,
        @Inject(DW_USING_TAB) private _usingTab: boolean,
        @Inject(DOCUMENT) private doc: any) {
    }

    onScroll(): void {
        // console.log('onScroll');
        if (this.showMask) {
            const maskDivNate = this.maskDiv.nativeElement;
            const targetDivNate = this.targetDiv;
            maskDivNate.style.top = targetDivNate.getBoundingClientRect().top + targetDivNate.scrollTop + 'px';
            maskDivNate.style.left = targetDivNate.getBoundingClientRect().left + targetDivNate.scrollLeft + 'px';
        }
    }
    onDocClick(): void {
        // console.log('onClick');
        if (this.showMask) {
            // if (!this._resizing) {
            this.maskDiv.nativeElement.style.height = 0 + 'px';
            this.adjustMask(500);
            // }
        }
    }
    adjustMask(delayTime: number): void {
        this._resizing = true;
        // this.maskDiv.nativeElement.style.height = 0 + 'px';
        setTimeout(() => {
            const maskDivNate = this.maskDiv.nativeElement;
            const targetDivNate = this.targetDiv;
            if (targetDivNate && this.showMask) {
                maskDivNate.style.top = targetDivNate.getBoundingClientRect().top + targetDivNate.scrollTop + 'px';
                maskDivNate.style.left = targetDivNate.getBoundingClientRect().left + targetDivNate.scrollLeft + 'px';
                maskDivNate.style.width = targetDivNate.offsetWidth + 'px';
                maskDivNate.style.height = targetDivNate.offsetHeight + 'px';
                // console.log('adjustMask:' + targetDivNate.offsetWidth);
                this._resizing = false;
            }
        }, delayTime);
    }
    ngAfterViewInit(): void { }
    ngOnDestroy(): void {
        console.log('destory');
        this.routeSub.unsubscribe();
        // window.removeEventListener('scroll', this.onScroll.bind(this), true);
        // this.doc.removeEventListener('click', this.onDocClick.bind(this), true);
    }
    ngOnInit(): void {
        // this.menuFlod = this.doc.querySelector('.anticon-menu-fold');
        this.onScrollFn = this.onScroll.bind(this);
        this.onDocClickFn = this.onDocClick.bind(this);
        this.routeSub = this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                console.log('NavigationStart');
                window.removeEventListener('scroll', this.onScrollFn, true);
                // if (this.menuFlod) {
                //     this.menuFlod.removeEventListener('click', this.onDocClickFn, true);
                // }
                // if (this.menuUnFlod) {
                //     this.menuUnFlod.removeEventListener('click', this.onDocClickFn, true);
                // }
                if (this.tabWrap) {
                    this.tabWrap.removeEventListener('click', this.onDocClickFn, true);
                }
                this._maskTriggers.forEach((elem) => {
                    elem.removeEventListener('click', this.onDocClickFn, true);
                });
                if (this.routeSub) {
                    this.routeSub.unsubscribe();
                }
            }
        });
        if (this._usingTab) {
            this.routeSub2 = this.router.events.pipe(
                filter((evt) => evt instanceof NavigationEnd),
                distinct(value => value)
            ).subscribe((event) => {
                this.showMask = this.showMask;
                if (this.routeSub2) {
                    this.routeSub2.unsubscribe();
                }
            });
        }


        // window.addEventListener('scroll', this.onScroll.bind(this), true);
        // this.doc.addEventListener('click', this.onDocClick.bind(this), true);
    }

}
