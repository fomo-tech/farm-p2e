import { Drawer, message, notification } from 'antd'
import requestService from 'api/request'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DrawerLang } from './DrawerLang'
import close_icon from 'assets/img_custom/clolor_dialog_close.png'
import useBreakpoint from 'hooks/useBreakpoint'
interface Props {
  setOpen: (val: boolean) => void,
  open: boolean,

}

const SecurityCenter = ({ open, setOpen }: Props) => {
  const { t, i18n } = useTranslation()
  const [openChange, setOpenChange] = useState<string | boolean>(false)
  const breakpoint = useBreakpoint()
  const [openLang, setOpenLang] = useState(false)
  const [shopPasss, setShowPass] = useState(false)
  const { register, handleSubmit, watch, control, reset, setValue, formState: { errors } } = useForm<{
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  }>({
  });

  const newPassword = watch("newPassword");

  const onChangePassWord: SubmitHandler<{
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  }> = async (data) => {
    try {
      const res = await requestService.post('/profile/update-password', {
        data: {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
          type: openChange
        }
      })
      if (res && res.data) {
        notification.success({
          message: "Updated",
          duration: 2,
          placement: "top"
        })
        reset()
        setOpenChange(false)
      }
    } catch (error: any) {
      setOpenChange(false)
      notification.warning({
        message: error?.response?.data?.message,
        description: 3
      })
    }

  }
  return (
    <>
      <Drawer
        open={!!openChange}
        onClose={() => setOpenChange(false)}
        placement={breakpoint === 'mobile' ? 'bottom' : 'right'}
        height={"auto"}
        width={"100rem"}
        zIndex={999999}
        className='security'
        closeIcon={false}
        title={
          <div className='flex justify-between'>
            <div className='cursor-pointer ' onClick={() => {
              setOpenChange(false)
            }}>
              {
                openChange === 'pass_login' && t("modify login password")
              }
              {
                openChange === 'pass_payment' && t("modify payment password")
              }
            </div>
            <div className='cursor-pointer' onClick={() => {
              setOpenChange(false)
              reset()

            }}>
              <img src={close_icon} width={30} />

            </div>
          </div>
        }
      >

        <div data-v-631327fb="" className="password-popup">
          <div data-v-631327fb="" className="popup-content">
            <form data-v-631327fb="" className="van-form" onSubmit={handleSubmit(onChangePassWord)}>
              <div data-v-631327fb="" className="van-cell-group van-cell-group--inset">
                <div data-v-631327fb="" className="van-cell van-field">
                  {/**/}
                  <div className="van-cell__title van-field__label">
                    <label
                      id="van-field-1-label"
                      htmlFor="van-field-1-input"
                      data-allow-mismatch="attribute"
                    >
                      {t("Old password")}
                    </label>
                    {/**/}
                  </div>
                  <div className="van-cell__value van-field__value">
                    <div className="van-field__body">
                      <input
                        type={shopPasss ? "text" : "password"}
                        id="van-field-1-input"
                        className="van-field__control"
                        placeholder={t("please enter the original password")}
                        aria-labelledby="van-field-1-label"
                        inputMode={openChange === "pass_payment" ? "numeric" : undefined}
                        pattern={openChange === "pass_payment" ? "[0-9]*" : undefined}
                        data-allow-mismatch="attribute"
                        {...register("oldPassword", {
                          required: t("Please enter the old password"),
                          pattern: openChange === "pass_payment" ? {
                            value: /^[0-9]*$/,
                            message: t("Only numbers are allowed")
                          } : undefined,
                        })}
                      />
                      {/**/}
                      <div className="van-field__right-icon" onClick={() => setShowPass(!shopPasss)}>
                        {
                          shopPasss ?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            :

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        }


                      </div>
                      {/**/}
                    </div>
                    {/**/}
                    {/**/}
                  </div>
                  {/**/}
                  {/**/}
                </div>
                {errors.oldPassword && <p className='pl-2 text-red-600 text-[3rem]'>{errors.oldPassword.message}</p>}
                <div data-v-631327fb="" className="van-cell van-field">
                  {/**/}
                  <div className="van-cell__title van-field__label">
                    <label
                      id="van-field-2-label"
                      htmlFor="van-field-2-input"
                      data-allow-mismatch="attribute"
                    >
                      {t("New Password")}
                    </label>
                    {/**/}
                  </div>
                  <div className="van-cell__value van-field__value">
                    <div className="van-field__body">
                      <input
                        type={shopPasss ? "text" : "password"}
                        id="van-field-2-input"
                        className="van-field__control"
                        placeholder={t("please enter the new password")}
                        aria-labelledby="van-field-2-label"
                        data-allow-mismatch="attribute"
                        inputMode={openChange === "pass_payment" ? "numeric" : undefined}
                        pattern={openChange === "pass_payment" ? "[0-9]*" : undefined}
                        {...register("newPassword", {
                          required: t("Please enter the newPassword"),
                          pattern: openChange === "pass_payment" ? {
                            value: /^[0-9]*$/,
                            message: t("Only numbers are allowed")
                          } : undefined,
                          validate: value => {
                            if (openChange === "pass_payment" && value.length !== 6) {
                              return t("Password must be at exactly 6 characters");
                            }
                            if (openChange !== "pass_payment" && value.length > 10) {
                              return t("Password must be at most 10 characters");
                            }
                            return true;
                          }
                        })}

                      />
                      {/**/}
                      {/**/}
                      {/**/}
                    </div>
                    {/**/}
                    {/**/}
                  </div>
                  {/**/}
                  {/**/}
                </div>
                {errors.newPassword && <p className='pl-2 text-red-600 text-[3rem]'>{errors.newPassword.message}</p>}

                <div data-v-631327fb="" className="van-cell van-field">
                  {/**/}
                  <div className="van-cell__title van-field__label">
                    <label
                      id="van-field-3-label"
                      htmlFor="van-field-3-input"
                      data-allow-mismatch="attribute"
                    >
                      {t("confirm password")}
                    </label>
                    {/**/}
                  </div>
                  <div className="van-cell__value van-field__value">
                    <div className="van-field__body">
                      <input
                        type={shopPasss ? "text" : "password"}
                        maxLength={openChange === "pass_payment" ? 6 : undefined}
                        id="van-field-3-input"
                        className="van-field__control"
                        inputMode={openChange === "pass_payment" ? "numeric" : undefined}
                        pattern={openChange === "pass_payment" ? "[0-9]*" : undefined}
                        placeholder={t("please enter the new password again")}
                        aria-labelledby="van-field-3-label"
                        data-allow-mismatch="attribute"
                        {...register("confirmPassword", {
                          required: t("Please enter the confirmPassword"),
                          pattern: openChange === "pass_payment" ? {
                            value: /^[0-9]*$/,
                            message: t("Only numbers are allowed")
                          } : undefined,
                          validate: value =>
                            value === newPassword || t("Passwords do not match"),
                        })}
                      />
                      {/**/}
                      {/**/}
                      {/**/}
                    </div>
                    {/**/}
                    {/**/}
                  </div>
                  {/**/}
                  {/**/}
                </div>
                {errors.confirmPassword && <p className='pl-2 text-red-600 text-[3rem]'>{errors.confirmPassword.message}</p>}

              </div>
              <div data-v-631327fb="" className="submit-section">
                <button
                  data-v-631327fb=""
                  type="submit"
                  className="w-full text-[#fff] van-button van-button--primary van-button--normal van-button--block"
                >
                  <div className="van-button__content">
                    {/**/}
                    <span className="van-button__text">Save</span>
                    {/**/}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>



      </Drawer >
      <Drawer
        title={
          <div className='text-center'>
            {t("Security Center")}
          </div>
        }
        placement={'right'}
        style={{
          background: "#fff"
        }}
        closable={true}
        closeIcon={
          <img src={close_icon} width={50} />
        }
        onClose={() => setOpen(false)}
        width="100rem"
        open={open}

      >

        <div data-v-631327fb="" className="page-content">
          <div data-v-631327fb="" className="security-list">
            <div data-v-631327fb="" className="security-item" onClick={() => setOpenChange("pass_login")}>
              <div data-v-631327fb="" className="item-left">
                <img src="https://img.icons8.com/?size=100&id=63686&format=png&color=000000" width={40} />
                <div data-v-631327fb="" className="item-info">
                  <span data-v-631327fb="" className="title">
                    {t("login password")}
                  </span>
                  <span data-v-631327fb="" className="desc">
                    {t("for account login")}
                  </span>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>

            </div>
            <div data-v-631327fb="" className="security-item" onClick={() => setOpenChange("pass_payment")}>
              <div data-v-631327fb="" className="item-left">
                <img src="https://img.icons8.com/?size=100&id=12324&format=png&color=000000" width={40} />
                <div data-v-631327fb="" className="item-info">
                  <span data-v-631327fb="" className="title">
                    {t("Payment password")}
                  </span>
                  <span data-v-631327fb="" className="desc">
                    {t("Used for fund-related operations")}
                  </span>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>

            </div>
            <div data-v-631327fb="" className="security-item" onClick={() => setOpenLang(true)}>
              <div data-v-631327fb="" className="item-left">
                <img src="https://img.icons8.com/?size=100&id=KniCOB9YDHbU&format=png&color=000000" width={40} />
                <div data-v-631327fb="" className="item-info">
                  <span data-v-631327fb="" className="title">
                    {t("Ngôn ngữ")}
                  </span>
                  <span data-v-631327fb="" className="desc">
                    {
                      i18n.language === 'vi' &&
                      <span data-v-4f0a6390="" className="action-value">
                        Tiếng Việt
                      </span>
                    }
                    {
                      i18n.language === 'en' &&
                      <span data-v-4f0a6390="" className="action-value">
                        English
                      </span>
                    }
                    {
                      i18n.language === 'zh' &&
                      <span data-v-4f0a6390="" className="action-value">
                        中文
                      </span>
                    }
                    <i
                      data-v-4f0a6390=""
                      className="van-badge__wrapper van-icon van-icon-arrow"
                    >

                    </i>
                  </span>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>

            </div>
          </div>
        </div>

      </Drawer>

      <DrawerLang openLang={openLang} setOpenLang={setOpenLang} />
    </>

  )
}

export default SecurityCenter