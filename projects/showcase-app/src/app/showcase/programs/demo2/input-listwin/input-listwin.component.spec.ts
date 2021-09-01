import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputListwinComponent } from './input-listwin.component';

describe('InputListwinComponent', () => {
  let component: InputListwinComponent;
  let fixture: ComponentFixture<InputListwinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputListwinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputListwinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
