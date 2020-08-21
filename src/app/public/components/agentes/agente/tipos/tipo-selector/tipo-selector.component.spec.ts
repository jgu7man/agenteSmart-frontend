import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoSelectorComponent } from './tipo-selector.component';

describe('TipoSelectorComponent', () => {
  let component: TipoSelectorComponent;
  let fixture: ComponentFixture<TipoSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
