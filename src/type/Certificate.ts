export interface ICertificate {
    id: number;
    commonName: string;
    issuingCA: string;
    organization: string;
    validFrom: string;
    validTo: string;
    serialNumber: string;
    sans: string[];
    ip: string;
}

