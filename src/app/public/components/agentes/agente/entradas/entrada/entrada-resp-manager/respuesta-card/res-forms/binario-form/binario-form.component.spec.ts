import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinarioFormComponent } from './binario-form.component';

describe('BinarioFormComponent', () => {
  let component: BinarioFormComponent;
  let fixture: ComponentFixture<BinarioFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinarioFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinarioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
