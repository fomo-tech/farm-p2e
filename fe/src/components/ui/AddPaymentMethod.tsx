import { Avatar, Drawer, List, message, Modal, notification, Popover, Tabs, Typography } from 'antd'
import requestService from 'api/request';
import clsx from 'clsx';
import { formatAddress } from 'lib/helpers';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuthApp } from 'store/useAuthApp';
import { useGlobalAppStore } from 'store/useGlobalApp';


interface Props {
  setOpen: (val: boolean) => void,
  open: boolean
}

interface IFormInput {
  nameBank: string;
  numberBank: string;
  holderName: string
}
export const AddPaymentMethod = ({ open, setOpen }: Props) => {
  const { i18n, t } = useTranslation();
  const [openSelectBank, setOpenSelectbank] = useState(false)
  const { user } = useAuthApp()
  const { configApp, handleLoading, handleCallbackUser } = useGlobalAppStore()
  const { register, handleSubmit, watch, control, setValue, reset, formState: { errors } } = useForm<IFormInput>({
  });
  const [tab, setTab] = useState("crypto")

  const onChange = (key: string) => {
    setTab(key);
  };

  const onSubmitBanking: SubmitHandler<IFormInput> = async (data) => {
    handleLoading(true)
    try {
      const res = await requestService.post('/profile/method-payment', {
        data: {
          ...data
        }
      })

      if (res && res.data) {
        handleCallbackUser()
        reset()
      }
    } catch (error: any) {
      notification.error({
        message: error.response?.data?.message,
        duration: 3
      })
    }
    handleLoading(false)
  }


  const onSubmitAddressWallet: SubmitHandler<IFormInput> = async (data) => {
    handleLoading(true)
    try {
      const res = await requestService.post('/profile/method-payment', {
        data: {
          nameBank: "BEP20",
          numberBank: data.numberBank,
          holderName: "Crypto"
        }
      })

      if (res && res.data) {
        handleCallbackUser()
        reset()
      }
    } catch (error: any) {
      notification.error({
        message: error.response?.data?.message,
        duration: 3
      })

    }
    handleLoading(false)
  }

  const handleDeleteMethod = async (item: any) => {
    try {
      const res = await requestService.delete('/profile/method-payment', {
        data: {
          ...item
        }
      })
      if (res && res.data) {
        handleCallbackUser()
      }
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  }

  return (
    <>
      <Drawer
        open={openSelectBank}
        placement='bottom'
        height={"40vh"}
        width={"100rem"}
        zIndex={9999}
        closeIcon={false}
        title={
          <div className='flex justify-between'>
            <div className='cursor-pointer text-[#ccc]' onClick={() => {
              setOpenSelectbank(false)
              setValue('nameBank', "")
            }}>
              Cancel
            </div>
            <div className='cursor-pointer van-picker__confirm' onClick={() => {
              setOpenSelectbank(false)
            }}>
              Confirm
            </div>
          </div>
        }
      >
        <List
          header={null}
          footer={null}

          dataSource={configApp?.bankList || []}
          renderItem={(item: any) => (
            <List.Item onClick={() => {
              setValue('nameBank', item?.short_name)
              setOpenSelectbank(false)
            }
            }>
              <List.Item.Meta
                avatar={<img width={80} src={item?.logo} />}
                title={item?.short_name}
                description={item?.name}
              />
              {/* <div className='w-full flex-col'>
                                <div className='text-center w-full cursor-pointer'>
                                    {item?.name}
                                </div>
                                <div className='text-center w-full cursor-pointer'>
                                    {item?.short_name}
                                </div>
                            </div> */}
            </List.Item>
          )}
        />
      </Drawer>

      <Drawer
        title={
          <div className='text-center'>
            Thông tin thanh toán
          </div>
        }
        placement={'right'}
        width={"100rem"}
        closable={true}
        closeIcon={
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 hover:text-[#000]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>


          </div>
        }
        onClose={() => setOpen(false)}

        open={open}

      >
        <div data-v-1ad66f02="" className="bank-page mt-0">

          <div data-v-1ad66f02="" className="bank-list">
            {
              user && user?.bankList?.length > 0 &&
              user.bankList.map((i, index) => (
                <div data-v-1ad66f02="" className="bank-item">
                  <div data-v-1ad66f02="" className="bank-info">
                    <div data-v-1ad66f02="" className="info-row">
                      {
                        i?.nameBank === 'BEP20' ?
                          <Popover trigger={'click'} content={i.numberBank}>
                            <span data-v-1ad66f02="" className="value">
                              {formatAddress(i.numberBank)} ({i.nameBank})
                            </span>
                          </Popover>

                          :
                          <span data-v-1ad66f02="" className="value">
                            {i.numberBank} ({i.nameBank})
                          </span>
                      }

                    </div>
                  </div>
                  <div data-v-1ad66f02="" className="bank-actions">
                    <button
                      onClick={() => handleDeleteMethod(i)}
                      data-v-1ad66f02=""
                      type="button"
                      className="van-button van-button--danger van-button--small van-button--round"
                    >
                      <div className="van-button__content">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-red-600 cursor-pointer">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>

                      </div>
                    </button>
                  </div>
                </div>
              ))
            }


          </div>

          <div data-v-1ad66f02="" className="add-bank-form">
            <div data-v-1ad66f02="" className="form-title">
              {t("Add New Account")}
            </div>
            <Tabs
              onChange={onChange}
              items={[

                // {
                //   label: "Banking",
                //   children: tab === 'banking' &&
                //     <form data-v-1ad66f02="" className="van-form" onSubmit={handleSubmit(onSubmitBanking)}>
                //       <div data-v-1ad66f02="" className="van-cell van-field">
                //         {/**/}
                //         <div className="van-cell__title van-field__label">
                //           <label
                //             id="van-field-26-label"
                //             htmlFor="van-field-26-input"
                //             data-allow-mismatch="attribute"
                //           >
                //             {t("holderName")}
                //           </label>
                //           {/**/}
                //         </div>
                //         <div className="van-cell__value van-field__value">
                //           <div className="van-field__body">
                //             <input
                //               type="text"
                //               id="van-field-26-input"
                //               className="van-field__control"
                //               placeholder={t("Enter your name")}
                //               aria-labelledby="van-field-26-label"
                //               data-allow-mismatch="attribute"
                //               {...register("holderName", {
                //                 required: t("field_required"),

                //               })}
                //             />
                //           </div>

                //         </div>

                //       </div>
                //       {errors.holderName && <p className='pl-2 text-red-600 text-[2.5rem]'>{errors.holderName.message}</p>}
                //       <div
                //         data-v-1ad66f02=""
                //         className="van-cell van-cell--clickable van-field"
                //         role="button"
                //         tabIndex={0}
                //       >
                //         {/**/}
                //         <div className="van-cell__title van-field__label">
                //           <label
                //             id="van-field-28-label"
                //             htmlFor="van-field-28-input"
                //             data-allow-mismatch="attribute"
                //           >
                //             {t("nameBank")}
                //           </label>
                //           {/**/}
                //         </div>
                //         <div className="van-cell__value van-field__value">
                //           <div className="van-field__body">
                //             <input
                //               type="text"
                //               id="van-field-28-input"
                //               className="van-field__control"
                //               readOnly
                //               onClick={() => setOpenSelectbank(true)}
                //               placeholder={t("Click to select bank")}
                //               aria-labelledby="van-field-28-label"
                //               data-allow-mismatch="attribute"
                //               {...register("nameBank", {
                //                 required: t("field_required"),

                //               })}
                //             />

                //           </div>

                //         </div>
                //         <i className="van-badge__wrapper van-icon van-icon-arrow van-cell__right-icon">

                //         </i>

                //       </div>
                //       {errors.nameBank && <p className='pl-2 text-red-600 text-[2.5rem]'>{errors.nameBank.message}</p>}
                //       <div data-v-1ad66f02="" className="van-cell van-field">

                //         <div className="van-cell__title van-field__label">
                //           <label
                //             id="van-field-29-label"
                //             htmlFor="van-field-29-input"
                //             data-allow-mismatch="attribute"
                //           >
                //             {t("numberBank")}
                //           </label>
                //           {/**/}
                //         </div>
                //         <div className="van-cell__value van-field__value">
                //           <div className="van-field__body">
                //             <input
                //               type="text"
                //               id="van-field-29-input"
                //               className="van-field__control"
                //               placeholder={t("Enter Bank Account Number")}
                //               aria-labelledby="van-field-29-label"
                //               data-allow-mismatch="attribute"
                //               {...register("numberBank", {
                //                 required: t("field_required"),

                //               })}
                //             />

                //           </div>

                //         </div>
                //       </div>
                //       {errors.numberBank && <p className='pl-2 text-red-600 text-[2.5rem]'>{errors.numberBank.message}</p>}

                //       <div data-v-1ad66f02="" className="submit-btn">
                //         <button
                //           data-v-1ad66f02=""
                //           type="submit"
                //           className=" w-full text-[#fff] rounded-[20px] van-button van-button--primary van-button--normal van-button--block van-button--round"
                //         >
                //           <div className="van-button__content">
                //             {/**/}
                //             <span className="van-button__text">
                //               {t("Thêm thanh toán")}
                //             </span>
                //             {/**/}
                //           </div>
                //         </button>
                //       </div>
                //     </form>,
                //   key: "banking"
                // },
                {
                  label: "BEP 20",
                  children: tab === 'crypto' && (
                    <form data-v-1ad66f02="" className="van-form" onSubmit={handleSubmit(onSubmitAddressWallet)}>

                      <div data-v-1ad66f02="" className="van-cell van-field">

                        <div className="van-cell__title van-field__label">
                          <label
                            id="van-field-29-label"
                            htmlFor="van-field-29-input"
                            data-allow-mismatch="attribute"
                          >
                            {t("Address")}
                          </label>
                          {/**/}
                        </div>
                        <div className="van-cell__value van-field__value">
                          <div className="van-field__body">
                            <input
                              type="text"
                              id="van-field-29-input"
                              className="van-field__control"
                              placeholder={t("Nhập địa chỉ ví BEP20")}
                              aria-labelledby="van-field-29-label"
                              data-allow-mismatch="attribute"
                              {...register("numberBank", {
                                required: t("field_required"),

                              })}
                            />

                          </div>

                        </div>

                      </div>
                      {errors.numberBank && <p className='pl-2 text-red-600 text-[2.5rem]'>{errors.numberBank.message}</p>}
                      <div data-v-1ad66f02="" className="submit-btn">
                        <button
                          data-v-1ad66f02=""
                          type="submit"
                          className=" w-full text-[#fff] rounded-[20px] van-button van-button--primary van-button--normal van-button--block van-button--round"
                        >
                          <div className="van-button__content">
                            {/**/}
                            <span className="van-button__text">
                              {t("Thêm thanh toán")}
                            </span>
                            {/**/}
                          </div>
                        </button>
                      </div>
                    </form>

                  ),
                  key: "crypto"
                },
                {
                  label: "Local Banking",
                  children: <div className=''>Coming Soon</div>,
                  key: "banking"
                },
              ]}
            />

          </div>
        </div>


      </Drawer>
    </>
  )

}
