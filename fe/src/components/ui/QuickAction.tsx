import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Deposit from './Deposit'
import Withdraw from './Withdraw'
import TeamInvite from './home/TeamInvite'

const QuickAction = () => {
  const { t } = useTranslation()
  const [openDeposit, setOpenDeposit] = useState(false)
  const [openWithdraw, setOpenWithdraw] = useState(false)
  const [openTeam, setOpenTeam] = useState(false)
  return (
    <>
      {/* quick-actions          */}
      {/* <Deposit
                open={openDeposit}
                setOpen={setOpenDeposit}
            /> */}

      {/* <Withdraw
        open={openWithdraw}
        setOpen={setOpenWithdraw}
      /> */}

      <TeamInvite
        open={openTeam}
        setOpen={setOpenTeam}
      />

      <div data-v-caee1139="" className="quick-actions">

        <div data-v-caee1139="" className="action-item"
          onClick={() => setOpenDeposit(true)}
        >
          <div
            data-v-caee1139=""
            className="action-icon"
            style={{ background: "rgba(25, 137, 250, 0.1)" }}
          >
            <svg
              data-v-caee1139=""
              className="inline-block"
              viewBox="0 0 24 24"
              width="1.2em"
              height="1.2em"
              style={{ color: "rgb(25, 137, 250)", width: 24, height: 24 }}
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M20.41 9.86a3 3 0 0 0-.175-.003H17.8c-1.992 0-3.698 1.581-3.698 3.643s1.706 3.643 3.699 3.643h2.433q.092.001.175-.004a1.7 1.7 0 0 0 1.586-1.581c.004-.059.004-.122.004-.18v-3.756c0-.058 0-.121-.004-.18a1.7 1.7 0 0 0-1.585-1.581m-2.823 4.611c.513 0 .93-.434.93-.971s-.417-.971-.93-.971s-.929.434-.929.971s.416.971.93.971"
                clipRule="evenodd"
              />
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M20.234 18.6a.214.214 0 0 1 .214.27c-.194.692-.501 1.282-.994 1.778c-.721.727-1.636 1.05-2.766 1.203c-1.098.149-2.5.149-4.272.149h-2.037c-1.771 0-3.174 0-4.272-.149c-1.13-.153-2.045-.476-2.766-1.203C2.62 19.923 2.3 19 2.148 17.862C2 16.754 2 15.34 2 13.555v-.11c0-1.785 0-3.2.148-4.306C2.3 8 2.62 7.08 3.34 6.351c.721-.726 1.636-1.05 2.766-1.202C7.205 5 8.608 5 10.379 5h2.037c1.771 0 3.174 0 4.272.149c1.13.153 2.045.476 2.766 1.202c.493.497.8 1.087.994 1.78a.214.214 0 0 1-.214.269h-2.433c-2.734 0-5.143 2.177-5.143 5.1s2.41 5.1 5.144 5.1zM5.614 8.886a.725.725 0 0 0-.722.728c0 .403.323.729.722.729H9.47c.4 0 .723-.326.723-.729a.726.726 0 0 0-.723-.728z"
                clipRule="evenodd"
              />
              <path
                fill="currentColor"
                d="m7.777 4.024l1.958-1.443a2.97 2.97 0 0 1 3.53 0l1.969 1.451C14.41 4 13.49 4 12.483 4h-2.17c-.922 0-1.769 0-2.536.024"
              />
            </svg>
          </div>
          <span data-v-caee1139="" className="action-name">
            {t("home.deposit")}
          </span>
        </div>

        <div data-v-caee1139="" className="action-item" onClick={() => setOpenTeam(true)}>
          <div
            data-v-caee1139=""
            className="action-icon"
            style={{ background: "rgba(255, 151, 106, 0.1)" }}
          >

            <svg xmlns="http://www.w3.org/2000/svg"
              style={{ color: "rgb(255, 151, 106)", width: 24, height: 24 }}
              viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M1.5 7.125c0-1.036.84-1.875 1.875-1.875h6c1.036 0 1.875.84 1.875 1.875v3.75c0 1.036-.84 1.875-1.875 1.875h-6A1.875 1.875 0 0 1 1.5 10.875v-3.75Zm12 1.5c0-1.036.84-1.875 1.875-1.875h5.25c1.035 0 1.875.84 1.875 1.875v8.25c0 1.035-.84 1.875-1.875 1.875h-5.25a1.875 1.875 0 0 1-1.875-1.875v-8.25ZM3 16.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875v2.25c0 1.035-.84 1.875-1.875 1.875h-5.25A1.875 1.875 0 0 1 3 18.375v-2.25Z" clipRule="evenodd" />
            </svg>

          </div>
          <span data-v-caee1139="" className="action-name text-center">
            {t("home.referral")}
          </span>
        </div>
        <div data-v-caee1139="" className="action-item" onClick={() => window.$crisp?.push(["do", "chat:open"])}>
          <div
            data-v-caee1139=""
            className="action-icon"
            style={{ background: "rgba(7, 193, 96, 0.1)" }}
          >


            <svg

              style={{ color: "rgb(7, 193, 96)", width: 24, height: 24 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97-1.94.284-3.916.455-5.922.505a.39.39 0 0 0-.266.112L8.78 21.53A.75.75 0 0 1 7.5 21v-3.955a48.842 48.842 0 0 1-2.652-.316c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clipRule="evenodd" />
            </svg>



          </div>
          <span data-v-caee1139="" className="action-name">
            {t("CSKH")}
          </span>
        </div>
        <div data-v-caee1139="" className="action-item"
          onClick={() => setOpenWithdraw(true)}
        >
          <div
            data-v-caee1139=""
            className="action-icon"
            style={{ background: "rgba(211, 39, 39, 0.1)" }}
          >
            <svg
              data-v-caee1139=""
              className="inline-block"
              viewBox="0 0 24 24"
              width="1.2em"
              height="1.2em"
              style={{ color: "rgb(211, 39, 39)", width: 24, height: 24 }}
            >
              <path
                fill="currentColor"
                d="M10 4h4c3.771 0 5.657 0 6.828 1.172c.844.843 1.08 2.057 1.146 4.078H2.026c.066-2.021.302-3.235 1.146-4.078C4.343 4 6.229 4 10 4"
              />
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="m22 12.818l-.409-.409a2.25 2.25 0 0 0-3.182 0l-.801.801a2.251 2.251 0 0 0-4.358.79v1.764a2.25 2.25 0 0 0-1.341 3.827l.409.409H10c-3.771 0-5.657 0-6.828-1.172S2 15.771 2 12q0-.662.002-1.25h19.996Q22 11.338 22 12zM6 15.25a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5z"
                clipRule="evenodd"
              />
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M15.5 13.25a.75.75 0 0 1 .75.75v4.19l.72-.72a.75.75 0 1 1 1.06 1.06l-2 2a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l.72.72V14a.75.75 0 0 1 .75-.75m3.97.22a.75.75 0 0 1 1.06 0l2 2a.75.75 0 1 1-1.06 1.06l-.72-.72V20a.75.75 0 0 1-1.5 0v-4.19l-.72.72a.75.75 0 1 1-1.06-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span data-v-caee1139="" className="action-name">
            {t("home.withdraw")}
          </span>
        </div>
      </div>
    </>
  )
}

export default QuickAction