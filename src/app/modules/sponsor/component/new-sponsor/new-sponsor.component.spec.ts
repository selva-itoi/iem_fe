import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSponsorComponent } from './new-sponsor.component';

describe('NewSponsorComponent', () => {
  let component: NewSponsorComponent;
  let fixture: ComponentFixture<NewSponsorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [NewSponsorComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSponsorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
