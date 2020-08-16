import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoBodyComponent } from './tipo-body.component';

describe('TipoBodyComponent', () => {
  let component: TipoBodyComponent;
  let fixture: ComponentFixture<TipoBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
