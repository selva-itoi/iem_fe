import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyHeadInfoComponent } from './modify-head-info.component';

describe('ModifyHeadInfoComponent', () => {
  let component: ModifyHeadInfoComponent;
  let fixture: ComponentFixture<ModifyHeadInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ModifyHeadInfoComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyHeadInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
