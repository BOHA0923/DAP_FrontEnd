import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AsisComponent} from './asis.component';

describe('AsisComponent', () => {
  let component: AsisComponent;
  let fixture: ComponentFixture<AsisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
