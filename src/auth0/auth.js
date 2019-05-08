import auth0 from 'auth0-js';
import axios from 'axios';

class Auth {
	constructor() {

		const redirectUri = process.env.NODE_ENV === 'development' ? process.env.AUTH_REDIRECT_DEV : process.env.AUTH_REDIRECT_PRO;
		this.auth0 = new auth0.WebAuth({
			domain: process.env.AUTH_DOMAIN,
			clientID: process.env.AUTH_CLIENTID,
			responseType: 'token id_token',
			redirectUri: redirectUri + "/callback",
			audience: process.env.AUTH_AUDIENCE,
			scope: 'openid profile email read:current_user read:user_idp_tokens read:users read:roles update:users update:roles update:users_app_metadata update:current_user_metadata'
		});

		this.getProfile = this.getProfile.bind(this);
	}

	getProfile(cb) {
		this.auth0.client.userInfo(this.accessToken, (err, profile) => {
			const user_id = profile["https://tungcb:auth0:com/user_id"];
			const headers = {
				'Authorization': `Bearer ${this.accessToken}`,
				'Content-type': 'application/json'
			};

			axios.get("https://tungcb.auth0.com/api/v2/users/" + user_id, { headers })
				.then(response => {
					this.userProfile = response.data;
					if (this.userProfile.user_metadata.id === "") {
						console.log(this.userProfile);
						cb(this.userProfile, {
							'name': "",
							'street': "",
							'city': "",
							'phone': ""
						});
						return;
					}
					console.log(this.userProfile);

					axios.get("https://bcbe-service.herokuapp.com/gencontractors/" + this.userProfile.user_metadata.id).
						then((response1) => {
							const address = response1.data.address;
							cb(this.userProfile, address);
						}).catch((err) => {
							if (err.response.status === 404) {
								axios.get("https://bcbe-service.herokuapp.com/subcontractors/" + this.userProfile.user_metadata.id).
									then((response1) => {
										const address = response1.data.address;
										cb(this.userProfile, address);
									}).catch((err) => {
									})
							}
						})
				})
				.catch(error => console.log(error.message));

			//axios.post("https://tungcb.auth0.com/api/v2/users/" + user_id + "/roles", { "roles": ["SuperAdmin"] }, { headers })
		});
	}

	updateProfile(data, cb) {
		const user_id = this.userProfile.user_id;
		const headers = { 'Authorization': `Bearer ${this.getAccessToken()}` };
		axios.patch("https://tungcb.auth0.com/api/v2/users/" + user_id, data, { headers: headers })
			.then(response => { this.getProfile(cb) })
			.catch(error => console.log(error.message));
	}

	updateSet(data, cb) {
		const user_id = this.userProfile.user_id;
		const headers = { 'Authorization': `Bearer ${this.getAccessToken()}` };
		axios.patch("https://tungcb.auth0.com/api/v2/users/" + user_id, data, { headers: headers })
			.then(response => {
				cb();
			})
			.catch(error => console.log(error.message));
	}

	getAccessToken = () => {
		return this.accessToken;
	}

	getIdToken = () => {
		return this.idToken;
	}

	isAuthenticated = () => {
		return new Date().getTime() < this.expiresAt;
	}

	signIn = () => {
		this.auth0.authorize();

		this.auth0.crossOriginAuthenticationCallback();
	}

	signOut = () => {
		this.auth0.logout({
			returnTo: process.env.NODE_ENV === 'development' ? process.env.AUTH_REDIRECT_DEV : process.env.AUTH_REDIRECT_PRO,
			clientID: "Q3WdOgiwATl3idTKhB1R1AazJ7YAJFnK"
		});
	}

	setSession = (authResult) => {
		this.accessToken = authResult.accessToken;
		this.idToken = authResult.idToken;
		this.profile = authResult.idTokenPayload;
		// set the time that the id token will expire at
		this.expiresAt = authResult.idTokenPayload.exp * 1000;
	}

	handleAuthentication = () => {
		return new Promise((resolve, reject) => {
			this.auth0.parseHash((err, authResult) => {
				if (err) return reject(err);
				if (!authResult || !authResult.idToken || !authResult.accessToken) {
					return reject(err);
				}

				this.setSession(authResult);
				resolve();
			});
		});
	}

	silentAuth() {
		return new Promise((resolve, reject) => {
			this.auth0.checkSession({}, (err, authResult) => {
				if (err) return reject(err);
				this.setSession(authResult);
				resolve();
			});
		});
	}
}

const auth0Client = new Auth();

export default auth0Client;