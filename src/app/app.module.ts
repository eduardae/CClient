import { BrowserModule } from "@angular/platform-browser";
import { ToasterModule, ToasterService } from "angular2-toaster";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { StorageServiceModule } from "angular-webstorage-service";
import { ChartsModule } from "ng2-charts";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./register/register.component";
import { Http } from "@angular/http";
import { APP_BASE_HREF } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoginComponent } from "./login/login.component";
import { NewsComponent } from "./news/news.component";
import { PricesComponent } from "./prices/prices.component";
import { PriceComponent } from "./common/price/price.component";
import { AcademyComponent } from "./academy/academy.component";
import { TermsComponent } from "./terms/terms.component";

const appRoutes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "news", component: NewsComponent },
  { path: "prices", component: PricesComponent },
  { path: "academy", component: AcademyComponent },
  { path: "terms", component: TermsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    NewsComponent,
    AcademyComponent,
    LoginComponent,
    PricesComponent,
    PriceComponent,
    TermsComponent
  ],
  imports: [
    BrowserAnimationsModule,
    ToasterModule.forRoot(),
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpModule,
    ChartsModule,
    StorageServiceModule,
    NgbModule
  ],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
  bootstrap: [AppComponent]
})
export class AppModule {}
