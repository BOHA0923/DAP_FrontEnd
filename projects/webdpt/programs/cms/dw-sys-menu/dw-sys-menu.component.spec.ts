import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwSysMenuComponent } from './dw-sys-menu.component';

describe('DwSysMenuComponent', () => {
  let component: DwSysMenuComponent;
  let fixture: ComponentFixture<DwSysMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwSysMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwSysMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
