
import { handleCreateUserAction } from '@/utils/actions';
import {
    Modal, Input, Form, Row, Col, message,
    notification, Switch, Upload, Button
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getBase64 } from '@/utils/helpers';
import { useState } from 'react';

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
    onSuccess?: () => void;
}

const UserCreate = (props: IProps) => {

    const {
        isCreateModalOpen, setIsCreateModalOpen, onSuccess
    } = props;

    const [form] = Form.useForm();
    const [previewImage, setPreviewImage] = useState<string>("");

    const handleCloseCreateModal = () => {
        form.resetFields()
        setPreviewImage("");
        setIsCreateModalOpen(false);

    }

    const onFinish = async (values: any) => {
        const res = await handleCreateUserAction(values);
        if (res?.data) {
            handleCloseCreateModal();
            message.success("Create succeed!")
            onSuccess?.();
        } else {
            notification.error({
                message: "Create User error",
                description: res?.message
            })
        }

    };

    return (
        <Modal
            title="Add new user"
            open={isCreateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCloseCreateModal()}
            maskClosable={false}
        >
            <Form
                name="basic"
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Row gutter={[15, 15]}>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input type='email' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Phone" name="phone">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Address" name="address">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item name="image" hidden>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Image (Upload)">
                            <Upload
                                maxCount={1}
                                beforeUpload={async (file) => {
                                    const base64 = await getBase64(file);
                                    form.setFieldValue('image', base64);
                                    setPreviewImage(base64);
                                    return false;
                                }}
                                onRemove={() => { form.setFieldValue('image', null); setPreviewImage(""); }}
                            >
                                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                            </Upload>
                            {previewImage && (
                                <img src={previewImage} alt="preview" style={{ marginTop: 8, maxWidth: '100%', maxHeight: 120, objectFit: 'contain', borderRadius: 4, border: '1px solid #d9d9d9' }} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Is Active" name="isActive" valuePropName="checked" initialValue={true}>
                            <Switch />
                        </Form.Item>
                    </Col>

                </Row>
            </Form>
        </Modal>
    )
}

export default UserCreate;