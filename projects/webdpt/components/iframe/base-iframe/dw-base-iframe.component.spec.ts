import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DwBaseIframeComponent } from './dw-base-iframe.component';

describe('DwIframeComponent', () => {
  let component: DwBaseIframeComponent;
  let fixture: ComponentFixture<DwBaseIframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwBaseIframeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwBaseIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
