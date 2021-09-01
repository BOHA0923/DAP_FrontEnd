import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcaseSinglePageBatchComponent } from './single-page-batch.component';

describe('ShowcaseSinglePageBatchComponent', () => {
  let component: ShowcaseSinglePageBatchComponent;
  let fixture: ComponentFixture<ShowcaseSinglePageBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowcaseSinglePageBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcaseSinglePageBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
