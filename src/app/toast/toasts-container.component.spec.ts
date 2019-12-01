import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ToastsContainer } from "./toasts-container.component";

describe("ToastsContainer", () => {
  let component: ToastsContainer;
  let fixture: ComponentFixture<ToastsContainer>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToastsContainer]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastsContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
