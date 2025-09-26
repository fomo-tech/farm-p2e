import { create } from "zustand";

type IStoreFarm = {
 dataInvest: Array<any>
};

export type AuthActions = {
  onSetDataInvest: (val: any) => void;

};
export const useStoreFarm = create<IStoreFarm & AuthActions>((set) => ({
  dataInvest: [],
 
  onSetDataInvest: (val: any) => {
    set((state) => {
      state.dataInvest = val;
      return { ...state };
    });
  },
}));
