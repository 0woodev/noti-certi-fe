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