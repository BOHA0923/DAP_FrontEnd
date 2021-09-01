import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizeTreeComponent } from './organize-tree.component';

describe('OrganizeTreeComponent', () => {
  let component: OrganizeTreeComponent;
  let fixture: ComponentFixture<OrganizeTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizeTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizeTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
