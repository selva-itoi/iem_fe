import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildEduYearlyUpdateComponent } from './child-edu-yearly-update.component';

describe('ChildEduYearlyUpdateComponent', () => {
  let component: ChildEduYearlyUpdateComponent;
  let fixture: ComponentFixture<ChildEduYearlyUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ChildEduYearlyUpdateComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildEduYearlyUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
