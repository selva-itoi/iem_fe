import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurchBasicComponent } from './church-basic.component';

describe('ChurchBasicComponent', () => {
  let component: ChurchBasicComponent;
  let fixture: ComponentFixture<ChurchBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ChurchBasicComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChurchBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
