import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationListRefComponent } from './donation-list-ref.component';

describe('DonationListRefComponent', () => {
  let component: DonationListRefComponent;
  let fixture: ComponentFixture<DonationListRefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [DonationListRefComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationListRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
