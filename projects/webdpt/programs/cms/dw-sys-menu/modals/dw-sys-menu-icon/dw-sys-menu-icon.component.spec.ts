import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwSysMenuIconComponent } from './dw-sys-menu-icon.component';

describe('DwSysMenuIconComponent', () => {
  let component: DwSysMenuIconComponent;
  let fixture: ComponentFixture<DwSysMenuIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwSysMenuIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwSysMenuIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
