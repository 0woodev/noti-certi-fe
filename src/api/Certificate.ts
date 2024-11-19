import {api} from "../axiosInstance";

export const getLiveCertificate = async (ip: string, port: number) => {
    try {
        const response = await api.get(`/certificate/server`, {params: { ip, port }});
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const findManagedCertificate = async (ip: string, port: number) => {
    try {
        const response = await api.get(`/certificate/db`, {params: { ip, port }});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getManagedCertificateById = async (id: number) => {
    try {
        const response = await api.get(`/certificate/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}



export const connectDomainAndCert = async (domainId: number) => {
    try {
        const response = await api.put(`/certificate/sync`, { domainId });
        return response.data;
    } catch (error) {
        throw error;
    }
}