import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaEditComponent } from './tarjeta-edit.component';

describe('TarjetaEditComponent', () => {
  let component: TarjetaEditComponent;
  let fixture: ComponentFixture<TarjetaEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
