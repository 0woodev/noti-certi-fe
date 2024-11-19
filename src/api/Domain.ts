import {api} from "../axiosInstance";

export const getDomainIp = async (host: string, port: number) => {
    try {
        const response = await api.get(`/domain/ip`, {params: { host, port }});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getDomainById = async (id: number) => {
    try {
        // Domain Type
        const response = await api.get(`/domain/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const getDomainByIpAndPort = async (ip: string, port: number) => {
    try {
        const response = await api.get(`/domain`, {params: { ip, port }});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const saveDomain = async (host: string, ip: string, port: number) => {
    try {
        const response = await api.put("/domain", {host, ip, port});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const searchDomain = async (host?: string) => {
    try {
        const response = await api.get(`/domain/search`, {params: { host: host ?? null }});
        return response.data;
    } catch (error) {
        throw error;
    }
}
