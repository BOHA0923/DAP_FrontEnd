import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Boha14660Component } from './boha14660.component';

describe('Boha14660Component', () => {
  let component: Boha14660Component;
  let fixture: ComponentFixture<Boha14660Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Boha14660Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Boha14660Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
