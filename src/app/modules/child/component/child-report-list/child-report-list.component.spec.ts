import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildReportListComponent } from './child-report-list.component';

describe('ChildReportListComponent', () => {
  let component: ChildReportListComponent;
  let fixture: ComponentFixture<ChildReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ChildReportListComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
