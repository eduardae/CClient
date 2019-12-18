import { BrowserModule } from "@angular/platform-browser";
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
import { NgbdToastGlobal } from "./toast/toast-global.component";
import { ToastsContainer } from "./toast/toasts-container.component";
import { CoinComponent } from "./common/coin/coin.component";
import { SettingsComponent } from "./settings/settings.component";
import { AddCoinModal } from "./settings/add-coin-modal/add-coin-modal";

const appRoutes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "settings", component: SettingsComponent },
  { path: "news", component: NewsComponent },
  { path: "prices", component: PricesComponent },
  { path: "academy", component: AcademyComponent },
  { path: "terms", component: TermsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ToastsContainer,
    NgbdToastGlobal,
    HomeComponent,
    RegisterComponent,
    SettingsComponent,
    NewsComponent,
    AcademyComponent,
    LoginComponent,
    PricesComponent,
    TermsComponent,
    PriceComponent,
    CoinComponent,
    AddCoinModal
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpModule,
    ChartsModule,
    StorageServiceModule,
    NgbModule
  ],
  entryComponents: [AddCoinModal],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
  bootstrap: [AppComponent]
})
export class AppModule {}
