import type { RouteObject } from "react-router";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import { useCallback, useEffect } from "react";
import clsx from "clsx";

import WrapperRouteComponent from "./WrapperRouteComponent";
import MainHeader from "layouts/MainHeader";
import MainTabbar from "layouts/MainTabbar";
import RightSidebar from "layouts/RightSidebar";
import LeftSidebar from "layouts/LeftSidebar";

import HomePage from "pages/home";
import Activity from "pages/activity";
import Profile from "pages/profile";
import Auth from "pages/auth";
import Order from "pages/order";
import DailyCheckin from "pages/activity/DailyCheckin";
import Agency from "pages/vip/Agency";
import LuckyWeel from "pages/activity/LuckyWeel";
import Treasure from "pages/activity/Mines";
import Farm from "pages/farm";
import TermsAndPrivacy from "pages/about/TermsAndPrivacy";

import { ROUTES_HEADER_HIDDEN, ROUTES_TABBAR_HIDDEN } from "configs";
import requestService from "api/request";
import { useAuthApp } from "store/useAuthApp";
import { useGlobalAppStore } from "store/useGlobalApp";
import { getJSONFromUrl, removeLocalStoreageUser } from "lib/helpers";
import bg from "assets/images/_bf.jpeg";

// Định nghĩa danh sách route
const routeList: RouteObject[] = [
  {
    path: "/login",
    element: <WrapperRouteComponent element={<Auth />} title="login" />,
  },
  {
    path: "/register",
    element: <WrapperRouteComponent element={<Auth />} title="register" />,
  },
  {
    path: "/",
    element: <WrapperRouteComponent auth element={<HomePage />} title="Home" />,
  },
  {
    path: "/terms-and-privacy",
    element: (
      <WrapperRouteComponent
        element={<TermsAndPrivacy />}
        title="Terms and Privacy"
      />
    ),
  },
  {
    path: "/activity",
    element: (
      <WrapperRouteComponent auth element={<Activity />} title="Activity" />
    ),
  },
  {
    path: "/agency",
    element: <WrapperRouteComponent auth element={<Agency />} title="VIP" />,
  },
  {
    path: "/lucky-draw",
    element: (
      <WrapperRouteComponent auth element={<LuckyWeel />} title="Lucky Draw" />
    ),
  },
  {
    path: "/treasure",
    element: (
      <WrapperRouteComponent auth element={<Treasure />} title="Treasure" />
    ),
  },
  {
    path: "/daily-checkin",
    element: (
      <WrapperRouteComponent
        auth
        element={<DailyCheckin />}
        title="Daily Checkin"
      />
    ),
  },
  {
    path: "/profile",
    element: (
      <WrapperRouteComponent auth element={<Profile />} title="Profile" />
    ),
  },
  {
    path: "/order",
    element: <WrapperRouteComponent auth element={<Order />} title="Order" />,
  },
];

const RenderRouter = () => {
  const element = useRoutes(routeList);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { r } = getJSONFromUrl();

  const { logged, onSetUser } = useAuthApp();
  const { isCallBackUser } = useGlobalAppStore();

  const checkHiddenHeader =
    ROUTES_HEADER_HIDDEN.includes(pathname) || pathname.startsWith("/farm/");
  const checkHiddenTabbar =
    ROUTES_TABBAR_HIDDEN.includes(pathname) || pathname.startsWith("/farm/");

  // Gọi API lấy profile nếu đã đăng nhập
  const getUser = useCallback(async () => {
    try {
      const res = await requestService.get("/profile");
      if (res?.data?.data) {
        onSetUser(res.data.data);
      }
    } catch (error: any) {
      if ([401, 403, 500].includes(error?.response?.status)) {
        removeLocalStoreageUser();
        if (window.location.pathname !== "/login") {
          navigate("/login", { replace: true });
        }
      }
    }
  }, [onSetUser, navigate]);

  // Xử lý redirect nếu chưa đăng nhập hoặc đã đăng nhập mà vào trang login/register
  useEffect(() => {
    if (!logged) {
      const redirectPath =
        pathname === "/register" && r
          ? `/register?r=${r}`
          : pathname === "/register"
            ? "/register"
            : "/login";
      return navigate(redirectPath);
    }

    if ((pathname === "/login" || pathname === "/register" || r) && logged) {
      return navigate("/");
    }

    getUser();
  }, [logged, isCallBackUser, pathname, r, getUser]);

  // Cuộn lên đầu mỗi khi chuyển route
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="max-w-[100rem] m-auto w-full min-h-screen flex flex-col viewport-fake relative">
      <div className="min-h-screen bg-[#fff]">
        <div
          className="min-h-screen"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundPosition: "0",
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          {!checkHiddenHeader && <MainHeader />}

          <div
            className={clsx("relative", {
              "min-h-screen":
                !checkHiddenHeader && !pathname.startsWith("/farm/"),
            })}
          >
            {element}
          </div>
        </div>
      </div>

      <RightSidebar />
      <LeftSidebar />
      {!checkHiddenTabbar && <MainTabbar />}
    </div>
  );
};

export default RenderRouter;
