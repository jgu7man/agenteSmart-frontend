import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaRespManagerComponent } from './entrada-resp-manager.component';

describe('EntradaRespManagerComponent', () => {
  let component: EntradaRespManagerComponent;
  let fixture: ComponentFixture<EntradaRespManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntradaRespManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntradaRespManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
