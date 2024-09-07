import React, { useState, useEffect } from 'react';
import {
    Button,
    Table,
    Upload,
    Modal,
    Form,
    Input,
    message,
    Space,
    Typography,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    DownloadOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const AlbumManager = () => {
    const [albums, setAlbums] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState(null);
    const [form] = Form.useForm();
    const [codeInputs, setCodeInputs] = useState({});

    const userData = localStorage.getItem('user');
    const parsedData = userData ? JSON.parse(userData) : null;
    const userId = parsedData ? parsedData._id : null;

    useEffect(() => {
        if (userId) {
            fetchAlbums();
        }
    }, [userId]);

    const fetchAlbums = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/albums/${userId}`
            );
            if (!response.ok) throw new Error('Failed to fetch albums');
            const data = await response.json();
            setAlbums(data);
        } catch (error) {
            message.error('Failed to fetch albums');
            console.error(error);
        }
    };

    const handleDownload = async (albumId, img, imgIndex) => {
        const code = codeInputs[`${albumId}-${imgIndex}`];
        if (!code) {
            message.error('Please enter the 6-digit code');
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/albums/download/${userId}/${albumId}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Incorrect code');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = img.url;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            message.success('File downloaded successfully');
        } catch (error) {
            message.error(error.message);
            console.error(error);
        }
    };

    const handleDelete = async (albumId) => {
        try {
            const response = await fetch(
                `http://localhost:8000/albums/${userId}/${albumId}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) throw new Error('Failed to delete album');
            const data = await response.json();
            message.success('Album deleted successfully');
            setAlbums(albums.filter((album) => album._id !== albumId));
        } catch (error) {
            message.error('Failed to delete album');
            console.error(error);
        }
    };

    const handleEdit = (album) => {
        setEditingAlbum(album);
        setIsModalVisible(true);
        form.setFieldsValue({
            title: album.title,
        });
    };

    const handleUpdate = async (values) => {
        try {
            const response = await fetch(
                `http://localhost:8000/albums/${userId}/${editingAlbum._id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                }
            );

            if (!response.ok) throw new Error('Failed to update album');
            const data = await response.json();
            message.success('Album updated successfully');
            setAlbums(
                albums.map((album) => (album._id === data._id ? data : album))
            );
            setIsModalVisible(false);
            setEditingAlbum(null);
            form.resetFields();
        } catch (error) {
            message.error('Failed to update album');
            console.error(error);
        }
    };

    const handleUpload = async (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        if (values.files && values.files.fileList.length > 0) {
            formData.append('file', values.files.fileList[0].originFileObj); // Only one file
        } else {
            message.error('Please select a file');
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/albums/${userId}`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) throw new Error('Failed to upload album');
            const data = await response.json();
            message.success('Album uploaded successfully');
            setAlbums([...albums, data]);
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error(error.message);
            console.error(error);
        }
    };

    const handleCodeInputChange = (albumId, imgIndex, value) => {
        setCodeInputs((prev) => ({
            ...prev,
            [`${albumId}-${imgIndex}`]: value,
        }));
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Files',
            dataIndex: 'img',
            key: 'img',
            render: (imgArray, record) =>
                imgArray.map((file, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 10,
                        }}
                    >
                        <img
                            src={`http://localhost:8000/uploads/${file.url}`}
                            alt="album"
                            style={{
                                width: 100,
                                height: 100,
                                objectFit: 'cover',
                                marginRight: 10,
                                borderRadius: 4,
                                border: '1px solid #ddd',
                            }}
                        />
                        <Space direction="vertical">
                            <Input
                                placeholder="Enter 6-digit code"
                                value={
                                    codeInputs[`${record._id}-${index}`] || ''
                                }
                                onChange={(e) =>
                                    handleCodeInputChange(
                                        record._id,
                                        index,
                                        e.target.value
                                    )
                                }
                                maxLength={6}
                                style={{ width: 200 }}
                            />
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={() =>
                                    handleDownload(record._id, file, index)
                                }
                            >
                                Download
                            </Button>
                        </Space>
                    </div>
                )),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record) => (
                <Space>
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record._id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const uploadProps = {
        beforeUpload: (file) => {
            const isSupported =
                file.type.includes('image') ||
                file.type === 'application/pdf' ||
                file.type ===
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.type === 'application/msword';

            if (!isSupported) {
                message.error(`${file.name} is not a supported format.`);
                return Upload.LIST_IGNORE;
            }

            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                message.error(`${file.name} exceeds the 5MB size limit.`);
            }

            return isSupported && isLt5M ? true : Upload.LIST_IGNORE;
        },
        maxCount: 1, // Restrict to one file at a time
        listType: 'picture',
    };

    const handleModalOk = () => {
        form.submit();
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingAlbum(null);
        form.resetFields();
    };

    return (
        <div style={{ padding: 20 }}>
            <Typography.Title level={2}>Album Manager</Typography.Title>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
                style={{ marginBottom: 20 }}
            >
                Upload Album
            </Button>
            <Table
                dataSource={albums}
                columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
            />
            <Modal
                title={editingAlbum ? 'Edit Album' : 'Upload Album'}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText={editingAlbum ? 'Update' : 'Upload'}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={editingAlbum ? handleUpdate : handleUpload}
                >
                    <Form.Item
                        name="title"
                        label="Album Title"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the album title',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    {!editingAlbum && (
                        <Form.Item
                            name="files"
                            label="Upload Files"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please upload a file',
                                },
                            ]}
                        >
                            <Upload {...uploadProps}>
                                <Button icon={<PlusOutlined />}>
                                    Select File
                                </Button>
                            </Upload>
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default AlbumManager;
