import { BreadcrumbProps, Button, Card, Col, Form, Input, List, message, Modal, notification, Row, Spin, Switch, Tabs, Tag } from 'antd';
import React, { useEffect, useMemo, useState } from 'react'
import { webRoutes } from '../../../routes/web';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BasePageContainer from '../../layout/PageContainer';
import http from '../../../utils/http';
import { apiRoutes } from '../../../routes/api';
import TextArea from 'antd/es/input/TextArea';

const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: webRoutes.users,
      title: <Link to={webRoutes.users}>Users</Link>,
    },
    {
      key: "",
      title: <Link to={"#"}>User Detail</Link>,
    },
  ],
};

const UserDetail = () => {
  const { userId } = useParams()
  const [detail, setDetail] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm();
  const navigate = useNavigate()
  const [openModal, setOpenModal] = useState<{
    title: string,
    isOpen: boolean | false
    updateType: string
  }>({
    title: "",
    isOpen: false,
    updateType: ""
  })

  const getUserDetail = async () => {

    if (!userId) return
    setLoading(true)
    try {
      const res = await http.get(apiRoutes.dataUserDetail(userId))
      if (res && res.data) {
        setDetail(res.data?.data)
        form.setFieldsValue(res.data?.data);
      }
    } catch (error) {
      console.log(error);

    }
    setLoading(false)
  }

  useEffect(() => {
    if (userId)
      getUserDetail()
  }, [userId])


  const getInvest = (status: string) => {
    return detail?.ticketTransactions?.filter(
      (i: any) => i?.transaction_status === status
    ) || [];
  };


  const openConfirmDelete = () => {
    Modal.confirm({
      title: 'Bạn có chắc muốn xoá user này?',
      content: 'Nếu bạn xoá sẽ mất hết dữ liệu và không thể khôi phục',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          const res = await http.post(apiRoutes.updateUser, {
            updateType: 'delete',
            userId
          });
          if (res && res.data) {
            message.success('Xoá thành công');
            navigate("/users");
          }
        } catch (error: any) {
          message.error(error?.response?.data?.message || 'Thử lại sau');
        }
      },
    });
  };


  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <Modal open={openModal.isOpen} centered footer={null} onCancel={() => setOpenModal({
        isOpen: false,
        title: "",
        updateType: ""
      })} title={openModal.title} >


        <Form layout='vertical' className=' py-2' onFinish={async (form) => {
          try {
            const res = await http.post(apiRoutes.updateUser, {
              ...form,
              userId,
              updateType: openModal.updateType
            })
            if (res && res.data) {
              setOpenModal({
                isOpen: false,
                title: "",
                updateType: ""
              })
              getUserDetail()
            }
          } catch (error: any) {
            message.error(error?.response?.data?.message || "Thử lại sau")
          }
        }}
        >
          {
            openModal.updateType === 'deposit' &&
            <>
              <Form.Item name="value" label="Số tiền nạp">
                <Input type='number' size='large' placeholder='Nhập số tiền nạp' />
              </Form.Item>
              <Form.Item name="content" label="Ghi chú">
                <TextArea rows={3} size='large' placeholder='Nhập ghi chú' />
              </Form.Item>
              <Form.Item>
                <Button htmlType='submit' className='w-full bg-green-700 text-[#fff]' size='large' color='primary' >
                  Nạp
                </Button>
              </Form.Item>
            </>
          }

          {
            openModal.updateType === 'withdraw' &&
            <>
              <Form.Item name="value" label="Số tiền rút">
                <Input type='number' size='large' placeholder='Nhập số tiền rút' />
              </Form.Item>
              <Form.Item name="content" label="Ghi chú">
                <TextArea rows={3} size='large' placeholder='Nhập ghi chú' />
              </Form.Item>
              <Form.Item>
                <Button htmlType='submit' className='w-full bg-red-700 text-[#fff]' size='large' color='primary' >
                  Rút
                </Button>
              </Form.Item>
            </>
          }
          {
            openModal.updateType === 'payment' &&

            <List
              itemLayout="horizontal"
              dataSource={detail?.bankList || []}
              renderItem={(i: any) => (
                <List.Item>
                  <Card className='w-full' title={i?.nameBank}>
                    <div className='flex justify-between items-center mb-3'>
                      <p>Số tài khoản</p>
                      <p className='font-[700]'>{i?.numberBank}</p>
                    </div>
                    <div className='flex justify-between items-center mb-3'>
                      <p>Tên chủ thẻ</p>
                      <p className='font-[700]'>{i?.holderName}</p>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          }
          {
            openModal.updateType === 'tickets' &&
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  label: `Gói đang đầu tư`,
                  key: '1',
                  children: <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={getInvest("processing")}
                    renderItem={(item: any) => (
                      <List.Item
                        actions={[<Button key="list-loadmore-edit"
                          onClick={async () => {
                            try {
                              const res = await http.post(apiRoutes.updateUser, {
                                updateType: 'ticket_cancel',
                                userId,
                                ticketId: item?._id
                              });
                              if (res && res.data) {
                                message.success('Cập nhật thành công');
                                getUserDetail()
                              }
                            } catch (error: any) {
                              message.error(error?.response?.data?.message || 'Thử lại sau');
                            }
                          }}

                        >Huỷ gói</Button>]}
                      >
                        <List.Item.Meta
                          title={<div className='font-[700]'>{item?.ticket?.name}</div>}
                          description={
                            <div>
                              <div className='flex justify-between items-center mb-3'>
                                <div>Mã giao dịch</div>
                                <div>{item?._id}</div>
                              </div>
                              <div className='flex justify-between items-center mb-3'>
                                <div>Số tiền đầu tư</div>
                                <div>{item?.value?.toLocaleString()}</div>
                              </div>
                              <div className='flex justify-between items-center mb-3'>
                                <div>Ngày đầu tư</div>
                                <div>{new Date(item?.createdAt)?.toLocaleString()}</div>
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />,
                },
                {
                  label: `Gói đã trả`,
                  key: '2',
                  children: <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={getInvest("finish")}
                    renderItem={(item: any) => (
                      <List.Item

                      >
                        <List.Item.Meta
                          title={<div className='font-[700]'>{item?.ticket?.name}</div>}
                          description={
                            <div>
                              <div className='flex justify-between items-center mb-3'>
                                <div>Mã giao dịch</div>
                                <div>{item?._id}</div>
                              </div>
                              <div className='flex justify-between items-center mb-3'>
                                <div>Số tiền đầu tư</div>
                                <div>{item?.value?.toLocaleString()}</div>
                              </div>
                              <div className='flex justify-between items-center mb-3'>
                                <div>Ngày đầu tư</div>
                                <div>{new Date(item?.createdAt)?.toLocaleString()}</div>
                              </div>
                              <div className='flex justify-between items-center mb-3'>
                                <div>Ngày cập nhât</div>
                                <div>{new Date(item?.updatedAt)?.toLocaleString()}</div>
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />,
                },

              ]}
            />
          }
        </Form>

      </Modal>
      <Spin fullscreen spinning={loading} />
      <Row gutter={[16, 16]} className='mb-3' >
        <Col xs={12} lg={6} >
          <Card title="Thông tin " style={{
            height: "100%"
          }}>
            <div className='flex justify-between items-center mb-4'>
              <h2>Số dư:</h2>
              <h3 className='font-[700]'> {detail?.realBalance?.toLocaleString()}</h3>
            </div>
            <div className='flex justify-between items-center mb-3' >
              <h2>Khoá/Mở tài khoản</h2>
              <Switch
                onChange={async (value) => {
                  try {
                    const res = await http.post(apiRoutes.updateUser, {
                      userId: detail?._id,
                      updateType: 'blockUser',
                      isBlock: value
                    })
                    if (res && res.data) {
                      message.success("Cập nhật tin thành công")
                      getUserDetail()
                    }
                  } catch (error: any) {
                    message.error(error?.response?.data?.message || "Thử lại sau")
                  }
                }}

                checked={detail?.status} checkedChildren="Khoá " unCheckedChildren="Mở" />
            </div>
            <div className='flex justify-between items-center mb-3' >
              <h2>Tk Tester</h2>
              <Switch
                onChange={async (value) => {
                  try {
                    const res = await http.post(apiRoutes.updateUser, {
                      userId: detail?._id,
                      updateType: 'change_tester',
                      isAccountForAdmin: value
                    })
                    if (res && res.data) {
                      message.success("Cập nhật tin thành công")
                      getUserDetail()
                    }
                  } catch (error: any) {
                    message.error(error?.response?.data?.message || "Thử lại sau")
                  }
                }}

                checked={detail?.isAccountForAdmin} checkedChildren="Khoá " unCheckedChildren="Mở" />
            </div>
            <div className='flex justify-between items-center' >
              <h2>Khoá chat</h2>
              <Switch
                onChange={async (value) => {
                  try {
                    const res = await http.post(apiRoutes.updateUser, {
                      userId: detail?._id,
                      updateType: 'lock_chat',
                      isLockChat: value
                    })
                    if (res && res.data) {
                      message.success("Cập nhật tin thành công")
                      getUserDetail()
                    }
                  } catch (error: any) {
                    message.error(error?.response?.data?.message || "Thử lại sau")
                  }
                }}

                checked={detail?.isLockChat} checkedChildren="Khoá" unCheckedChildren="Mở" />
            </div>
          </Card>
        </Col>
        <Col xs={12} lg={6} >
          <Card title="Tổng nạp" style={{
            height: "100%"
          }}>
            <div className='flex justify-between items-center mb-3'>
              <div>Số lần nạp:</div>
              <h3 className='font-[700]'>{detail?.totalDepositTrans}</h3>
            </div>
            <div className='flex justify-between items-center mb-3'>
              <div>Tổng tiền nạp:</div>
              <h3 className='font-[700]'>{detail?.totalDepositValue?.toLocaleString()}</h3>
            </div>
          </Card>
        </Col>
        <Col xs={12} lg={6} >
          <Card title="Tổng rút" style={{
            height: "100%"
          }}>
            <div className='flex justify-between items-center mb-3'>
              <div>Số lần rút:</div>
              <h3 className='font-[700]'>{detail?.totalWithdrawTransactions}</h3>
            </div>
            <div className='flex justify-between items-center mb-3'>
              <div>Tổng tiền rút:</div>
              <h3 className='font-[700]'>{detail?.totalWithdrawValue?.toLocaleString()}</h3>
            </div>
          </Card>
        </Col>
        <Col xs={12} lg={6} >
          <Card title="Tổng giao dịch" style={{
            height: "100%"
          }}>
            <div className='flex justify-between items-center mb-3'>
              <div>Số lần đầu tư:</div>
              <h3 className='font-[700]'>{detail?.totalTicketTransactions}</h3>
            </div>
            <div className='flex justify-between items-center mb-3'>
              <div>Tổng tiền đầu tư:</div>
              <h3 className='font-[700]'>{detail?.totalTicketTransactionsValue?.toLocaleString()}</h3>
            </div>
            <div className='flex justify-between items-center mb-3'>
              <div>Tổng lợi nhuận:</div>
              <h3 className='font-[700]'>{detail?.totalTicketProfitValue?.toLocaleString()}</h3>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className='mb-3' >
        <Col xs={12} lg={6} >
          <Tag
            onClick={() => setOpenModal({
              isOpen: true,
              title: "Nạp tiền",
              updateType: "deposit"
            })}
            color='green-inverse' className='w-full flex justify-center items-center gap-3 font-[700] cursor-pointer text-[15px] p-2'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nạp tiền
          </Tag>

        </Col>
        <Col xs={12} lg={6}>
          <Tag
            onClick={() => setOpenModal({
              isOpen: true,
              title: "Rút tiền tiền",
              updateType: "withdraw"
            })}
            color='red-inverse' className='w-full flex justify-center items-center gap-3 font-[700] cursor-pointer text-[15px] p-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>

            Rút tiền
          </Tag>
        </Col>
        <Col xs={12} lg={6}>
          <Tag

            onClick={() => setOpenModal({
              isOpen: true,
              title: "Thông tin thanh toán",
              updateType: "payment"
            })}
            color='orange-inverse' className='w-full flex justify-center items-center gap-3 font-[700] cursor-pointer text-[15px] p-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
            </svg>
            Ngân hàng
          </Tag>
        </Col>
        <Col xs={12} lg={6}>
          <Tag color='cyan-inverse' className='w-full flex justify-center items-center gap-3 font-[700] cursor-pointer text-[15px] p-2'
            onClick={() => setOpenModal({
              isOpen: true,
              title: "Danh sách gói đầu tư",
              updateType: "tickets"
            })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>

            Đầu tư
          </Tag>
        </Col>
      </Row>
      <Row gutter={[16, 16]} >
        <Col span={24} >
          <Card title={"Thông tin người dùng"}>
            {
              detail &&
              <Form form={form} className='w-full' onFinish={async (form) => {
                try {
                  const res = await http.post(apiRoutes.updateUser, {
                    ...form,
                    userId,
                    updateType: 'info'
                  })
                  if (res && res.data) {
                    message.success("Cập nhật tin thành công")
                    getUserDetail()
                  }
                } catch (error: any) {
                  message.error(error?.response?.data?.message || "Thử lại sau")
                }
              }}>
                <Row gutter={[8, 8]} >
                  <Col xs={24} lg={6}>
                    <Form.Item name="userId" label="ID">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={6}>
                    <Form.Item name="registerIp" label="IP">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={6}>
                    <Form.Item name="uuid" label="UUID">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={6}>
                    <Form.Item name="refCode" label="Mã giới thiệu">
                      <Input disabled />
                    </Form.Item>
                  </Col>

                  <Col xs={24} lg={6}>
                    <Form.Item name="vip" label="Cấp Đại Lý">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={6}>
                    <Form.Item name="farmVip" label="Level Trang Trại">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={6}>
                    <Form.Item name="userName" label="Tên tài khoản">
                      <Input disabled />
                    </Form.Item>
                  </Col>

                  <Col xs={24} lg={6}>
                    <Form.Item name="phone" label="Số điện thoại">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={6}>
                    <Form.Item name="inviteCode" label="Nhập mã mời">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={6}>
                    <Form.Item name="password" label="Mật khẩu đăng nhập"

                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập mật khẩu đăng nhập',
                        },

                      ]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={6}>
                    <Form.Item name="payment_password" label="Mật khẩu giao dịch"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập mật khẩu giao dịch',
                        },

                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={24}>
                    <Form.Item >
                      <div className='flex gap-3 items-center'>
                        <Button
                          htmlType='submit'
                          className='max-w-[300px] w-full bg-blue-700 !hover:bg-blue-700 text-[#fff]' size='large'>
                          Sumit
                        </Button>
                        <Button
                          onClick={() => openConfirmDelete()}
                          className='max-w-[100px] w-full bg-red-700 !hover:bg-blue-700 text-[#fff]' size='large'>
                          Xoá User
                        </Button>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            }

          </Card>
        </Col>

      </Row>
    </BasePageContainer>
  )
}

export default UserDetail