import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BohaEditComponent } from './boha-edit.component';

describe('BohaEditComponent', () => {
  let component: BohaEditComponent;
  let fixture: ComponentFixture<BohaEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BohaEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BohaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
