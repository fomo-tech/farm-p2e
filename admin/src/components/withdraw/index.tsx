import {
  ActionType,
  ProTable,
  ProColumns,
  RequestData,
  TableDropdown,
  ProDescriptions,
} from '@ant-design/pro-components';
import { Avatar, BreadcrumbProps, Input, Modal, Space, Tag } from 'antd';
import { useRef } from 'react';
import { FiUsers } from 'react-icons/fi';
import { CiCircleMore } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { User } from '../../interfaces/models/user';
import { apiRoutes } from '../../routes/api';
import { webRoutes } from '../../routes/web';
import QRCode from 'react-qr-code'
import {
  handleErrorResponse,
  NotificationType,
  showNotification,
} from '../../utils';
import http from '../../utils/http';
import BasePageContainer from '../layout/PageContainer';
import LazyImage from '../lazy-image';
import Icon, {
  ExclamationCircleOutlined,
  DeleteOutlined,
  UserOutlined,
  WalletOutlined,
  HighlightOutlined,
} from '@ant-design/icons';
import { MdAdd, MdMoney, MdOutlineCancel, MdOutlineDone, MdPayment, MdVerifiedUser, MdWallet } from 'react-icons/md';
import { AiOutlineDownCircle } from 'react-icons/ai';


const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
    },
    {
      key: webRoutes.deposit,
      title: <Link to={webRoutes.withdraw}>Withdraw</Link>,
    },
  ],
};

