export interface CmnObject<T> {
  [key in string]: T;
}

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

export interface MaterialThemeHOC {
  classes: any;
  theme: any;
}

export type AddrInfo = {
  name: string;
  street?: string;
  city?: string;
}

export type CommonInfo = {
  id: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface FileInfo extends CommonInfo {
  name: string;
}

export interface SpecInfo extends CommonInfo {
  name: string;
}

export interface OptionPostInfo {
  name: string;
  value: string;
  description: string;
  budget: number;
  duration: number;
}

export type OptionInfo = CommonInfo & OptionPostInfo;

export interface CategoryInfo extends CommonInfo {
  name: string;
  type: string;
  value: string;
  description: string;
  optionList?: Array<OptionInfo>;
  proposalOptions?: object;
}

interface TemplateDetailInfo extends CommonInfo {
  name: string;
  description: string;
  categoryList: Array<CategoryInfo>;
}

export interface TemplateInfo extends CommonInfo {
  name: string;
  template: TemplateDetailInfo;
  projectTemplates?: Array<object>;
}

export type SortInfo = {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export type PageableInfo = {
  sort: SortInfo;
  pageSize: number;
  pageNumber: number;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

