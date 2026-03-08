"use client"

import axios from 'axios';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from './useAuth';

const axiosSecure = axios.create({
    baseURL: 'https://seoul-sage.vercel.app/'
})

const useAxiosSecure = () => {
    const { token, logout } = useAuth(); 
    const router = useRouter();

    useEffect(() => {
        const reqInterceptor = axiosSecure.interceptors.request.use(config => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        const resInterceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                const status = error.response?.status;
                if (status === 401 || status === 403) {
                    await logout();
                    router.push('/login'); 
                }
                return Promise.reject(error);
            }
        );
        return () => {
            axiosSecure.interceptors.request.eject(reqInterceptor);
            axiosSecure.interceptors.response.eject(resInterceptor);
        }
    }, [token, logout, router]);

    return axiosSecure;
};

export default useAxiosSecure;