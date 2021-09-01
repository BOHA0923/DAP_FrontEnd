import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShowcaseTreeComponent} from './tree.component';

describe('ShowcaseTreeComponent', () => {
  let component: ShowcaseTreeComponent;
  let fixture: ComponentFixture<ShowcaseTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowcaseTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcaseTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
