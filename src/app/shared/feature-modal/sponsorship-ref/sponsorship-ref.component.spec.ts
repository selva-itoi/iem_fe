import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorshipRefComponent } from './sponsorship-ref.component';

describe('SponsorshipRefComponent', () => {
  let component: SponsorshipRefComponent;
  let fixture: ComponentFixture<SponsorshipRefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SponsorshipRefComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorshipRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
