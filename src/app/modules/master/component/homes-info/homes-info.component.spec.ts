import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomesInfoComponent } from './homes-info.component';

describe('HomesInfoComponent', () => {
  let component: HomesInfoComponent;
  let fixture: ComponentFixture<HomesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [HomesInfoComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
