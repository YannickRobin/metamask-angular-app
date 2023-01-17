import { Injectable } from "@angular/core";
import { BackendUrlProvider } from "./metamask.service";

import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class EnvironmentBackendUrlProviderService extends BackendUrlProvider {
  protected apiURL = "";

  constructor() {
    super();
    this.apiURL = environment.easyRestURL;
  }

  getBackendUrl(path: string): string {
    return `${this.apiURL}${path}`;
  }
}
