import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLeftSideBarComponent } from './user-left-side-bar.component';

describe('UserLeftSideBarComponent', () => {
  let component: UserLeftSideBarComponent;
  let fixture: ComponentFixture<UserLeftSideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [UserLeftSideBarComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLeftSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
