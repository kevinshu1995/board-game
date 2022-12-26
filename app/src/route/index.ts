import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import("@/components/view/Dashboard/Dashboard.vue"),
    },
    {
        path: "/room/:room_id",
        name: "WaitingRoom",
        component: () => import("@/components/view/WaitingRoom.vue"),
    },
    {
        path: "/api-list",
        name: "api-list",
        component: () => import("@/components/view/ApiList.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

