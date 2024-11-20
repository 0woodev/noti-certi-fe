import {ISimpleCertificate} from "./Certificate";

export interface ISimpleDomain {
    id: number;
    host: string;
    ip: string;
    port: string;
}


export interface IDomain {
    id: number;
    host: string;
    ip: string;
    port: string;
    certificate: ISimpleCertificate | null;
}


