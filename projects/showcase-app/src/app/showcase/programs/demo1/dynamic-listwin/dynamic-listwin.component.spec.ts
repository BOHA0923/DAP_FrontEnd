import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicListwinComponent } from './dynamic-listwin.component';

describe('DynamicListwinComponent', () => {
  let component: DynamicListwinComponent;
  let fixture: ComponentFixture<DynamicListwinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicListwinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicListwinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
