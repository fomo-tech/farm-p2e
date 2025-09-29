import RenderRouter from "./routes";
import { BrowserRouter as Router } from "react-router-dom";
import { ConfigProvider, Drawer, Spin, theme as a, notification } from "antd";
import Loading from "components/elements/Loading";
import { useGlobalAppStore } from "store/useGlobalApp";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import requestService from "api/request";
import { useAuthApp } from "store/useAuthApp";
import { socket } from "lib/socket";
import VipFarmReward from "components/ui/VipFarmReward";
import ModalBase from "components/elements/ModalBase";
import Activities from "components/ui/Activities";
import Deposit from "components/ui/Deposit";
import Profile from "pages/profile";
import Withdraw from "components/ui/Withdraw";
import close_icon from "assets/img_custom/clolor_dialog_close.png";
import DailyCheckin from "pages/activity/DailyCheckin";
import LuckyWeel from "pages/activity/LuckyWeel";
import Treasure from "pages/activity/Mines";
import { useStoreFarm } from "store/useStoreFarm";
import UnlockLand from "components/ui/UnlockLand";
import Ranking from "components/ui/Ranking";
import BoxChat from "components/ui/chat";
import clsx from "clsx";
import GuideInvest from "components/ui/home/GuideInvest";

function App() {
  const {
    loading,
    handleSetConfig,
    handleSetEvents,
    configApp,
    handleToggleModal,
    openModal,
    handleCallbackUser,
  } = useGlobalAppStore();
  const { user, logged } = useAuthApp();
  const { onSetDataInvest, dataInvest } = useStoreFarm();
  const { t, i18n } = useTranslation();

  const getTickets = async () => {
    try {
      const res = await requestService.get("/tickets");
      if (res && res.data) {
        onSetDataInvest(res?.data?.data);
      }
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  useEffect(() => {
    if (logged) getTickets();
  }, [logged]);

  useEffect(() => {
    const joinApp = () => {
      if (user && user._id && socket.connected) {
        socket.emit("joinApp", user._id);
      }
    };

    socket.on("connect", joinApp);

    if (user && user._id && socket.connected) {
      joinApp();
    }

    return () => {
      socket.off("connect", joinApp);
    };
  }, [user?._id]);

  useEffect(() => {
    if (logged && !socket.connected) {
      socket.connect();
    }
  }, [logged]);

  const getConfigApp = async () => {
    try {
      const res = await requestService.get("/config");
      if (res && res.data) {
        handleSetConfig(res?.data?.data);
      }
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  const getEvents = async () => {
    try {
      const res = await requestService.get("/checkin/get-events");
      if (res && res.data) {
        handleSetEvents(res?.data?.data);
      }
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  useEffect(() => {
    // Initial fetch on mount
    // Listen to socket events only if user exists
    if (user?._id) {
      getEvents();
      getConfigApp();
      socket.on("getConfig", () => {
        getConfigApp();
        getEvents();
      });
    }

    // Cleanup socket listener
    return () => {
      socket.off("getConfig");
    };
  }, [user?._id]);

  useEffect(() => {
    if (localStorage.getItem("lang")) {
      i18n.changeLanguage(localStorage.getItem("lang") || "vi");
    } else {
      i18n.changeLanguage("vi");
    }
  }, []);

  useEffect(() => {
    if (configApp?.LIVECHAT_ID) {
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = "";

      (function () {
        const d = document;
        const s = d.createElement("script");
        s.src = "https://client.crisp.chat/l.js";
        s.async = true;
        d.getElementsByTagName("head")[0].appendChild(s);
      })();
    }
  }, [configApp?.LIVECHAT_ID]);

  useEffect(() => {
    if (socket) {
      socket.on("depositSuccess", (val: any) => {
        if (val?.isCheck) {
          handleCallbackUser();
        }
      });
      return () => {
        socket.off("depositSuccess");
      };
    }
  }, [socket]);

  return (
    <ConfigProvider>
      {loading && <Loading />}
      <Drawer
        width="100rem"
        zIndex={99999}
        open={openModal.type === "drawer" && !!openModal.name}
        onClose={() =>
          handleToggleModal({
            name: "",
            type: "",
            title: "",
          })
        }
        className={clsx("bg_custom_drawer", {
          custom_chat: openModal.name === "chat",
        })}
        title={openModal?.title}
        closeIcon={<img src={close_icon} width={50} />}
      >
        {openModal.name === "vipfarm" && <VipFarmReward />}
        {openModal.name === "deposit" && <Deposit />}
        {openModal.name === "withdraw" && <Withdraw />}
        {openModal.name === "profile" && <Profile />}
        {openModal.name === "chat" && <BoxChat />}
      </Drawer>

      <ModalBase
        isModalOpen={openModal.type === "modal" && !!openModal.name}
        onCancel={() =>
          handleToggleModal({
            name: "",
            type: "",
            title: "",
          })
        }
        titleHeader={openModal?.title}
      >
        {openModal.name === "activities" && <Activities />}
        {openModal.name === "checkin" && <DailyCheckin />}
        {openModal.name === "lucky_draw" && <LuckyWeel />}
        {openModal.name === "lucky_box" && <Treasure />}
        {openModal.name === "buy_land" && <UnlockLand />}
        {openModal.name === "ranking" && <Ranking />}
        {openModal.name === "guide" && <GuideInvest />}
      </ModalBase>

      <Router>
        <RenderRouter />
      </Router>
    </ConfigProvider>
  );
}

export default App;
