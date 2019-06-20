export interface UserMetaData {
  roles: string;
  contractor_id: number;
  firstname: string;
  lastname: string;
  email: string;
}

export interface UserProfile {
  email: string;
  user_metadata: UserMetaData;
  picture: string;
}

export interface Proposal {
  id: number;
}

export interface MaterialThemeHOC {
  classes: any;
  theme: any;
}

export interface File {
  id: number;
  name: string;
}
