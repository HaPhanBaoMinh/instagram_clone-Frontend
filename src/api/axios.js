import axios from "axios";
import ROUTER, { CLIENT_ROUTER } from "./router";

const instanceAxios = axios.create({
    baseURL: ROUTER,
    timeout: 3 * 1000,
    // headers: {
    //     "Content-Type": "application/json"
    // }
})

// Get/Set token
instanceAxios.getAccessToken = async () => {
    const tokenJson = await localStorage.getItem("token");
    return JSON.parse(tokenJson);
}

instanceAxios.getRefreshToken = async () => {
    const tokenJson = await localStorage.getItem("refreshToken");
    return JSON.parse(tokenJson);
}

instanceAxios.saveAccessToken = async (token) => {
    const { accessToken, timeExpired } = token;
    const tokenJson = JSON.stringify({ accessToken, timeExpired });
    localStorage.setItem("token", tokenJson);
}

const refreshToken = async () => {
    const refreshToken = await instanceAxios.getRefreshToken();
    const result = await instanceAxios.post("/token/accesstoken", { refreshToken });
    await instanceAxios.saveAccessToken(result.data);
    console.log("refreshToken");
}

// Before Request
instanceAxios.interceptors.request.use(
    async request => {
        if (request.url.includes("/login") || request.url.includes("/accesstoken") || request.url.includes("/signup")) {
            return request;
        }
        try {
            const { timeExpired } = await instanceAxios.getAccessToken();
            const now = new Date().getTime();
            // console.log(`timeExpired:` + timeExpired + " now:" + now);
            if (timeExpired < now) {
                console.log("Token timeout!!!");
                await refreshToken();

                // Add token to headers
                const token = await instanceAxios.getAccessToken();
                request.headers.authorization = token.accessToken;
                return request;
            }
        } catch (error) {
            console.log(error);
            window.location.href = `${CLIENT_ROUTER}/login`
            return Promise.reject(error)
        }

        // Add token to headers
        const token = await instanceAxios.getAccessToken();
        request.headers.authorization = token.accessToken;
        return request;
    },
    error => {
        return Promise.reject(error);
    }
)

// After request
instanceAxios.interceptors.response.use(
    async response => {
        // console.log("Sau khi respone")
        return response;
    },
    error => {
        if (!error.response) {
            console.log(error.message);
            return;
        }

        if (error.response.status === 401) {
            window.location.href = `${CLIENT_ROUTER}/login`
        }

        return Promise.reject(error);
    }
)



export default instanceAxios;