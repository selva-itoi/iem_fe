import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurchDocComponent } from './church-doc.component';

describe('ChurchDocComponent', () => {
  let component: ChurchDocComponent;
  let fixture: ComponentFixture<ChurchDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ChurchDocComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChurchDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
