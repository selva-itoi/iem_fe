import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSponsorComponent } from './view-sponsor.component';

describe('ViewSponsorComponent', () => {
  let component: ViewSponsorComponent;
  let fixture: ComponentFixture<ViewSponsorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ViewSponsorComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSponsorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
