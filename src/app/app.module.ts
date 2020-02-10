import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
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
import { HorizontalLoader } from "./components/common/horizontal-loader/horizontal-loader.component";
import { JWTInterceptor } from "./interceptors/jwt.interceptor";
import { CoinPageComponent } from "./components/coinpage/coin-page.component";
import { NewsPageComponent } from "./components/news/news-page/news-page.component";
import {
  SelectCoinModal,
  SelectCoinModalContent
} from "./components/settings/select-coin-modal/select-coin-modal";

const appRoutes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "settings", component: SettingsComponent },
  { path: "news", component: NewsPageComponent },
  { path: "prices", component: PricesComponent },
  { path: "coinpage/:coinId", component: CoinPageComponent },
  { path: "academy", component: AcademyComponent },
  { path: "terms", component: TermsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ToastsContainer,
    HorizontalLoader,
    NgbdToastGlobal,
    HomeComponent,
    RegisterComponent,
    SettingsComponent,
    NewsPageComponent,
    NewsComponent,
    AcademyComponent,
    LoginComponent,
    PricesComponent,
    TermsComponent,
    PriceComponent,
    CoinPageComponent,
    CoinComponent,
    AddCoinModal,
    AddCoinModalContent,
    SelectCoinModal,
    SelectCoinModalContent
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
  entryComponents: [
    AddCoinModal,
    AddCoinModalContent,
    SelectCoinModal,
    SelectCoinModalContent,
    CoinComponent
  ],
  exports: [RouterModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: "/" },
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
