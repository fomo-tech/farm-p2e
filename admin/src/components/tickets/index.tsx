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
import { Avatar, BreadcrumbProps, Card, Image, Modal, Space, Tag, Tooltip, Typography } from 'antd';
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
      key: webRoutes.tickets,
      title: <Link to={webRoutes.tickets}>Tickets</Link>,
    },
  ],
};

const Tickets = () => {
  const actionRef = useRef<ActionType>();
  const [modal, modalContextHolder] = Modal.useModal();
  const [data, setData] = useState<any>()
  const getData = async () => {
    try {
      const res = await http.get(apiRoutes.dataTickets)
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


  const { Text, Title } = Typography;

  const moneyFormat = (val?: number, decimals = 5) => {
    if (typeof val !== 'number') return '-';
    return val.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const columns: ProColumns[] = [
    {
      title: 'Ảnh & Thu hoạch',
      dataIndex: 'ticketImage',
      align: 'center',
      sorter: false,
      render: (_, row: any) => (
        <Space direction="vertical" size={4} align="center" style={{ width: '100%' }}>
          {
            row?.transaction_type !== 'unlock_land' &&
            <Image
              src={row?.ticket?.urlImage}
              width={70}
              style={{ borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
              preview={false}
              alt="Ticket"
              fallback="/default-image.png"
            />
          }
          {row?.transaction_type === "unlock_land" && (
            <Text strong type="success">+ 1 Đất</Text>
          )}
          {row?.transaction_type === "reward_ticket" && (
            <Text strong type="success">+{moneyFormat(row?.value)} $</Text>
          )}
          {row?.transaction_type === "buy_ticket" && (
            <Text strong type="warning">Mới mua</Text>
          )}
          {row?.transaction_type === "refund_ticket" && (
            <Text strong type="danger">Hết giờ</Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Thông tin giao dịch',
      dataIndex: 'transactionInfo',
      align: 'left',
      sorter: false,
      render: (_, row: any) => (
        <Space direction="vertical" size={6} style={{ width: '100%' }}>
          <Space>
            <Text strong>ID GD:</Text>
            <Text code>{row?._id || '-'}</Text>
          </Space>
          <Space>
            <Text strong>User ID:</Text>
            <Text ellipsis style={{ maxWidth: 150 }}>{row?.user?.userId || '-'}</Text>
          </Space>
          <Space>
            <Text strong>SĐT:</Text>
            <Text>{row?.user?.phone || '-'}</Text>
          </Space>
          <Space>
            <Text strong>IP:</Text>
            <Tooltip title={row?.user?.registerIp || '-'}>
              <Text ellipsis style={{ maxWidth: 140 }}>{row?.user?.registerIp || '-'}</Text>
            </Tooltip>
          </Space>
          <Space>
            <Text strong>Số dư:</Text>
            <Text strong style={{ color: row?.user?.realBalance >= 5 ? 'red' : 'inherit' }}>
              {moneyFormat(row?.user?.realBalance)}
            </Text>
          </Space>
          <Space>
            <Text strong>Ngày GD:</Text>
            <Text>{row?.createdAt ? new Date(row.createdAt).toLocaleString() : '-'}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Chi tiết thanh toán',
      dataIndex: 'paymentInfo',
      align: 'left',
      sorter: false,
      render: (_, row: any) => (
        <Space direction="vertical" size={6} style={{ width: '100%' }}>
          <Space>
            <Text strong>Số lượng ($):</Text>
            <Text strong>{moneyFormat(row?.value)}$</Text>
          </Space>
          <Space>
            <Text strong>Số tiền (vnđ):</Text>
            <Text>{row?.fiat_amount?.toLocaleString() || 0} vnđ</Text>
          </Space>
          <Space>
            <Text strong>Biến động:</Text>
            <Text strong>{moneyFormat(row?.currentBalanceUser, 4)}$</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Chi tiết vé',
      dataIndex: 'ticketInfo',
      align: 'left',
      sorter: false,
      render: (_, row: any) => (
        <Space direction="vertical" size={6} style={{ width: '100%' }}>
          <Space>
            <Text strong>Ticket ID:</Text>
            <Text>{row?.ticket?._id || '-'}</Text>
          </Space>
          <Space>
            <Text strong>Ticket VIP:</Text>
            <Text>{row?.ticket?.vip ?? '-'}</Text>
          </Space>
          {row?.transaction_type === 'buy_ticket' && (
            <>
              <Space>
                <Text strong>Ngày bắt đầu:</Text>
                <Text>{row?.startTime ? new Date(row.startTime).toLocaleString() : '-'}</Text>
              </Space>
              <Space>
                <Text strong>Ngày trả thưởng:</Text>
                <Text>{row?.rewardTime ? new Date(row.rewardTime).toLocaleString() : '-'}</Text>
              </Space>
            </>
          )}
          <Space>
            <Text strong>Số ngày Earn:</Text>
            <Text>{row?.ticket?.earningDay ?? 0} ngày</Text>
          </Space>
          <Space>
            <Text strong>Trả thưởng mỗi ngày:</Text>
            <Text>{row?.ticket?.incomePerDay ?? 0}$</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Loại GD',
      dataIndex: 'transaction_type',
      align: 'center',
      filters: [
        { text: 'Thu hoạch', value: 'reward_ticket' },
        { text: 'Thuê đất', value: 'buy_ticket' },
        { text: 'Hết thời gian', value: 'refund_ticket' },
      ],
      sorter: false,
      render: (_, row: any) => {
        const tagMap = {
          reward_ticket: { color: 'orange', label: 'Thu hoạch' },
          buy_ticket: { color: 'green', label: 'Thuê đất' },
          refund_ticket: { color: 'red', label: 'Hết thời gian' },
        } as any;
        const tag = tagMap[row?.transaction_type];
        if (!tag) return null;
        return <Tag color={tag.color} style={{ fontWeight: 'bold' }}>{tag.label}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'transaction_status',
      align: 'center',
      filters: [
        { text: 'Hoàn thành', value: 'finish' },
        { text: 'Đang farm', value: 'processing' },
        { text: 'Huỷ', value: 'cancel' },
      ],
      sorter: false,
      render: (_, row: any) => {
        const statusMap = {
          finish: { color: 'green', label: 'Hoàn thành' },
          processing: { color: 'orange', label: 'Đang farm' },
          cancel: { color: 'red', label: 'Huỷ' },
        } as Record<string, any>;
        const status = statusMap[row?.transaction_status];
        if (!status) return null;
        return <Tag color={status.color} style={{ fontWeight: 'bold' }}>{status.label}</Tag>;
      },
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
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
        <Card>
          <div className='my-4'>
            <div className='flex gap-2 items-center'>
              Tổng gói đầu tư:
              <div className='font-[900]'>
                {data?.countTicketProgress?.toLocaleString()}
              </div>
            </div>
            <div className='flex gap-2 items-center'>
              Tổng gói đã trả:
              <div className='font-[900]'>
                {data?.countTicketFinish?.toLocaleString()}
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className='my-4'>
            <div className='flex gap-2 items-center'>
              Tổng gói kết thúc hôm nay:
              <div className='font-[900]'>
                {data?.countTicketFinishToday?.toLocaleString()}
              </div>
            </div>
            <div className='flex gap-2 items-center'>
              Tổng gói trả hôm nay:
              <div className='font-[900]'>
                {data?.totalEarnToday?.toLocaleString()}$
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
            .get(apiRoutes.tickets, {
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

export default Tickets;
