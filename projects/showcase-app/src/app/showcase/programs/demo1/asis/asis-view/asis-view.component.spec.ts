import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AsisViewComponent} from './asis-view.component';

describe('AsisViewComponent', () => {
  let component: AsisViewComponent;
  let fixture: ComponentFixture<AsisViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsisViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsisViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
