import React from "react";
import { create } from "zustand";

export type GlobalAppState = {
  isDarkMode: boolean;
  openModal: {
    type:string,
    name:string,
    title?:string | React.ReactNode,
  },
  loading: boolean;
  isCallBackUser: boolean;
  configApp: any;
  events: any;
};

export type GlobalAppActions = {
  toggleDarkMode: (val: boolean) => void;
  handleLoading: (val: boolean) => void;
  handleCallbackUser: () => void;
  handleSetConfig: (val: any) => void;
  handleSetEvents: (val: any) => void;
  handleToggleModal: (val: {
    type:string,
    name:string,
    title?:string | React.ReactNode
  }) => void;
};

export const useGlobalAppStore = create<GlobalAppState & GlobalAppActions>(
  (set) => ({
    openModal: {
      type:"",
      name:"",
    },
    events: null,
    isDarkMode: false,
    isCallBackUser: false,
    loading: false,
    configApp: null,
    handleToggleModal: (val: {
      type:string,
      name:string,
      title?:string | React.ReactNode
    }) => {
      set((state) => {
        state.openModal = val;
        return { ...state };
      });
    },
    handleSetConfig: (val: boolean) => {
      set((state) => {
        state.configApp = val;
        return { ...state };
      });
    },
    handleSetEvents: (val: boolean) => {
      set((state) => {
        state.events = val;
        return { ...state };
      });
    },
    handleLoading: (val: boolean) => {
      set((state) => {
        state.loading = val;
        return { ...state };
      });
    },
    handleCallbackUser: () => {
      set((state) => {
        state.isCallBackUser = !state.isCallBackUser;
        return { ...state };
      });
    },
    toggleDarkMode: (val: boolean) => {
      set((state) => {
        state.isDarkMode = val;
        return { ...state };
      });
    },
  })
);
