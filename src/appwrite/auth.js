import { Client, Account, ID } from "appwrite";
import conf from "../conf/conf.js";

export class AuthService {
    client = new Client();
    account;
    constructor() {
        this.client
            .setEndpoint(conf.appwrite.url)
            .setProject(conf.appwrite.projectId);
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name, username }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // Store username in preferences
                if (username) {
                    try {
                        await this.account.updatePrefs({
                            username: username,
                            fullName: name
                        });
                    } catch (prefsError) {
                        console.log("Appwrite service :: updatePrefs :: error", prefsError);
                    }
                }
                // call login after successful account creation
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            console.log("Appwrite service :: createAccount :: error", error);
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            const session = await this.account.createEmailPasswordSession(email, password);
            return session;
        } catch (error) {
            console.log("Appwrite service :: login :: error", error);
            throw error;
        }
    }

    async googleLogin() {
        return this.account.createOAuth2Session(
            "google",
            window.location.origin,              // success
            `${window.location.origin}/login`     // failure
        );
    }

    async getAccount() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getAccount :: error", error);
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            if (error?.code === 401) {
                // user not logged in → normal case
                return null;
            }
            console.log("Appwrite service :: getCurrentUser :: error", error);
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
        }
    }

    async updatePreferences(prefs) {
        try {
            return await this.account.updatePrefs(prefs);
        } catch (error) {
            console.log("Appwrite service :: updatePreferences :: error", error);
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;