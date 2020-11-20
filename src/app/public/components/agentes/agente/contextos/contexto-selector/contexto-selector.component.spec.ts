import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextoSelectorComponent } from './contexto-selector.component';

describe('ContextoSelectorComponent', () => {
  let component: ContextoSelectorComponent;
  let fixture: ComponentFixture<ContextoSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextoSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextoSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
