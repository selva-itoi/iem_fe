import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorBasicComponent } from './sponsor-basic.component';

describe('SponsorBasicComponent', () => {
  let component: SponsorBasicComponent;
  let fixture: ComponentFixture<SponsorBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SponsorBasicComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
