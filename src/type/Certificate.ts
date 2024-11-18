export interface Certificate {
    id: number;
    commonName: string;
    issuingCA: string;
    organization: string;
    validFrom: string;
    validTo: string;
    serialNumber: string;
    sans: string[];
}

/**
 *     private Long id;
 *     private String commonName;
 *     private String issuingCA;
 *     private String organization;
 *     private Instant validFrom;
 *     private Instant validTo;
 *     private String serialNumber;
 *     private List<String> sans;
 */