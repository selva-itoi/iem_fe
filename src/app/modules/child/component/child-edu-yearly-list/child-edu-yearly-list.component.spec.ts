import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildEduYearlyListComponent } from './child-edu-yearly-list.component';

describe('ChildEduYearlyListComponent', () => {
  let component: ChildEduYearlyListComponent;
  let fixture: ComponentFixture<ChildEduYearlyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ChildEduYearlyListComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildEduYearlyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
