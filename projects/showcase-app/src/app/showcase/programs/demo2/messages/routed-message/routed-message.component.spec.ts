import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcaseRoutedMessageComponent } from './routed-message.component';

describe('ShowcaseRoutedMessageComponent', () => {
  let component: ShowcaseRoutedMessageComponent;
  let fixture: ComponentFixture<ShowcaseRoutedMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowcaseRoutedMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcaseRoutedMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
