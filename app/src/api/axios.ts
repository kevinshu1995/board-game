import axios from "axios";

const axiosSupabaseAnon = axios.create({
    baseURL: `${import.meta.env.VITE_SUPABASE_URL}`,
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
});

axiosSupabaseAnon.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosSupabaseAnon.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        console.error(error);
        const returnError = error.toJSON();

        // TODO make a error toast
        console.log({
            code: returnError.code,
            status: returnError.response.status,
            message: returnError.response.data.message,
        });
        return Promise.reject(returnError);
    }
);

export { axiosSupabaseAnon };

