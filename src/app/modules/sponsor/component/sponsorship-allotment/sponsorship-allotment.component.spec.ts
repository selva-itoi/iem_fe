import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorshipAllotmentComponent } from './sponsorship-allotment.component';

describe('SponsorshipAllotmentComponent', () => {
  let component: SponsorshipAllotmentComponent;
  let fixture: ComponentFixture<SponsorshipAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SponsorshipAllotmentComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorshipAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
