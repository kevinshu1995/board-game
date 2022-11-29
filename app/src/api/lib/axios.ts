import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import { useAuth } from "@/store";

const axiosSupabase = bindAxios(
    {
        baseURL: `/supabase`,
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
    },
    {}
);

const axiosSupabaseFunction = bindAxios(
    {
        baseURL: `/functions`,
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
    },
    {}
);

type CustomAxiosOptions = {};

function bindAxios(axiosOptions: AxiosRequestConfig, {}: CustomAxiosOptions): AxiosInstance {
    const axiosInstance = axios.create(axiosOptions);

    axiosInstance.interceptors.request.use(
        function (config: AxiosRequestConfig): AxiosRequestConfig {
            config.headers = config.headers ?? {};
            const { session } = useAuth();
            if (session) {
                config.headers.Authorization = `Bearer ${session.access_token}`;
            }

            return config;
        },
        function (error) {
            // Do something with request error
            return Promise.reject(error);
        }
    );

    // Add a response interceptor
    axiosInstance.interceptors.response.use(
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

    return axiosInstance;
}

export { axiosSupabase, axiosSupabaseFunction };

