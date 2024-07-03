import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouncilMemberComponent } from './council-member.component';

describe('CouncilMemberComponent', () => {
  let component: CouncilMemberComponent;
  let fixture: ComponentFixture<CouncilMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [CouncilMemberComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CouncilMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
