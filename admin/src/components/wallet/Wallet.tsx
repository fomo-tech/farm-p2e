import React, { useRef, useState } from 'react';
import { Modal, Form, Button, Input, Switch, message, Select } from 'antd';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import { ActionType, ProColumns, ProTable, RequestData } from '@ant-design/pro-components';

const Wallet = () => {
    const [openModal, setOpenModal] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const actionRef = useRef<ActionType>();

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            let res;
            if (editItem?._id) {
                res = await http.post(apiRoutes.updateWallet(editItem._id), values);
            } else {
                res = await http.post(apiRoutes.createWallet, values);
            }

            if (res && res?.data) {
                message.success(editItem ? 'Cập nhật ví thành công!' : 'Tạo ví thành công!');
                setOpenModal(false);
                setEditItem(null);
                form.resetFields();
                actionRef.current?.reload();
            }
        } catch (err) {
            console.log(err);
            message.error(editItem ? 'Cập nhật ví thất bại!' : 'Tạo ví thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (id: string) => {
        try {
            await http.delete(apiRoutes.deleteWallet(id));
            message.success('Xoá ví thành công!');
            actionRef.current?.reload();
        } catch (error) {
            message.error('Xoá ví thất bại!');
        }
    };

    const columns: ProColumns<any>[] = [
        {
            title: 'Địa chỉ ví',
            dataIndex: 'address',
            key: 'address',
            copyable: true,
        },
        {
            title: 'Loại ví',
            dataIndex: 'type',
            key: 'type',
            valueEnum: {
                receive: { text: 'Receive', status: 'Processing' },
                master: { text: 'Master', status: 'Success' },
                user: { text: 'User', status: 'Default' },
            },
        },
        {
            title: 'Hoạt động',
            dataIndex: 'isActive',
            key: 'isActive',
            valueEnum: {
                true: { text: 'Đang hoạt động', status: 'Success' },
                false: { text: 'Ngưng hoạt động', status: 'Error' },
            },
        },
        {
            title: 'User được gán',
            dataIndex: 'assignedToUser',
            key: 'assignedToUser',
            render: (user: any) => (
                <div>
                    Username: {user ? user.phone : '-'} <br />
                    ID: {user ? user.userId : '-'} <br />
                </div>
            ),
        },
        {
            title: 'OrderId',
            dataIndex: 'assignedOrderId',
            key: 'assignedOrderId',
        },
        {
            title: 'Thời gian gán',
            dataIndex: 'lastUsedAt',
            key: 'lastUsedAt',
            render: (value: any) => {
                if (!value) return '-';
                // assuming lastUsedAt is a unix timestamp in seconds
                const date = new Date(Number(value) * 1000);
                return date.toLocaleString();
            },
        },
        {
            title: 'Tạo lúc',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        onClick={() => {
                            setEditItem(record);
                            form.setFieldsValue(record);
                            setOpenModal(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => {
                            Modal.confirm({
                                title: 'Xác nhận xoá',
                                content: 'Bạn có chắc chắn muốn xoá ví này?',
                                onOk: () => onDelete(record._id),
                            });
                        }}
                    >
                        Xoá
                    </Button>
                </>
            ),
        },
    ];


    return (
        <div>
            <Button type="primary" className="bg-green-600 mb-4" onClick={() => setOpenModal(true)}>
                Thêm ví mới
            </Button>

            <Modal
                title={editItem ? 'Chỉnh sửa ví' : 'Thêm ví mới'}
                centered
                open={openModal}
                onCancel={() => {
                    setOpenModal(false);
                    setEditItem(null);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="address"
                        label="Địa chỉ ví"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ ví' }]}
                    >
                        <Input placeholder="0x..." />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="Loại ví"
                        rules={[{ required: true, message: 'Vui lòng chọn loại ví' }]}
                    >
                        <Select placeholder="Chọn loại ví">
                            <Select.Option value="receive">Receive</Select.Option>
                            <Select.Option value="master">Master</Select.Option>
                            <Select.Option value="user">User</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="isActive"
                        label="Trạng thái hoạt động"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="my-5 bg-green-600"
                            loading={loading}
                            block
                        >
                            {editItem ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <ProTable
                columns={columns}
                actionRef={actionRef}
                rowKey={(record) => record._id}
                request={async (params) => {
                    try {
                        const response = await http.get(apiRoutes.getWallets, { params });
                        return {
                            data: response.data.data?.wallets,
                            success: true,
                            total: response.data.total,
                        } as RequestData<any>;
                    } catch (error) {
                        return { data: [], success: false, total: 0 };
                    }
                }}
                pagination={{
                    showSizeChanger: true,
                    defaultPageSize: 10,
                    pageSizeOptions: ['10', '20', '50', '100'],
                }}
                search={false}
                scroll={{ x: 1000 }}
            />
        </div>
    );
};

export default Wallet;
