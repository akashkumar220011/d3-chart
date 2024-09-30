import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Intern1Component } from './intern1.component';

describe('Intern1Component', () => {
  let component: Intern1Component;
  let fixture: ComponentFixture<Intern1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Intern1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Intern1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
