import { PageableInfo, TemplateInfo, SpecInfo, SortInfo } from './global'
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
    projectTemplates: Array<TemplateInfo>;
    projectSpecialties: Array<SpecInfo>;
    projectInvites?: Array<object>;
    relationships: Array<object>;
}

export interface Projects {
    content: Array<ProjectInfo>;
    pageable: PageableInfo;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    sort: SortInfo;
    numberOfElements: number;
    size: number;
    empty: boolean;
    allprojects: Array<object> | null;
    templates: Array<object> | null;
}