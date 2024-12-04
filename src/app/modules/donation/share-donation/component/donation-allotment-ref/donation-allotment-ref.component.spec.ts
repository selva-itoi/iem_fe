import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationAllotmentRefComponent } from './donation-allotment-ref.component';

describe('DonationAllotmentRefComponent', () => {
  let component: DonationAllotmentRefComponent;
  let fixture: ComponentFixture<DonationAllotmentRefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [DonationAllotmentRefComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationAllotmentRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
