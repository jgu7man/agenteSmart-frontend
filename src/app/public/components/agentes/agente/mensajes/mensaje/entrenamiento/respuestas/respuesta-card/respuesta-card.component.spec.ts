import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RespuestaCardComponent } from './respuesta-card.component';

describe('RespuestaCardComponent', () => {
  let component: RespuestaCardComponent;
  let fixture: ComponentFixture<RespuestaCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RespuestaCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RespuestaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
