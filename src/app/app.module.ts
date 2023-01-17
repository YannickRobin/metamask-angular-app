import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { CheckTransactionMetamaskComponent } from "./metamask/check-transaction-metamask/check-transaction-metamask.component";
import { ConnectMetamaskComponent } from "./metamask/connect-metamask/connect-metamask.component";
import { EnvironmentBackendUrlProviderService } from "./metamask/environment-backend-url-provider.service";
import { InMemoryAuthStorageService } from "./metamask/in-memory-auth-storage.service";
import { LoginMetaMaskComponent } from "./metamask/login-metamask/login-metamask.component";
import { LogoutMetamaskComponent } from "./metamask/logout-metamask/logout-metamask.component";
import { AuthStorage, BackendUrlProvider } from "./metamask/metamask.service";
import { SendTransactionMetamaskComponent } from "./metamask/send-transaction-metamask/send-transaction-metamask.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginMetaMaskComponent,
    LogoutMetamaskComponent,
    SendTransactionMetamaskComponent,
    CheckTransactionMetamaskComponent,
    ConnectMetamaskComponent,
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  providers: [
    {
      provide: BackendUrlProvider,
      useClass: EnvironmentBackendUrlProviderService,
    },
    {
      provide: AuthStorage,
      useClass: InMemoryAuthStorageService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
