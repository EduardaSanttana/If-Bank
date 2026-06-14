import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbrirConta } from './abrir-conta';

describe('AbrirConta', () => {
  let component: AbrirConta;
  let fixture: ComponentFixture<AbrirConta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbrirConta],
    }).compileComponents();

    fixture = TestBed.createComponent(AbrirConta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
