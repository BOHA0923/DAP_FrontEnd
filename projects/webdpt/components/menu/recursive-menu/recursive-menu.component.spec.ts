import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwRecursiveMenuComponent } from './recursive-menu.component';

describe('DwRecursiveMenuComponent', () => {
  let component: DwRecursiveMenuComponent;
  let fixture: ComponentFixture<DwRecursiveMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwRecursiveMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwRecursiveMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
