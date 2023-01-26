import BlankLayout from "../components/blankLayout/BlankLayout";
import Home from "../page/Home";
import Login from "../page/Login";
import Message from "../page/Message";
import PostDetail from "../page/PostDetail";
import Profile from "../page/Profile";
import SignUp from "../page/SignUp";
import Trending from "../page/Trending";

const publicRouter = [
    { path: "/login", component: Login, layout: BlankLayout },
    { path: "/signup", component: SignUp, layout: BlankLayout },
]

const authRouter = [
    { path: "/home", component: Home, layout: null },
    { path: "/message", component: Message, layout: null },
    { path: "/user/:username", component: Profile, layout: null },
    { path: "/trending", component: Trending, layout: null },
    { path: "/post/:post_id", component: PostDetail, layout: null },
]



export { publicRouter, authRouter }