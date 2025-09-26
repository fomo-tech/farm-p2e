/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import BasePageContainer from '../layout/PageContainer';
import {
  Avatar,
  BreadcrumbProps,
  Card,
  Col,
  List,
  Progress,
  Rate,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { webRoutes } from '../../routes/web';
import { Link } from 'react-router-dom';
import StatCard from './StatCard';
import { AiOutlineStar, AiOutlineTeam } from 'react-icons/ai';
import Icon from '@ant-design/icons';
import { BiCommentDetail, BiMoney, BiPhotoAlbum } from 'react-icons/bi';
import { MdOutlineArticle, MdOutlinePhoto } from 'react-icons/md';
import { StatisticCard } from '@ant-design/pro-components';
import LazyImage from '../lazy-image';
import { User } from '../../interfaces/models/user';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import { handleErrorResponse } from '../../utils';
import { Review } from '../../interfaces/models/review';
const { Text } = Typography;
const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
    },
  ],
};

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dashboard, setDashboard] = useState<any>()
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const getDataDashboard = async () => {
    setLoading(true)
    try {
      const res = await http.get(apiRoutes.dataDashboard)
      if (res && res.data) {
        setDashboard(res?.data?.data)
      }
    } catch (err) {
      console.log(err);

    }
    setLoading(false)
  }

  useEffect(() => {
    getDataDashboard()
  }, [])

  const transactionTypeLabels: Record<string, string> = {
    reward_refferal: 'Thưởng giới thiệu',
    withdraw: 'Rút tiền',
    deposit: 'Nạp tiền',
    checkin: 'Điểm danh',
    reward_draw: 'Vòng quay may mắn',
    reward_mine: 'Đi tìm kho báu',
    LIXI_MOI_NGAY: 'Lì xì',
  };

  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  });

  return (
    <BasePageContainer breadcrumb={breadcrumb} transparent={true}>
      <Row gutter={24}>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={AiOutlineTeam} />}
            title="Tổng User"
            number={dashboard?.totalUser}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={MdOutlineArticle} />}
            title="Tổng đầu tư"
            number={dashboard?.totalInvest}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={BiMoney} />}
            title="Số lần nạp"
            number={dashboard?.totalDeposit}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={BiMoney} />}
            title="Số lần rút"
            number={dashboard?.totalWithdraw}
          />
        </Col>


        <Col
          xl={12}
          lg={12}
          md={12}
          sm={24}
          xs={24}
          style={{ marginBottom: 24 }}
        >
          <Card bordered={false} className="w-full h-full cursor-default" title="Hoạt động mới nhất">
            <List
              loading={loading}
              itemLayout="horizontal"
              dataSource={dashboard?.latestUserTransactions}
              renderItem={(item: any) => {
                const label = transactionTypeLabels[item.transaction_type] || item.transaction_type;
                const formattedValue = item.value ? formatter.format(item.value) : '-';

                return (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Typography.Text strong>
                          {label} {formattedValue}
                        </Typography.Text>
                      }
                      description={
                        <div className="flex flex-col gap-1">
                          <div>{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</div>
                          <Space size="small" wrap>
                            <Text strong>User ID:</Text>
                            <Text ellipsis style={{ maxWidth: 150 }}>{item.user?.userId || '-'}</Text>
                            <Text strong>SĐT:</Text>
                            <Text>{item.user?.phone || '-'}</Text>
                            <Text strong>IP:</Text>
                            <Tooltip title={item.user?.registerIp || '-'}>
                              <Text ellipsis style={{ maxWidth: 140 }}>{item.user?.registerIp || '-'}</Text>
                            </Tooltip>
                          </Space>
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />
            <Link to={webRoutes.historyUser} className='text-blue-500'>Xem thêm ...</Link>
          </Card>
        </Col>

        <Col xl={12} lg={12} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <Card bordered={false} className="w-full h-full cursor-default" title="Đầu tư mới nhất">
            <List
              loading={loading}
              itemLayout="horizontal"
              dataSource={dashboard?.latestTicketTransactions || []}
              locale={{ emptyText: 'Không có dữ liệu' }}
              renderItem={(item: any) => {
                const typeLabel = transactionTypeLabels[item.transaction_type] || item.transaction_type;
                return (
                  <List.Item
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'default',
                    }}
                    key={item._id}
                  >
                    <List.Item.Meta
                      title={
                        <div className="flex items-center gap-2">
                          <Tag color={
                            item.transaction_type === 'reward_ticket' ? 'green' :
                              item.transaction_type === 'buy_ticket' ? 'blue' :
                                item.transaction_type === 'refund_ticket' ? 'red' : 'default'
                          }>{typeLabel}</Tag>
                          <span className="font-semibold text-gray-800">
                            {Number(item.value).toFixed(2)} $
                          </span>
                        </div>
                      }
                      description={
                        <div className="flex flex-col gap-1">
                          <div>{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</div>
                          <Space size="small" wrap>
                            <Text strong>User ID:</Text>
                            <Text ellipsis style={{ maxWidth: 150 }}>{item.user?.userId || '-'}</Text>
                            <Text strong>SĐT:</Text>
                            <Text>{item.user?.phone || '-'}</Text>
                            <Text strong>IP:</Text>
                            <Tooltip title={item.user?.registerIp || '-'}>
                              <Text ellipsis style={{ maxWidth: 140 }}>{item.user?.registerIp || '-'}</Text>
                            </Tooltip>
                          </Space>
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />
            <div className="mt-3 text-right">
              <Link to={webRoutes.tickets} className="text-blue-600 hover:underline font-medium">
                Xem thêm ...
              </Link>
            </div>
          </Card>
        </Col>


      </Row>
    </BasePageContainer>
  );
};

export default Dashboard;
