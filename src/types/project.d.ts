import {
    Pageable,
    TemplateInfo,
    SpecialtyInfo,
    SortInfo,
    FileInfo,
    CmnObject
} from './global';
import { ContractorInfo } from './contractor';

export interface ProjectPostInfo {
    title: string;
    description: string;
    budget: number;
    updatedBy?: string;
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
    genContractor: ContractorInfo;
    projectFiles: Array<FileInfo>;
    projectTemplates: Array<TemplateInfo>;
    projectSpecialties: Array<SpecialtyInfo>;
    projectInvites?: Array<object>;
    relationships: Array<object>;
}

export interface Projects extends Pageable {
    content: Array<ProjectInfo>;
    allprojects: Array<object> | null;
    templates: Array<object> | null;
}

export interface ProjectLevelCategory {
    id: string;
    number: number;
    name: string;
    type: string;
    description: string;
    w: number;
    h: number;
    l: number;
}

export interface ProjectLevel {
    id: string;
    number: number;
    name: string;
    description: string;
    rooms: ProjectLevelCategory[];
}

export type MockTemplateInfo = {
    id: string;
    name: string;
    description: string;
};

export type RoomOption = {
    id: string;
    type: string;
    name: string;
    description: string;
    images: string[];
}

export type RoomOptions = {
    level_id: string;
    room_id: string;
    options: RoomOption[];
};

export type TemplateOption = {
    templ_id: string;
    options: RoomOptions[];
}
