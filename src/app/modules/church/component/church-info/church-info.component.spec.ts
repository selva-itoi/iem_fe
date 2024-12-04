import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurchInfoComponent } from './church-info.component';

describe('ChurchInfoComponent', () => {
  let component: ChurchInfoComponent;
  let fixture: ComponentFixture<ChurchInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ChurchInfoComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChurchInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
