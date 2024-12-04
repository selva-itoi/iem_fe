import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffTrainingComponent } from './staff-training.component';

describe('StaffTrainingComponent', () => {
  let component: StaffTrainingComponent;
  let fixture: ComponentFixture<StaffTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [StaffTrainingComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
