import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActionsMenuComponent } from './user-actions-menu.component';

describe('UserActionsMenuComponent', () => {
  let component: UserActionsMenuComponent;
  let fixture: ComponentFixture<UserActionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserActionsMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserActionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
