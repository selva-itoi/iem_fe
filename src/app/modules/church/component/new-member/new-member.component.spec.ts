import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMemberComponent } from './new-member.component';

describe('NewMemberComponent', () => {
  let component: NewMemberComponent;
  let fixture: ComponentFixture<NewMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [NewMemberComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
