import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationAllotmentListComponent } from './donation-allotment-list.component';

describe('DonationAllotmentListComponent', () => {
  let component: DonationAllotmentListComponent;
  let fixture: ComponentFixture<DonationAllotmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [DonationAllotmentListComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationAllotmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
