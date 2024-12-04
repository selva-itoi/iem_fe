import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationFormsComponent } from './application-forms.component';

describe('ApplicationFormsComponent', () => {
  let component: ApplicationFormsComponent;
  let fixture: ComponentFixture<ApplicationFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ApplicationFormsComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
