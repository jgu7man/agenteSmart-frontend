import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RespuestaTextComponent } from './respuesta-text.component';

describe('RespuestaTextComponent', () => {
  let component: RespuestaTextComponent;
  let fixture: ComponentFixture<RespuestaTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RespuestaTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RespuestaTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
