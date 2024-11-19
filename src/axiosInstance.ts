import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8080/',
    headers: {
        'Content-Type': 'application/json',
    }
});

// api.interceptors.request.use((config) => {
//     const savedUser = localStorage.getItem('usr');
//     if (savedUser) {
//         const { token } = JSON.parse(savedUser);
//         config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
// });
//
// // api 요청에서 401 에러가 발생하면, 다시 로그인요청을 보내서, localStorage 에 저장된 토큰을 갱신한다.
// api.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async (error) => {
//         if (error.response?.status === 401) {
//             try {
//                 localStorage.removeItem('usr')
//                 // localStorage.removeItem('name')
//                 // localStorage.removeItem('uid')
//                 // window.location.reload();
//                 // const response = await fetchRefresh('username', 'password');
//                 // localStorage.setItem('token', response.token);
//                 // api.defaults.headers['authorization'] = 'Bearer ' + response.token;
//                 // return api.request(error.config);
//             } catch (error) {
//                 throw error;
//             }
//         }
//         throw error;
//     }
// );
