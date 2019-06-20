export interface UserMetaData {
	roles: string,
}

export interface UserProfile {
	email: string,
	user_metadata: UserMetaData,
}


export interface Proposal {
	id: number,
}