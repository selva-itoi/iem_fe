import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotmentInfoComponent } from './allotment-info.component';

describe('AllotmentInfoComponent', () => {
  let component: AllotmentInfoComponent;
  let fixture: ComponentFixture<AllotmentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [AllotmentInfoComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllotmentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
