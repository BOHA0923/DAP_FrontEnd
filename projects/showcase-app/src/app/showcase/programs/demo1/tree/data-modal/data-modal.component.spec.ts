import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShowcaseDataModalComponent} from './data-modal.component';

describe('ShowcaseDataModalComponent', () => {
  let component: ShowcaseDataModalComponent;
  let fixture: ComponentFixture<ShowcaseDataModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowcaseDataModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcaseDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
