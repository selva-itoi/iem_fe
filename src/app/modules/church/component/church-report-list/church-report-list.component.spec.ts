import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurchReportListComponent } from './church-report-list.component';

describe('ChurchReportListComponent', () => {
  let component: ChurchReportListComponent;
  let fixture: ComponentFixture<ChurchReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ChurchReportListComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChurchReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
