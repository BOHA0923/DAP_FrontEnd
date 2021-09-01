import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcaseForgetComponent } from './forget.component';

describe('ShowcaseForgetComponent', () => {
  let component: ShowcaseForgetComponent;
  let fixture: ComponentFixture<ShowcaseForgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowcaseForgetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcaseForgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
