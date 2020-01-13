import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicMenuPage } from './public-menu.page';

describe('PublicMenuPage', () => {
  let component: PublicMenuPage;
  let fixture: ComponentFixture<PublicMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicMenuPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
