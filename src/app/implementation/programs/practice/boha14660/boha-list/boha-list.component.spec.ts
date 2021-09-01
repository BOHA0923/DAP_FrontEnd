import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BohaListComponent } from './boha-list.component';

describe('BohaListComponent', () => {
  let component: BohaListComponent;
  let fixture: ComponentFixture<BohaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BohaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BohaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
