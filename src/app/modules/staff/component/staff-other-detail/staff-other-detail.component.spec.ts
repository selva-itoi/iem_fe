import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffOtherDetailComponent } from './staff-other-detail.component';

describe('StaffOtherDetailComponent', () => {
  let component: StaffOtherDetailComponent;
  let fixture: ComponentFixture<StaffOtherDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [StaffOtherDetailComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffOtherDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
