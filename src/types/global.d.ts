export interface UserMetaData {
  roles: string;
  contractor_id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface UserProfile {
  email: string;
  name: string;
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

export interface ProjectPostInfo {
  title: string;
  description: string;
  budget: number;
  updatedBy: string;
  due?: Date;
}

export interface ProjectBaseInfo {
  id: string;
  title: string;
  description: string;
  budget: number;
  due?: string;
}

export interface ProjectInfo extends ProjectBaseInfo {
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  status: string;
  projectFiles: Array<string>;
  projectTemplates: Array;
  projectSpecialties: Array;
  projectInvites: Array | null;
  relationships: Array;
}

type SortInfo = {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

type PageableInfo = {
  sort: SortInfo;
  pageSize: number;
  pageNumber: number;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface Projects {
  content: Array<ProjectInfo>;
  pageable: PageableInfo;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  sort: PageableInfo;
  numberOfElements: number;
  size: number;
  empty: boolean;
  allprojects: Array | null;
  templates: Array | null;
}