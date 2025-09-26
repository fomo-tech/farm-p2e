/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  ActionType,
  ProTable,
  ProColumns,
  RequestData,
  TableDropdown,
  ProDescriptions,
} from '@ant-design/pro-components';
import { Avatar, BreadcrumbProps, Card, Modal, Space, Tag, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import { CiCircleMore } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { User } from '../../interfaces/models/user';
import { apiRoutes } from '../../routes/api';
import { webRoutes } from '../../routes/web';
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
      title: <Link to={webRoutes.historyUser}>History</Link>,
    },
  ],
};

const HistoryUser = () => {
  const actionRef = useRef<ActionType>();
  const [modal, modalContextHolder] = Modal.useModal();
  const [data, setData] = useState<any>()

  const transactionTypeTags: Record<string, { text: string; color: string }> = {
    reward_refferal: { text: 'Thưởng giới thiệu', color: 'cyan-inverse' },
    withdraw: { text: 'Rút tiền', color: 'red-inverse' },
    deposit: { text: 'Nạp tiền', color: 'geekblue-inverse' },
    checkin: { text: 'Điểm danh', color: 'red-inverse' },
    reward_draw: { text: 'Vòng quay may mắn', color: 'green-inverse' },
    reward_mine: { text: 'Đi tìm kho báu', color: 'gold-inverse' },
    LIXI_MOI_NGAY: { text: 'Lì xì', color: 'volcano-inverse' },
  };

  const transactionStatusTags: Record<string, { text: string; color: string }> = {
    pending: { text: 'Đang chờ', color: 'orange-inverse' },
    cancel: { text: 'Đã huỷ', color: 'red-inverse' },
    finish: { text: 'Hoàn thành', color: 'green-inverse' },
  };

  const noteMap: Record<string, string> = {
    Lucky_Clover: 'Chúc may mắn',
    Robot_Part: '+2 lượt',
    x1_duck: '+1 mảnh vịt',
    x2_duck: '+2 mảnh vịt',
    x5_duck: '+5 mảnh vịt',
  };



  const labelStyle = "font-semibold text-gray-600";
  const valueStyle = "font-medium text-gray-800";

  const columns: ProColumns[] = [
    {
      title: 'Thông tin người dùng',
      dataIndex: 'userId',
      align: 'center',
      render: (_, row: any) => {
        const {
          _id,
          user,
          createdAt
        } = row || {};
        return (
          <div className="p-3 bg-white rounded-md shadow-sm space-y-2 text-sm text-left">
            <div className="flex justify-between">
              <span className={labelStyle}>ID:</span>
              <span className={valueStyle}>{_id || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className={labelStyle}>User ID:</span>
              <span className={valueStyle}>{user?.userId || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className={labelStyle}>Username:</span>
              <span className={valueStyle}>{user?.phone || '-'}</span>
            </div>
            <div className="flex justify-between">
              <Tooltip title="IP đăng ký">
                <span className={labelStyle + " cursor-help"}>IP:</span>
              </Tooltip>
              <span className={valueStyle}>{user?.registerIp || '-'}</span>
            </div>
            <div className="flex justify-between">
              <Tooltip title="Số dư hiện tại">
                <span className={labelStyle + " cursor-help"}>Số dư:</span>
              </Tooltip>
              <span
                className={`font-semibold ${user?.realBalance >= 5 ? 'text-red-600' : 'text-gray-800'}`}
              >
                {(user?.realBalance ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={labelStyle}>Ngày GD:</span>
              <span className={valueStyle}>{createdAt ? new Date(createdAt).toLocaleString() : '-'}</span>
            </div>
          </div>
        );
      }
    },
    {
      title: 'Chi tiết giao dịch',
      dataIndex: 'transaction_type',
      align: 'center',
      render: (_, row: any) => {
        const {
          transaction_type,
          paymentMethod,
          value,
          fiat_amount,
          currentBalanceUser,
          user
        } = row || {};
        const valUSD = Number(value?.toFixed(5)) || 0;
        const valVND = fiat_amount?.toLocaleString() || '0';

        if (transaction_type === 'withdraw') {
          const bankInfo = paymentMethod ? JSON.parse(paymentMethod) : {};
          return (
            <div className="p-3 bg-white rounded-md shadow-sm space-y-2 text-sm text-left">
              <div className="flex justify-between"><span className={labelStyle}>Ngân hàng:</span> <span className={valueStyle}>{bankInfo?.nameBank || '-'}</span></div>
              <div className="flex justify-between"><span className={labelStyle}>Chủ thẻ:</span> <span className={valueStyle}>{bankInfo?.holderName || '-'}</span></div>
              <div className="flex justify-between"><span className={labelStyle}>STK:</span> <span className={valueStyle}>{bankInfo?.numberBank || '-'}</span></div>
              <div className="flex justify-between"><span className={labelStyle}>Số lượng ($):</span> <span className="font-bold text-indigo-600">{valUSD}$</span></div>
              <div className="flex justify-between"><span className={labelStyle}>Số tiền:</span> <span>{bankInfo?.nameBank === 'BEP20' ? fiat_amount + '$' : Number(fiat_amount?.toFixed(0)) + ' vnđ'}</span></div>
              <div className="flex justify-between"><span className={labelStyle}>Biến động (vnđ):</span> <span className="font-bold text-indigo-600">{Number(currentBalanceUser?.toFixed(4))}$</span></div>
            </div>
          );
        }

        if (transaction_type === 'deposit') {

          return (
            <div className="p-3 bg-white rounded-md shadow-sm space-y-2 text-sm text-left">
              <div className="flex justify-between"><span className={labelStyle}>Cổng thanh toán:</span> <span className={valueStyle}>{paymentMethod}</span></div>
              <div className="flex justify-between"><span className={labelStyle}>Số lượng ($):</span> <span className="font-bold text-indigo-600">{valUSD}$</span></div>
              <div className="flex justify-between"><span className={labelStyle}>Số tiền (vnđ):</span> <span>{valVND} vnđ</span></div>
              <div className="flex justify-between"><span className={labelStyle}>Biến động (vnđ):</span> <span className="font-bold text-indigo-600">{Number(currentBalanceUser?.toFixed(4))}$</span></div>
              <div className="flex justify-between"><span className={labelStyle}>Ví nhận:</span> <span className="font-bold text-indigo-600">{row?.walletDeposit}</span></div>
            </div>
          );
        }

        // Các loại khác
        return (
          <div className="p-3 bg-white rounded-md shadow-sm space-y-2 text-sm text-left">
            <div className="flex justify-between"><span className={labelStyle}>Số lần checkin:</span> <span>{user?.checkinToday ?? 0}</span></div>
            <div className="flex justify-between"><span className={labelStyle}>Số lượng ($):</span> <span className="font-bold text-indigo-600">{valUSD}$</span></div>
            <div className="flex justify-between"><span className={labelStyle}>Số tiền (vnđ):</span> <span>{valVND} vnđ</span></div>
            <div className="flex justify-between"><span className={labelStyle}>Biến động:</span> <span className="font-bold text-indigo-600">{Number(currentBalanceUser?.toFixed(4))}$</span></div>
            <div className="flex justify-between"><span className={labelStyle}>Số lần checkin:</span> <span>{user?.checkInToday ?? 0}</span></div>
            <div className="flex justify-between"><span className={labelStyle}>Số lần tìm kho báu:</span> <span>{user?.mineNum ?? 0}</span></div>
            <div className="flex justify-between"><span className={labelStyle}>Số ticket:</span> <span>{user?.duckSticker ?? 0}</span></div>
          </div>
        );
      }
    },
    {
      title: 'Loại GD',
      dataIndex: 'transaction_type',
      filters: [
        { text: 'Thưởng giới thiệu', value: 'reward_refferal' },
        { text: 'Rút tiền', value: 'withdraw' },
        { text: 'Nạp tiền', value: 'deposit' },
        { text: 'Điểm danh', value: 'checkin' },
        { text: 'Vòng quay', value: 'reward_draw' },
        { text: 'Kho báu', value: 'reward_mine' },
        { text: 'Lì xì', value: 'LIXI_MOI_NGAY' },
        { text: 'Nhận thưởng đại lý', value: 'reward_vip' },
      ],
      align: 'center',
      render: (_, row: any) => {
        const type = row?.transaction_type;
        const tagColorMap: Record<string, string> = {
          reward_refferal: 'cyan',
          withdraw: 'red',
          deposit: 'geekblue',
          checkin: 'volcano',
          reward_draw: 'green',
          reward_mine: 'gold',
          LIXI_MOI_NGAY: 'volcano',
        };
        return type ? (
          <Tag color={tagColorMap[type]} style={{ fontWeight: 'bold' }}>
            {row.transaction_type === 'reward_refferal' && 'Thưởng giới thiệu'}
            {row.transaction_type === 'withdraw' && 'Rút tiền'}
            {row.transaction_type === 'deposit' && 'Nạp tiền'}
            {row.transaction_type === 'checkin' && 'Điểm danh'}
            {row.transaction_type === 'reward_draw' && 'Vòng quay may mắn'}
            {row.transaction_type === 'reward_mine' && 'Đi tìm kho báu'}
            {row.transaction_type === 'LIXI_MOI_NGAY' && 'Lì xì'}
            {row.transaction_type === 'reward_vip' && 'Nhận thưởng đại lý'}
          </Tag>
        ) : null;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'transaction_status',
      filters: [
        { text: 'Hoàn thành', value: 'finish' },
        { text: 'Đang chờ', value: 'pending' },
        { text: 'Đã huỷ', value: 'cancel' },
      ],
      align: 'center',
      render: (_, row: any) => {
        const status = row?.transaction_status;
        const colorMap: Record<string, string> = {
          finish: 'green',
          pending: 'orange',
          cancel: 'red',
        };
        const textMap: Record<string, string> = {
          finish: 'Hoàn thành',
          pending: 'Đang chờ',
          cancel: 'Đã huỷ',
        };
        return status ? (
          <Tag color={colorMap[status]} style={{ fontWeight: 'bold' }}>
            {textMap[status]}
          </Tag>
        ) : null;
      }
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      align: 'center',
      render: (_, row: any) => {
        const noteText = row?.note || '-';
        const noteMap: Record<string, string> = {
          Lucky_Clover: 'Chúc may mắn',
          Robot_Part: '+2 lượt',
          x1_duck: '+1 mảnh vịt',
          x2_duck: '+2 mảnh vịt',
          x5_duck: '+5 mảnh vịt',
        };
        return <div className="font-medium">{noteMap[noteText] || noteText}</div>;
      }
    },
    {
      title: 'Action',
      align: 'center',
      fixed: 'right',
      render: (_, row: any) => (
        <div className="flex justify-center">
          <Link to={`/user-detail/${row?.user?._id}`} className="text-green-600 hover:text-green-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 cursor-pointer"
              aria-label="View details"
              role="img"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </Link>
        </div>
      ),
    },
  ];



  const getData = async () => {
    try {
      const res = await http.get(apiRoutes.dataUsers)
      if (res && res.data) {
        setData(res.data?.data)
      }
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getData()
  }, [])

  const handleActionOnSelect = (key: string, transaction: any) => {
    showConfirmation(key, transaction);
  };

  const showConfirmation = (key: string, transaction: any) => {
    modal.confirm({
      title: 'Bạn có chắc thay đổi',
      icon: <ExclamationCircleOutlined />,

      okButtonProps: {
        className: 'bg-primary',
      },
      onOk: () => {
        return http
          .post(`${apiRoutes.handleTransaction}`, {
            transaction_id: transaction._id,
            typeResolve: key
          })
          .then(() => {
            showNotification(
              'Success',
              NotificationType.SUCCESS,
              'Đã thay đổi thành công'
            );

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
      <div className='grid sm:grid-cols-2 xl:grid-cols-4 gap-4'>
        <Card>
          <div className='my-4'>
            <div className='flex gap-2 items-center'>
              Tổng tiền nạp:
              <div className='font-[900]'>
                {data?.totalDepositAllTime?.toLocaleString()}$
              </div>
            </div>
            <div className='flex gap-2 items-center'>
              Tổng tiền rút:
              <div className='font-[900]'>
                {data?.totalWithdrawAllTime?.toLocaleString()}$
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className='my-4'>
            <div className='flex gap-2 items-center'>
              Tổng tiền nạp hôm nay:
              <div className='font-[900]'>
                {data?.totalDepositToday?.toLocaleString()}$
              </div>
            </div>
            <div className='flex gap-2 items-center'>
              Tổng tiền rút hôm nay:
              <div className='font-[900]'>
                {data?.totalWithdrawToday?.toLocaleString()}$
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className='my-4'>
            <div className='flex gap-2 items-center'>
              Sô lần nạp hôm nay:
              <div className='font-[900]'>
                {data?.countDepositToday?.toLocaleString()}
              </div>
            </div>
            <div className='flex gap-2 items-center'>
              Tổng lần rút hôm nay
              <div className='font-[900]'>
                {data?.countWithdrawToday?.toLocaleString()}
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className='my-4'>
            <div className='flex gap-2 items-center'>
              Tổng Số lần nạp:
              <div className='font-[900]'>
                {data?.countDepositAllTime?.toLocaleString()}
              </div>
            </div>
            <div className='flex gap-2 items-center'>
              Tổng số lần rút :
              <div className='font-[900]'>
                {data?.countWithdrawAllTime?.toLocaleString()}
              </div>
            </div>
          </div>
        </Card>
      </div>

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
        request={(params, sorter, filter) => {

          return http
            .get(apiRoutes.transaction, {
              params: {
                page: params.current,
                per_page: params.pageSize,
                search: params.keyword,
                transaction_type: filter?.transaction_type,
                transaction_status: filter?.transaction_status
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

export default HistoryUser;
