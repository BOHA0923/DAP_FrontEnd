import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcaseLoginComponent } from './login.component';

describe('ShowcaseLoginComponent', () => {
  let component: ShowcaseLoginComponent;
  let fixture: ComponentFixture<ShowcaseLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowcaseLoginComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcaseLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
