import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappIntComponent } from './whatsapp-int.component';

describe('WhatsappIntComponent', () => {
  let component: WhatsappIntComponent;
  let fixture: ComponentFixture<WhatsappIntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsappIntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappIntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
