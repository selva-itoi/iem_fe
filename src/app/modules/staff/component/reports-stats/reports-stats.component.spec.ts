import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsStatsComponent } from './reports-stats.component';

describe('ReportsStatsComponent', () => {
  let component: ReportsStatsComponent;
  let fixture: ComponentFixture<ReportsStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ReportsStatsComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
