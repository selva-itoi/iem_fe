import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffExperienceComponent } from './staff-experience.component';

describe('StaffExperienceComponent', () => {
  let component: StaffExperienceComponent;
  let fixture: ComponentFixture<StaffExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [StaffExperienceComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
