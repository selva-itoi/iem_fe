import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFooterComponent } from './user-footer.component';

describe('UserFooterComponent', () => {
  let component: UserFooterComponent;
  let fixture: ComponentFixture<UserFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [UserFooterComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
