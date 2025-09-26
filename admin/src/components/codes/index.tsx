import {
  ActionType,
  ProTable,
  ProColumns,
  RequestData,
  TableDropdown,
  ProDescriptions,
} from '@ant-design/pro-components';
import { Avatar, BreadcrumbProps, Button, Form, Input, message, Modal, Popover, Space, Tag } from 'antd';
import { useRef } from 'react';
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
      title: <Link to={webRoutes.deposit}>Deposit</Link>,
    },
  ],
};

const Codes = () => {
  const actionRef = useRef<ActionType>();
  const [modal, modalContextHolder] = Modal.useModal();

  const columns: ProColumns[] = [

    {
      title: 'Code',
      dataIndex: 'code',
      align: 'center',
      sorter: false,
      render: (code, row: any) => (
        <div className='flex flex-col gap-1'>
          {code}
        </div>
      )
    },
    {
      title: 'Số người mời',
      dataIndex: 'invites',
      align: 'center',
      sorter: false,
      render: (invites: any, row: any) => (
        <div className='flex flex-col gap-1'>
          {invites?.length}
        </div>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: '_id',
      align: 'center',
      sorter: false,
      render: (userId, row: any) => (
        <div className='font-[900] text-red-600'>
          {new Date(row?.createdAt)?.toLocaleString()}
        </div>
      )
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
      <Popover trigger={'click'} title="Thêm mã giới thiệu" content={
        <Form onFinish={async (form) => {
          const res = await http.post(apiRoutes.createCode, {
            ...form
          })
          if (res && res.data) {
            message.success("Đã thêm thành công")
            actionRef?.current?.reload()
          }
        }}>
          <Form.Item name="code">
            <Input placeholder='Nhập mã giới thiệu' />
          </Form.Item>
          <Form.Item>
            <Button htmlType='submit'>Gửi</Button>
          </Form.Item>
        </Form>
      }>
        <Button className='my-4'>
          Thêm Code
        </Button>
      </Popover>

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
            .get(apiRoutes.codes, {
              params: {
                page: params.current,
                per_page: params.pageSize,
                search: params.keyword,
              },
            })
            .then((response) => {
              const trasactions: [User] = response.data.data?.codes;

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

export default Codes;
