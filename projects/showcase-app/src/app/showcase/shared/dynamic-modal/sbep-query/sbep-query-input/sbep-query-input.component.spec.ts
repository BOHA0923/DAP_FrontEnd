import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbepQueryInputComponent } from './sbep-query-input.component';

describe('SbepQueryInputComponent', () => {
  let component: SbepQueryInputComponent;
  let fixture: ComponentFixture<SbepQueryInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbepQueryInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbepQueryInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
