import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSponsorshipComponent } from './new-sponsorship.component';

describe('NewSponsorshipComponent', () => {
  let component: NewSponsorshipComponent;
  let fixture: ComponentFixture<NewSponsorshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [NewSponsorshipComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSponsorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
