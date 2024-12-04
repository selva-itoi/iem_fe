import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorshipAllotmentRefListComponent } from './sponsorship-allotment-ref-list.component';

describe('SponsorshipAllotmentRefListComponent', () => {
  let component: SponsorshipAllotmentRefListComponent;
  let fixture: ComponentFixture<SponsorshipAllotmentRefListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SponsorshipAllotmentRefListComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorshipAllotmentRefListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
