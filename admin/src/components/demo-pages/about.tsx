/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  BreadcrumbProps,
  Button,
  Form,
  Input,
  message,
  Switch,
} from 'antd';
import { Link } from 'react-router-dom';
import BasePageContainer from '../layout/PageContainer';
import { webRoutes } from '../../routes/web';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import TelegramBotForm from './TeleGramBotForm';

const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
    },
    {
      key: webRoutes.setting,
      title: <Link to={webRoutes.about}>Cài đặt</Link>,
    },
  ],
};

const Setting = () => {
  const [config, setConfig] = useState<Record<string, any>>();
  const [loading, setLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Cập nhật config key - value
  const handleUpdateConfig = async (key: string, value: string) => {
    setLoading(true);
    try {
      await http.post(apiRoutes.updateConfig, { key, value });
      setRefreshFlag(prev => !prev);
      message.success('Thay đổi thành công');
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Lỗi cập nhật');
    } finally {
      setLoading(false);
    }
  };

  // Lấy config từ server
  const fetchConfigs = async () => {
    try {
      const res = await http.get(apiRoutes.getConfigs);
      if (res?.data?.data) {
        setConfig(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, [refreshFlag]);

  const paymentGateway = config?.PAYMENT_GATEWAY
    ? JSON.parse(config.PAYMENT_GATEWAY)
    : {};

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <div className="m-5">
        <article>
          <div className="my-12 grid grid-cols-1 gap-6 sm:grid-cols-2">

            {/* Cài đặt thanh toán */}
            <section className="group relative rounded-xl border border-slate-200 p-6">
              <h2 className="mb-6 text-lg font-semibold text-slate-700">
                Cài đặt thanh toán
              </h2>

              {[
                {
                  label: 'Bật/Tắt Nạp',
                  key: 'PAYMENT_MAINTENANCE_DEPOSIT',
                },
                {
                  label: 'Bật/Tắt Rút',
                  key: 'PAYMENT_MAINTENANCE_WITHDRAW',
                },
                {
                  label: 'Bật/Tắt Nạp Banking',
                  key: 'PAYMENT_MAINTENANCE_DEPOSIT_BANKING',
                },
                {
                  label: 'Bật/Tắt Nạp Crypto',
                  key: 'PAYMENT_MAINTENANCE_DEPOSIT_CRYPTO',
                },
              ].map(({ label, key }) => (
                <div key={key} className="flex items-center gap-4 mb-4">
                  <div className="flex-1">{label} :</div>
                  <Switch
                    checked={config?.[key] === '0'}
                    onChange={checked =>
                      handleUpdateConfig(key, checked ? '0' : '1')
                    }
                    loading={loading}
                  />
                </div>
              ))}

              <hr className="my-6" />

              {/* Bot Telegram */}
              <h2 className="mb-4 text-lg font-semibold text-slate-700">
                Gửi tin nhắn bot Telegram
              </h2>
              <TelegramBotForm />

              {/* Cài đặt CSKH */}
              <h2 className="mt-8 mb-4 text-lg font-semibold text-slate-700">
                Cài đặt CSKH
              </h2>
              {config?.LIVECHAT_ID && (
                <Form
                  initialValues={{ value: config.LIVECHAT_ID }}
                  onFinish={({ value }) =>
                    handleUpdateConfig('LIVECHAT_ID', value)
                  }
                  layout="inline"
                  className="mb-6"
                >
                  <Form.Item name="value" className="flex-grow">
                    <Input placeholder="Nhập link CSKH" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Thay đổi
                    </Button>
                  </Form.Item>
                </Form>
              )}

              <hr className="my-6" />

              {/* Giá USDT */}
              <h2 className="mb-4 text-lg font-semibold text-slate-700">
                Cài đặt giá USDT
              </h2>
              {config?.USDT_PRICE && (
                <Form
                  initialValues={{ value: config.USDT_PRICE }}
                  onFinish={({ value }) =>
                    handleUpdateConfig('USDT_PRICE', value)
                  }
                  layout="inline"
                  className="mb-6"
                >
                  <Form.Item name="value" className="flex-grow">
                    <Input
                      placeholder="Nhập giá USDT"
                      type="number"
                      addonAfter="VNĐ"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Thay đổi
                    </Button>
                  </Form.Item>
                </Form>
              )}

              <hr className="my-6" />

              {/* Thông báo trang chủ */}
              <h2 className="mb-4 text-lg font-semibold text-slate-700">
                Cài đặt thông báo trang chủ
              </h2>
              {config?.HOME_NOTIFICATION && (
                <Form
                  initialValues={JSON.parse(config.HOME_NOTIFICATION)}
                  onFinish={form =>
                    handleUpdateConfig('HOME_NOTIFICATION', JSON.stringify(form))
                  }
                  layout="vertical"
                  className="space-y-4"
                >
                  <Form.Item name="en" label="Nội dung tiếng Anh">
                    <Input placeholder="Nhập nội dung tiếng anh" />
                  </Form.Item>
                  <Form.Item name="vi" label="Nội dung tiếng Việt">
                    <Input placeholder="Nhập nội dung tiếng việt" />
                  </Form.Item>
                  <Form.Item name="zh" label="Nội dung tiếng Trung">
                    <Input placeholder="Nhập nội dung tiếng trung" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Thay đổi
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </section>

            {/* Cài đặt tài khoản và ví */}
            <section className="group relative rounded-xl border border-slate-200 p-6">
              <h2 className="mb-6 text-lg font-semibold text-slate-700">
                Cài đặt tài khoản thanh toán banking
              </h2>

              {config?.PAYMENT_GATEWAY && (
                <Form
                  initialValues={paymentGateway}
                  onFinish={form =>
                    handleUpdateConfig('PAYMENT_GATEWAY', JSON.stringify(form))
                  }
                  layout="vertical"
                  className="mb-8"
                >
                  <Form.Item name="holderName" label="Tên chủ thẻ">
                    <Input placeholder="Tên chủ thẻ" />
                  </Form.Item>
                  <Form.Item name="nameBank" label="Tên ngân hàng">
                    <Input placeholder="Tên ngân hàng" />
                  </Form.Item>
                  <Form.Item name="numberBank" label="Số tài khoản">
                    <Input placeholder="Số tài khoản" />
                  </Form.Item>
                  <Form.Item name="code" label="Code ngân hàng">
                    <Input placeholder="Code ngân hàng" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Thay đổi
                    </Button>
                  </Form.Item>
                </Form>
              )}

              <hr className="my-6" />

              {/* Địa chỉ ví BEP20 */}
              <h2 className="mb-6 text-lg font-semibold text-slate-700">Địa chỉ ví</h2>
              {config?.BEP20_ADDRESS && (
                <Form
                  initialValues={{ value: config.BEP20_ADDRESS }}
                  onFinish={({ value }) =>
                    handleUpdateConfig('BEP20_ADDRESS', value)
                  }
                  layout="inline"
                  className="mb-6"
                >
                  <Form.Item name="value" className="flex-grow">
                    <Input placeholder="Nhập địa chỉ ví bep20 0x...." />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Thay đổi
                    </Button>
                  </Form.Item>
                </Form>
              )}

              <hr className="my-6" />

              {/* Cài đặt phí rút */}
              <h2 className="mb-6 text-lg font-semibold text-slate-700">Cài đặt phí rút</h2>
              {config?.FEE_WIDTHDRAW && (
                <Form
                  initialValues={{ value: config.FEE_WIDTHDRAW }}
                  onFinish={({ value }) =>
                    handleUpdateConfig('FEE_WIDTHDRAW', value)
                  }
                  layout="inline"
                  className="mb-6"
                >
                  <Form.Item name="value" className="flex-grow">
                    <Input placeholder="Nhập phí rút" type="number" addonAfter="%" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Thay đổi
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </section>
          </div>
        </article>
      </div>
    </BasePageContainer>
  );
};

export default Setting;
