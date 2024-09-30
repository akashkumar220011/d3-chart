import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbletooltipsComponent } from './bubbletooltips.component';

describe('BubbletooltipsComponent', () => {
  let component: BubbletooltipsComponent;
  let fixture: ComponentFixture<BubbletooltipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BubbletooltipsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BubbletooltipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
