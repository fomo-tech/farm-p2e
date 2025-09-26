import { Form, Input, Button, message as antdMessage } from 'antd';
import { useState } from 'react';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';

const { TextArea } = Input;

const TelegramBotForm = () => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState('');

    const onFinish = async (values: any) => {
        if (!values || !values.message) {
            antdMessage.error('Nội dung không hợp lệ');
            return;
        }

        try {
            const res = await http.post(apiRoutes.sendMessageBotGroup, {
                message: values.message,
                imageUrl: imageUrl || undefined,
            });

            if (res?.data) {
                antdMessage.success('✅ Gửi thành công!');
                form.resetFields();
                setImageUrl('');
            }
        } catch (err) {
            antdMessage.error('❌ Gửi thất bại!');
        }
    };

    return (
        <Form form={form} className="mt-5" onFinish={onFinish} layout="vertical">
            <Form.Item
                name="message"
                label="Nội dung"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
            >
                <TextArea placeholder="Nhập nội dung" rows={5} />
            </Form.Item>

            <Form.Item label="URL ảnh (tuỳ chọn)">
                <Input
                    placeholder="Nhập URL ảnh"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
            </Form.Item>

            <Form.Item>
                <Button htmlType="submit">Gửi</Button>
            </Form.Item>
        </Form>
    );
};

export default TelegramBotForm;
