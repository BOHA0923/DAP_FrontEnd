import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShowcaseEditShowcaseDataModalComponent} from './edit-data-modal.component';

describe('ShowcaseEditShowcaseDataModalComponent', () => {
  let component: ShowcaseEditShowcaseDataModalComponent;
  let fixture: ComponentFixture<ShowcaseEditShowcaseDataModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowcaseEditShowcaseDataModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcaseEditShowcaseDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
