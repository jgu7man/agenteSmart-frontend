import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigRetrocesoComponent } from './config-retroceso.component';

describe('ConfigRetrocesoComponent', () => {
  let component: ConfigRetrocesoComponent;
  let fixture: ComponentFixture<ConfigRetrocesoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigRetrocesoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigRetrocesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
