import socketio from "socket.io-client";
import React, { createContext, memo, useContext } from "react";
import ROUTER from "../api/router";
import AuthContext from "./AuthProvider";


const SocketContext = createContext();

export const SocketProvider = memo(({ children }) => {
    const { Auth } = useContext(AuthContext);
    let socket;
    if (Auth) {
        socket = socketio.connect(ROUTER, {
            query: {
                userId: Auth._id
            },
        });
    }
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>

    )
})

export default SocketContext

