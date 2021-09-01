import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwOrganizeTreeModalComponent } from './organize-tree-modal.component';

describe('DwOrganizeTreeModalComponent', () => {
  let component: DwOrganizeTreeModalComponent;
  let fixture: ComponentFixture<DwOrganizeTreeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwOrganizeTreeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwOrganizeTreeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
