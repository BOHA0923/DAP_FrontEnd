import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AsisAddComponent} from './asis-add.component';

describe('AsisAddComponent', () => {
  let component: AsisAddComponent;
  let fixture: ComponentFixture<AsisAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsisAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsisAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
