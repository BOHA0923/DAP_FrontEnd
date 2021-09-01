import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwSysMenuEditComponent } from './dw-sys-menu-edit.component';

describe('DwSysMenuEditComponent', () => {
  let component: DwSysMenuEditComponent;
  let fixture: ComponentFixture<DwSysMenuEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwSysMenuEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwSysMenuEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
