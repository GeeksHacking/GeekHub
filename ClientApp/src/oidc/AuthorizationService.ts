import { User, UserManager, WebStorageStateStore, Profile } from "oidc-client";

import { get } from "../api/http/oidc";
import { ApplicationName, OidcPaths } from "./AuthorizationConstants";

export enum AuthorizationStatus {
  Redirect,
  Success,
  Fail,
}

export interface AuthorizationResponse {
  status: AuthorizationStatus;
  message?: string;
  state?: Record<string, string>;
}

export class AuthorizationService {
  _userManager?: UserManager;

  _user?: User;
  _isAuthenticated = false;

  _nextSubscriptionId = 0;
  _subscriptions: Record<number, () => void> = {};

  subscribe(callback: () => void): number {
      this._nextSubscriptionId++;
      this._subscriptions[this._nextSubscriptionId - 1] = callback;
      return this._nextSubscriptionId - 1;
  }

  notify(): void {
      Object.values(this._subscriptions).forEach((callback) => callback());
  }

  unsubscribe(id: number): void {
      delete this._subscriptions[id];
  }

  async isAuthenticated(): Promise<boolean> {
      await this.ensureUserManagerInitialized();
      
      try {
          const user = await this.getUserProfile();
          
          return !!user;
      } catch {
          return false;
      }
  }

  async getUserProfile(): Promise<Profile> {
      await this.ensureUserManagerInitialized();
    
      if (this._user && this._user.profile) {
          return this._user.profile;
      }

      const user = await this._userManager?.getUser();

      if (!user) {
          throw new Error("User does not exist");
      }

      return user.profile;
  }

  async getAccessToken(): Promise<string> {
      await this.ensureUserManagerInitialized();

      const user = await this._userManager?.getUser();

      if (!user) {
          const { status } = await this.signIn({});
          if (status === AuthorizationStatus.Fail) throw new Error("Could not sign in");

          return await this.getAccessToken();
      }

      return user.access_token;
  }

  async signIn(state: Record<string, string>): Promise<AuthorizationResponse> {
      await this.ensureUserManagerInitialized();

      try {
          const silentUser = await this._userManager?.signinSilent({
              useReplaceToNavigate: true,
          });

          this._user = silentUser;
          this._isAuthenticated = true;
          this.notify();

          return { status: AuthorizationStatus.Success, state };
      } catch (silentError) {
          console.error("Silent authentication error: ", silentError);

          try {
              const popupUser = await this._userManager?.signinPopup({
                  useReplaceToNavigate: true,
              });

              this._user = popupUser;
              this._isAuthenticated = true;
              this.notify();

              return { status: AuthorizationStatus.Success, state };
          } catch (popupError) {
              console.error("Popup authentication error: ", popupError);

              if (popupError.message === "Popup window closed") {
                  return {
                      status: AuthorizationStatus.Fail,
                      message: "User closed the window",
                  };
              }

              try {
                  await this._userManager?.signinRedirect({
                      useReplaceToNavigate: true,
                      data: state,
                  });

                  return { status: AuthorizationStatus.Redirect };
              } catch (redirectError) {
                  console.error("Redirect authentication error: ", redirectError);

                  return { status: AuthorizationStatus.Fail, message: redirectError };
              }
          }
      }
  }

  async completeSignIn(url: string): Promise<AuthorizationResponse> {
      await this.ensureUserManagerInitialized();

      try {
          const user = await this._userManager?.signinCallback(url);
          const { state } = user ?? { state: {} };

          this._user = user;
          this._isAuthenticated = true;
          this.notify();

          return { status: AuthorizationStatus.Success, state };
      } catch (error) {
          console.error("Signin error: ", error);

          return { status: AuthorizationStatus.Fail, message: error };
      }
  }

  async signOut(state: Record<string, string>): Promise<AuthorizationResponse> {
      await this.ensureUserManagerInitialized();

      try {
          await this._userManager?.signoutPopup({ useReplaceToNavigate: true });

          this._user = undefined;
          this._isAuthenticated = false;
          this.notify();

          return { status: AuthorizationStatus.Success, state };
      } catch (popupError) {
          console.error("Popup signout error: ", popupError);

          try {
              await this._userManager?.signoutRedirect({
                  useReplaceToNavigate: true,
                  data: state,
              });

              return { status: AuthorizationStatus.Redirect };
          } catch (redirectError) {
              console.log("Signout error: ", redirectError);

              return { status: AuthorizationStatus.Fail, message: redirectError };
          }
      }
  }

  async completeSignOut(url: string): Promise<AuthorizationResponse> {
      await this.ensureUserManagerInitialized();

      try {
          await this._userManager?.signoutCallback(url);

          this._user = undefined;
          this._isAuthenticated = false;
          this.notify();

          return { status: AuthorizationStatus.Success };
      } catch (error) {
          console.error("Redirect signout error: ", error);

          return { status: AuthorizationStatus.Fail, message: error };
      }
  }

  async ensureUserManagerInitialized(): Promise<void> {
      if (this._userManager) return;

      try {
          const data = await get(
              OidcPaths.ApiAuthorizationClientConfigurationUrl
          );
          data.automaticSilentRenew = true;
          data.includeIdTokenInSilentRenew = true;
          data.userStore = new WebStorageStateStore({
              prefix: ApplicationName,
          });

          this._userManager = new UserManager(data);

          this._userManager.events.addUserSignedOut(async () => {
              await this._userManager?.removeUser();
              this._user = undefined;
              this._isAuthenticated = false;

              this.notify();
          });
      } catch {
          throw new Error(`Could not load settings for ${ApplicationName}`);
      }
  }

  static get instance(): AuthorizationService {
      return authService;
  }
}

const authService = new AuthorizationService();

export default authService;
