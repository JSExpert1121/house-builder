import { AddrInfo, SpecInfo, FileInfo } from './global';

export interface ContractorInfo {
    id: string;
    createdAt: string;
    updatedAt: string;
    updatedBy?: string;
    email: string;
    status: string;
    statusReason: string;
    address?: AddrInfo;
    contractorFiles: Array<FileInfo>;
    contractorSpecialties: Array<SpecInfo>;
}
