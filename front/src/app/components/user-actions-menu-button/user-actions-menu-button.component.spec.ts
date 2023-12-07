import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActionsMenuButtonComponent } from './user-actions-menu-button.component';

describe('UserActionsMenuButtonComponent', () => {
  let component: UserActionsMenuButtonComponent;
  let fixture: ComponentFixture<UserActionsMenuButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserActionsMenuButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserActionsMenuButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
