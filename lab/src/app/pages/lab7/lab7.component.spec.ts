import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lab7Component } from './lab7.component';

describe('Lab7Component', () => {
  let component: Lab7Component;
  let fixture: ComponentFixture<Lab7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Lab7Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lab7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
