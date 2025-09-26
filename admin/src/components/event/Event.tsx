import React, { useRef, useState } from 'react';
import { Modal, Form, Button, Input, InputNumber, Switch, DatePicker, message } from 'antd';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import { ActionType, ProColumns, ProTable, RequestData } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const Event = () => {
    const [openModal, setOpenModal] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const actionRef = useRef<ActionType>();

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const timeStart = values.timeRange?.[0] ? dayjs(values.timeRange[0]).utc().valueOf() : 0;
            const timeEnd = values.timeRange?.[1] ? dayjs(values.timeRange[1]).utc().valueOf() : 0;

            const payload = {
                ...values,
                timeStart,
                timeEnd,
            };

            let res;
            if (editItem?._id) {
                // Chỉnh sửa
                res = await http.post(apiRoutes.updateEvent(editItem._id), payload);
            } else {
                // Tạo mới
                res = await http.post(apiRoutes.createEvent, payload);
            }

            if (res && res?.data) {
                message.success(editItem ? 'Cập nhật thành công!' : 'Tạo event thành công!');
                setOpenModal(false);
                setEditItem(null);
                form.resetFields();
                actionRef.current?.reload(); // Refresh bảng
            }
        } catch (err) {
            console.log(err);

            message.error(editItem ? 'Cập nhật thất bại!' : 'Tạo event thất bại!');
        } finally {
            setLoading(false);
        }
    };


    const columns: ProColumns<any>[] = [
        {
            title: 'Loại sự kiện',
            dataIndex: 'event_type',
            key: 'event_type',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            valueEnum: {
                true: { text: 'Hoạt động', status: 'Success' },
                false: { text: 'Tạm dừng', status: 'Default' },
            },
        },
        {
            title: 'Trạng thái sự kiện',
            key: 'eventStatus',
            render: (_, record) => {
                const now = Date.now();
                const { timeStart, timeEnd } = record;

                if (timeStart && timeEnd) {
                    if (now < timeStart) return <span style={{ color: '#faad14' }}>Chưa bắt đầu</span>;
                    if (now >= timeStart && now <= timeEnd) return <span style={{ color: '#52c41a' }}>Đang diễn ra</span>;
                    if (now > timeEnd) return <span style={{ color: '#f5222d' }}>Đã kết thúc</span>;
                }

                return <span style={{ color: '#d9d9d9' }}>Không xác định</span>;
            },
        },
        {
            title: 'Thời gian',
            key: 'time',
            render: (_, record) => {
                return (
                    <div>
                        <div>Bắt đầu: {record.timeStart ? new Date(record.timeStart).toLocaleString() : '-'}</div>
                        <div>Kết thúc: {record.timeEnd ? new Date(record.timeEnd).toLocaleString() : '-'}</div>
                    </div>
                );
            },
        },
        {
            title: 'Là farm?',
            dataIndex: 'isFarm',
            key: 'isFarm',
            valueEnum: {
                true: { text: 'Có', status: 'Processing' },
                false: { text: 'Không', status: 'Default' },
            },
        },
        {
            title: 'Giá trị / SL / Min / Max',
            key: 'value_quantity',
            render: (_: any, record: any) => (
                <div>
                    <div>Giá trị: {record?.value}</div>
                    <div>Số lượng: {record?.quantity}</div>
                    <div>Min: {record?.minValue}</div>
                    <div>Max: {record?.maxValue}</div>
                </div>
            ),
        },

        {
            title: 'Tạo lúc',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <Button
                    type="link"
                    onClick={() => {
                        setEditItem(record);
                        form.setFieldsValue({
                            ...record,
                            timeRange: [record.timeStart ? dayjs(record.timeStart) : null, record.timeEnd ? dayjs(record.timeEnd) : null],
                        });
                        setOpenModal(true);
                    }}
                >
                    Sửa
                </Button>
            ),
        },

    ];


    return (
        <div>
            <Button type="primary" className="bg-green-600" onClick={() => setOpenModal(true)}>
                {editItem ? 'Chỉnh sửa event' : 'Thêm event mới'}
            </Button>

            <Modal
                title={editItem ? 'Chỉnh sửa event' : 'Thêm event mới'}
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
                        name="event_type"
                        label="Loại sự kiện"
                        rules={[
                            { required: true, message: 'Vui lòng nhập loại sự kiện' },
                            {
                                pattern: /^[A-Z][A-Z0-9_]*$/,
                                message: 'Chỉ dùng chữ in hoa, số và gạch dưới, bắt đầu bằng chữ in hoa (VD: LIXI_MOI_NGAY)',
                            },
                        ]}
                    >
                        <Input placeholder="VD: LIXI_MOI_NGAY" />
                    </Form.Item>

                    <Form.Item name="timeRange" label="Thời gian sự kiện">
                        <DatePicker.RangePicker showTime className="w-full" />
                    </Form.Item>

                    <Form.Item name="status" label="Trạng thái" valuePropName="checked">
                        <Switch defaultChecked />
                    </Form.Item>

                    <Form.Item name="isFarm" label="Là sự kiện dành cho người có nông trại?" valuePropName="checked">
                        <Switch />
                    </Form.Item>

                    <Form.Item name="minValue" label="Giá trị tối thiểu">
                        <InputNumber min={0} className="w-full" />
                    </Form.Item>

                    <Form.Item name="maxValue" label="Giá trị tối đa">
                        <InputNumber min={0} className="w-full" />
                    </Form.Item>

                    <Form.Item name="value" label="Giá trị sự kiện">
                        <InputNumber min={0} className="w-full" />
                    </Form.Item>

                    <Form.Item name="quantity" label="Số lượng áp dụng">
                        <InputNumber min={0} className="w-full" />
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
                request={async (params, sort, filter) => {
                    try {
                        const response = await http.get(apiRoutes.getEvents, {
                            params,
                        });
                        return {
                            data: response.data.data?.events,
                            success: true,
                            total: response.data.total,
                        } as RequestData<any>;
                    } catch (error) {
                        return {
                            data: [],
                            success: false,
                            total: 0,
                        };
                    }
                }}
                pagination={{
                    showSizeChanger: true,
                    defaultPageSize: 10,
                    pageSizeOptions: ['10', '20', '50', '100'],
                }}
                search={false}
                scroll={{ x: 1200 }}
            />

        </div>
    );
};

export default Event;
