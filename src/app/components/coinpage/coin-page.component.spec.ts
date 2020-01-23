import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CoinPageComponent } from "./coin-page.component";

describe("CoinPageComponent", () => {
  let component: CoinPageComponent;
  let fixture: ComponentFixture<CoinPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CoinPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
