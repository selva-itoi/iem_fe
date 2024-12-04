import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRightSideBarComponent } from './user-right-side-bar.component';

describe('UserRightSideBarComponent', () => {
  let component: UserRightSideBarComponent;
  let fixture: ComponentFixture<UserRightSideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [UserRightSideBarComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRightSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
