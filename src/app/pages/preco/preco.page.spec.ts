import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrecoPage } from './preco.page';

describe('PrecoPage', () => {
  let component: PrecoPage;
  let fixture: ComponentFixture<PrecoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrecoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
