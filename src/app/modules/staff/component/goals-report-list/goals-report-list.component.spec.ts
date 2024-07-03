import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsReportListComponent } from './goals-report-list.component';

describe('GoalsReportListComponent', () => {
  let component: GoalsReportListComponent;
  let fixture: ComponentFixture<GoalsReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoalsReportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalsReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
