import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajesByContextoComponent } from './mensajes-contexto.component';

describe('MensajesComponent', () => {
  let component: MensajesByContextoComponent;
  let fixture: ComponentFixture<MensajesByContextoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajesByContextoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajesByContextoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
