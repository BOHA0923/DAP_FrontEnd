import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AsisListComponent} from './asis-list.component';

describe('AsisListComponent', () => {
  let component: AsisListComponent;
  let fixture: ComponentFixture<AsisListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsisListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsisListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
