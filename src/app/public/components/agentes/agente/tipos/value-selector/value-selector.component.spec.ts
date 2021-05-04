import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueSelectorComponent } from './value-selector.component';

describe('ValueSelectorComponent', () => {
  let component: ValueSelectorComponent;
  let fixture: ComponentFixture<ValueSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
