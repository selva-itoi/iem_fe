import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffExpGemsComponent } from './staff-exp-gems.component';

describe('StaffExpGemsComponent', () => {
  let component: StaffExpGemsComponent;
  let fixture: ComponentFixture<StaffExpGemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [StaffExpGemsComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffExpGemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
