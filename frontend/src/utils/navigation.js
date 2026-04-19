export const getHomeRoute = (user) => (user?.role === "admin" ? "/admin" : "/dashboard");
