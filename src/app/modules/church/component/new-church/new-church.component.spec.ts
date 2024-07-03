import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewChurchComponent } from './new-church.component';

describe('NewChurchComponent', () => {
  let component: NewChurchComponent;
  let fixture: ComponentFixture<NewChurchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [NewChurchComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewChurchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
