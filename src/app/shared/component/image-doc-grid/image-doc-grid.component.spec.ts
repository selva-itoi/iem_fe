import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDocGridComponent } from './image-doc-grid.component';

describe('ImageDocGridComponent', () => {
  let component: ImageDocGridComponent;
  let fixture: ComponentFixture<ImageDocGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ImageDocGridComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDocGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
