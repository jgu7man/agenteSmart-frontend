import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoDatosComponent } from './grupo-datos.component';

describe('GrupoDatosComponent', () => {
  let component: GrupoDatosComponent;
  let fixture: ComponentFixture<GrupoDatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoDatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
