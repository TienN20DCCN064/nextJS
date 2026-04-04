
import { handleUpdateUserAction } from '@/utils/actions';
import {
    Modal, Input,
    Form, Row, Col, message,
    notification, Switch, Upload, Button
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getBase64 } from '@/utils/helpers';
import { useEffect, useState } from 'react';

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
    onSuccess?: () => void;
}

const UserUpdate = (props: IProps) => {

    const {
        isUpdateModalOpen, setIsUpdateModalOpen,
        dataUpdate, setDataUpdate, onSuccess
    } = props;

    const [form] = Form.useForm();
    const [previewImage, setPreviewImage] = useState<string>("");

    useEffect(() => {
        if (dataUpdate) {
            //code
            form.setFieldsValue({
                name: dataUpdate.name,
                email: dataUpdate.email,
                phone: dataUpdate.phone,
                address: dataUpdate.address,
                image: dataUpdate.image,
                isActive: dataUpdate.isActive ?? true,
            })
            setPreviewImage(dataUpdate.image || "");
        }
    }, [dataUpdate])

    const handleCloseUpdateModal = () => {
        form.resetFields()
        setPreviewImage("");
        setIsUpdateModalOpen(false);
        setDataUpdate(null)
    }

    const onFinish = async (values: any) => {
        if (dataUpdate) {
            const { name, phone, address, image, isActive } = values;
            const res = await handleUpdateUserAction({
                id: dataUpdate.id, name, phone, address, image, isActive
            })
            if (res?.data) {
                handleCloseUpdateModal();
                message.success("Update user succeed")
                onSuccess?.();
            } else {
                notification.error({
                    message: "Update User error",
                    description: res?.message
                })
            }

        }
    };

    return (
        <Modal
            title="Update a user"
            open={isUpdateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCloseUpdateModal()}
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
                        >
                            <Input type='email' disabled />
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
                        <Form.Item
                            label="Phone"
                            name="phone"
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={24} md={12}>
                        <Form.Item
                            label="Address"
                            name="address"
                        >
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
                        <Form.Item label="Is Active" name="isActive" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>

                </Row>
            </Form>
        </Modal>
    )
}

export default UserUpdate;