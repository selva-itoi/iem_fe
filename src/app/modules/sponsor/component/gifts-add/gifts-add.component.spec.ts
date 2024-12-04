import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftsAddComponent } from './gifts-add.component';

describe('GiftsAddComponent', () => {
  let component: GiftsAddComponent;
  let fixture: ComponentFixture<GiftsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [GiftsAddComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