const Withdraw = () => {
  const actionRef = useRef<ActionType>();
  const [modal, modalContextHolder] = Modal.useModal();

  const columns: ProColumns[] = [
    {

      title: 'User ID',
      dataIndex: 'userId',
      align: 'center',
      sorter: false,
      render: (userId, row: any) => (
        <div className='flex flex-col gap-1'>
          <div className='flex gap-2'>
            <label>ID GD:</label>
            <div className='font-[700]'>{row?._id}</div>
          </div>
          <div className='flex gap-2'>
            <label>User ID:</label>
            <div>{row?.user?.userId}</div>
          </div>
          <div className='flex gap-2'>
            <label>SĐT:</label>
            <div>{row?.user?.phone}</div>
          </div>
          <div className='flex gap-2'>
            <label>IP:</label>
            <div className='font-[500]'>{row?.user?.registerIp}</div>
          </div>
          <div className='flex gap-2'>
            <label>Số dư:</label>
            <div>{row?.user?.realBalance?.toLocaleString()}</div>
          </div>
          <div className='flex gap-2'>
            <label>Ngày rút:</label>
            <div>{new Date(row?.createdAt)?.toLocaleString()}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Thông tin',
      dataIndex: 'phone',
      align: 'center',
      sorter: false,
      render: (userId, row: any) => {
        const bankInfo = row && JSON.parse(row?.paymentMethod || "{}")
        return (
          <div className='flex flex-col gap-1'>
            <div className='flex gap-2'>
              <label>Tên Ngân Hàng:</label>
              <div className='font-[700]'>{bankInfo?.nameBank}</div>
            </div>
            <div className='flex gap-2'>
              <label>Tên Chủ Thẻ:</label>
              <div className='font-[700]'>{bankInfo?.holderName}</div>
            </div>
            <div className='flex gap-2'>
              <label>STK:</label>
              <div className='font-[700]'>{bankInfo?.numberBank}</div>
            </div>
            <div className='flex gap-2'>
              <label>Số lượng ($):</label>
              <div>{row?.value}$ </div>
            </div>
            <div className='flex gap-2'>
              <label>Số tiền :</label>
              <div>{bankInfo?.nameBank === 'BEP20' ?
                row?.fiat_amount + "$"
                : Number(row?.fiat_amount?.toFixed(0)) + "vnđ"}  </div>
            </div>
            <div className='flex gap-2'>
              <label>Biến động :</label>
              <div>{Number(row?.currentBalanceUser?.toFixed(3))}$</div>
            </div>
          </div>
        )
      }
    },
    {
      title: 'Thông tin',
      dataIndex: 'phone',
      align: 'center',
      sorter: false,
      render: (userId, row: any) => {
        const bankInfo = row && JSON.parse(row?.paymentMethod || "{}")
        if (bankInfo?.nameBank !== 'BEP20')
          return (
            <div className='w-[300px]'>
              <img src={`https://img.vietqr.io/image/${bankInfo?.nameBank}-${bankInfo?.numberBank}-compact2.png?amount=${Number(row?.fiat_amount?.toFixed(0))}&accountName=${bankInfo.holderName}`} width={250} />
            </div>
          )
        return (
          <div className='w-[150px]'>
            <QRCode
              size={150}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={`${bankInfo?.numberBank}`}
              viewBox={`0 0 150 150`}
            />
          </div>
        )
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: '_id',
      align: 'center',
      sorter: false,
      render: (userId, row: any) => (
        <div className='flex flex-col gap-1'>
          {
            row?.transaction_status === 'pending' && <Tag className='text-center' color='orange-inverse'>Đang chờ</Tag>
          }
          {
            row?.transaction_status === 'cancel' && <Tag className='text-center' color='red-inverse'>Đã huỷ</Tag>
          }
          {
            row?.transaction_status === 'finish' && <Tag className='text-center' color='green-inverse'>Đã giải quyết</Tag>
          }
        </div>
      )
    },
    {
      title: 'Note',
      dataIndex: '_id',
      align: 'center',
      sorter: false,
      render: (userId, row: any) => (
        <div>
          {row?.note}
        </div>
      )
    },

    {
      title: 'Action',
      align: 'center',
      key: 'option',
      fixed: 'right',
      render: (_, row: User) => [
        <TableDropdown
          key="actionGroup"
          onSelect={(key) => handleActionOnSelect(key, row)}
          menus={[
            {
              key: "finish",
              name: (
                <Space>
                  <AiOutlineDownCircle />
                  Xác nhận
                </Space>
              ),
            },
            {
              key: "cancel",
              name: (
                <Space>
                  <MdOutlineCancel />
                  Huỷ
                </Space>
              ),
            },

          ]}
        >
          <Icon component={CiCircleMore} className="text-primary text-xl" />
        </TableDropdown>,
      ],
    },
  ];

  const handleActionOnSelect = (key: string, transaction: any) => {
    showConfirmation(key, transaction);
  };


  const showConfirmation = (key: string, transaction: any) => {
    let reason = '';

    modal.confirm({
      title: 'Bạn có chắc thay đổi',
      icon: <ExclamationCircleOutlined />,
      content: key === 'cancel' ? (
        <div>
          <p>Nhập lý do huỷ:</p>
          <Input
            placeholder="Lý do huỷ"
            onChange={(e) => {
              reason = e.target.value;
            }}
          />
        </div>
      ) : null,
      okButtonProps: {
        className: 'bg-primary',
      },
      onOk: () => {
        if (key === 'cancel' && !reason) {
          showNotification('Lỗi', NotificationType.ERROR, 'Vui lòng nhập lý do huỷ');
          return Promise.reject(); // chặn đóng modal nếu không có lý do
        }

        return http
          .post(`${apiRoutes.handleTransaction}`, {
            transaction_id: transaction._id,
            typeResolve: key,
            reason: key === 'cancel' ? reason : undefined,
          })
          .then(() => {
            showNotification('Thành công', NotificationType.SUCCESS, 'Đã thay đổi thành công');
            actionRef.current?.reloadAndRest?.();
          })
          .catch((error) => {
            handleErrorResponse(error);
          });
      },
    });
  };
  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <ProTable
        columns={columns}
        cardBordered={false}
        cardProps={{
          subTitle: 'Users',
          tooltip: {
            className: 'opacity-60',
            title: 'Mocked data',
          },
          title: <FiUsers className="opacity-60" />,
        }}
        bordered={true}
        showSorterTooltip={false}
        scroll={{ x: true }}
        tableLayout={'fixed'}
        rowSelection={false}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        actionRef={actionRef}
        request={(params) => {
          return http
            .get(apiRoutes.transaction, {
              params: {
                page: params.current,
                per_page: params.pageSize,
                search: params.keyword,
                transaction_type: "withdraw",
                status: true
              },
            })
            .then((response) => {
              const trasactions: [User] = response.data.data?.trasactions;

              return {
                data: trasactions,
                success: true,
                total: response.data?.data?.total,
              } as RequestData<User>;
            })
            .catch((error) => {
              handleErrorResponse(error);

              return {
                data: [],
                success: false,
              } as RequestData<User>;
            });
        }}
        dateFormatter="string"
        search={false}
        rowKey="_id"
        options={{
          search: {
            placeholder: 'Tìm kiếm theo ,UserID,Phone',
            width: 200,
            allowClear: true,
          },
        }}
      />
      {modalContextHolder}
    </BasePageContainer>
  );
};

export default Withdraw;
