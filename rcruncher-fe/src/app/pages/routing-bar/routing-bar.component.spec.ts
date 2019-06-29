import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingBarComponent } from './routing-bar.component';

describe('RoutingBarComponent', () => {
  let component: RoutingBarComponent;
  let fixture: ComponentFixture<RoutingBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutingBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
