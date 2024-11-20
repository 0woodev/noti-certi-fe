import {api} from "../axiosInstance";

export const searchApp = async (name?: string) => {
    try {
        let getAppListRes = await api.get('/app', { params: { name : name ?? null } });

        return getAppListRes.data;
    } catch (error) {
        throw error;
    }
}

export const saveApp = async (name: string, code: string, description: string) => {
    try {
        let saveAppRes = await api.post('/app', { name, code, description });

        return saveAppRes.data;
    } catch (error) {
        throw error;
    }
}

export const getAppById = async (id: number) => {
    try {
        let getAppRes = await api.get(`/app/${id}`);

        return getAppRes.data;
    } catch (error) {
        throw error;
    }
}

export const getAppsByDomainId = async (id: number, exclude?: boolean) => {
    try {
        let getAppsRes = await api.get(`/app/domain/${id}`);

        return getAppsRes.data;
    } catch (error) {
        throw error;
    }
}

export const getAppsByExcludeDomainId = async (id: number) => {
    try {
        let getAppsRes = await api.get(`/app/domain/exclude/${id}`);

        return getAppsRes.data;
    } catch (error) {
        throw error;
    }
}

export const connectAppsToDomain = async (domainId: number, appIds: number[]) => {
    try {
        let connectAppsRes = await api.put(`/app/domain/${domainId}`, null, { params: { appIds: appIds.toString() } });

        return connectAppsRes.data;
    } catch (error) {
        throw error;
    }
}

export const disconnectAppsToDomain = async (domainId: number, appIds: number[]) => {
    try {
        let disconnectAppsRes = await api.delete(`/app/domain/${domainId}`, { params: { appIds: appIds.toString() } });

        return disconnectAppsRes.data;
    } catch (error) {
        throw error;
    }
}

