import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSponsorPageComponent } from './manage-sponsor-page.component';

describe('ManageSponsorPageComponent', () => {
  let component: ManageSponsorPageComponent;
  let fixture: ComponentFixture<ManageSponsorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ManageSponsorPageComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSponsorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
