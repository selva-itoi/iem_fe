import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorshipDonationRefComponent } from './sponsorship-donation-ref.component';

describe('SponsorshipDonationRefComponent', () => {
  let component: SponsorshipDonationRefComponent;
  let fixture: ComponentFixture<SponsorshipDonationRefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SponsorshipDonationRefComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorshipDonationRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
