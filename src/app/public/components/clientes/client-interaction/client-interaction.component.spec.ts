import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInteractionComponent } from './client-interaction.component';

describe('ClientInteractionComponent', () => {
  let component: ClientInteractionComponent;
  let fixture: ComponentFixture<ClientInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
