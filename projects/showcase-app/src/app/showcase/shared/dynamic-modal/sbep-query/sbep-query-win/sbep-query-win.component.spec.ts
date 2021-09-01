import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbepQueryWinComponent } from './sbep-query-win.component';

describe('SbepQueryWinComponent', () => {
  let component: SbepQueryWinComponent;
  let fixture: ComponentFixture<SbepQueryWinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbepQueryWinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbepQueryWinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
