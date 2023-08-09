import { instance } from "common/api";

export const securityAPI = {
    getCaptchaUrl() {
        return instance.get<{url:string}>("security/get-captcha-url");
    },
};