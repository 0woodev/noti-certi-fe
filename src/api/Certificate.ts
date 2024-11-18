import {api} from "../axiosInstance";

export const getCertificate = async (domain: string, port: number) => {
    try {
        const response = await api.get(`/certificate/server`, {params: { domain, port }});
        return response.data.body;
    } catch (error) {
        throw error;
    }
}