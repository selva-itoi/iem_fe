import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunterStatsComponent } from './volunter-stats.component';

describe('VolunterStatsComponent', () => {
  let component: VolunterStatsComponent;
  let fixture: ComponentFixture<VolunterStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VolunterStatsComponent]
    });
    fixture = TestBed.createComponent(VolunterStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
