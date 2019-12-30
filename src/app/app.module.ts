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
import { HomeComponent } from "./components/home/home.component";
import { RegisterComponent } from "./components/register/register.component";
import { Http } from "@angular/http";
import { APP_BASE_HREF } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoginComponent } from "./components/login/login.component";
import { NewsComponent } from "./components/news/news.component";
import { PricesComponent } from "./components/prices/prices.component";
import { PriceComponent } from "./components/common/price/price.component";
import { AcademyComponent } from "./components/academy/academy.component";
import { TermsComponent } from "./components/terms/terms.component";
import { NgbdToastGlobal } from "./components/common/toast/toast-global.component";
import { ToastsContainer } from "./components/common/toast/toasts-container.component";
import { CoinComponent } from "./components/common/coin/coin.component";
import {
  AddCoinModal,
  AddCoinModalContent
} from "./components/settings/add-coin-modal/add-coin-modal";
import { SettingsComponent } from "./components/settings/settings.component";

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
    AddCoinModal,
    AddCoinModalContent
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
  entryComponents: [AddCoinModal, AddCoinModalContent, CoinComponent],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
  bootstrap: [AppComponent]
})
export class AppModule {}
