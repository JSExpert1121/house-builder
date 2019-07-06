export interface UserMetaData {
  roles: string;
  contractor_id: number;
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

export interface ProjectInfo {
  id: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  due?: string;
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