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
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    DownloadOutlined,
    UploadOutlined,
} from '@ant-design/icons';

const FileUploader = () => {
    const [files, setFiles] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingFiles, setEditingFiles] = useState(null);
    const [form] = Form.useForm();
    const [codeInputs, setCodeInputs] = useState({});

    const userData = localStorage.getItem('user');
    const parsedData = userData ? JSON.parse(userData) : null;
    const userId = parsedData ? parsedData._id : null;

    useEffect(() => {
        if (userId) {
            fetchFiles();
        }
    }, [userId]);

    // Function for generate a 6-digit code
    const generateSixDigitUniqueCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const fetchFiles = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/files/${userId}`
            );
            if (!response.ok) throw new Error('Failed to fetch files');
            const data = await response.json();
            setFiles(data);
        } catch (error) {
            message.error('Failed to fetch files');
            console.error('Fetch files error:', error);
        }
    };

    const handleDownload = async () => {
        console.log('download is clicked');
    };

    const handleDelete = async (filesId) => {
        try {
            const response = await fetch(
                `http://localhost:8000/files/${userId}/${filesId}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) throw new Error('Failed to delete files');
            const data = await response.json();
            message.success('files deleted successfully');
            setFiles(files?.filter((files) => files?._id !== filesId));
        } catch (error) {
            message.error(`Delete failed: ${error.message}`);
            console.error('Delete error:', error);
        }
    };

    const handleEdit = (files) => {
        setEditingFiles(files);
        setIsModalVisible(true);
        form.setFieldsValue({
            title: files.title,
        });
    };

    const handleUpdate = async (values) => {
        try {
            const response = await fetch(
                `http://localhost:8000/files/${userId}/${editingFiles._id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                }
            );

            if (!response.ok) throw new Error('Failed to update files');
            const data = await response.json();
            message.success('files updated successfully');
            setFiles(
                files?.map((files) => (files?._id === data?._id ? data : files))
            );
            setIsModalVisible(false);
            setEditingFiles(null);
            form.resetFields();
        } catch (error) {
            message.error(`Update failed: ${error.message}`);
            console.error('Update error:', error);
        }
    };

    const handleUpload = async (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        const generatedCode = generateSixDigitUniqueCode();
        formData.append('code', generatedCode);

        if (values?.files && values?.files?.fileList?.length > 0) {
            values?.files?.fileList?.forEach((file) => {
                formData.append('files', file?.originFileObj);
            });
        } else {
            message.error('Please select at least one file');
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/files/${userId}`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) throw new Error('Failed to upload files');
            const data = await response.json();
            message.success('files uploaded successfully');
            setFiles([...files, { ...data, code: generatedCode }]);
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error(`Upload failed: ${error.message}`);
            console.error('Upload error:', error);
        }
    };

    const handleCodeInputChange = (filesId, fileUrl, value) => {
        setCodeInputs((prev) => ({
            ...prev,
            [`${filesId}-${fileUrl}`]: value,
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
                            src={`http://localhost:8000/${file}`}
                            alt="files"
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
                                    codeInputs[
                                        `http://localhost:8000/albums/download-image/`
                                    ] || ''
                                }
                                onChange={(e) =>
                                    handleCodeInputChange(
                                        record._id,
                                        file,
                                        e.target.value
                                    )
                                }
                                maxLength={6}
                                style={{ width: 200 }}
                                type="number"
                            />
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={() => handleDownload(record._id, file)}
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
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="primary"
                        danger
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

            const isLt5M = file?.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                message.error(`${file?.name} exceeds the 5MB size limit.`);
            }

            return isSupported && isLt5M ? true : Upload.LIST_IGNORE;
        },
        maxCount: 1,
        listType: 'picture',
    };

    const handleModalOk = () => {
        form.validateFields()
            .then((values) => {
                if (editingFiles) {
                    handleUpdate(values);
                } else {
                    handleUpload(values);
                }
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingFiles(null);
        form.resetFields();
    };

    return (
        <>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
            >
                Add files
            </Button>
            <Table
                dataSource={files}
                columns={columns}
                rowKey="_id"
                style={{ marginTop: 20 }}
            />

            <Modal
                title={editingFiles ? 'Edit files' : 'Add files'}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText={editingFiles ? 'Update' : 'Create'}
                cancelText="Cancel"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="files Title"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the files title!',
                            },
                        ]}
                    >
                        <Input placeholder="Enter files title" />
                    </Form.Item>

                    {/* Only show upload if adding a new files */}
                    {!editingFiles && (
                        <Form.Item
                            name="files"
                            label="Upload File"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please upload a file!',
                                },
                            ]}
                        >
                            <Upload {...uploadProps}>
                                <Button
                                    type="primary"
                                    icon={<UploadOutlined />}
                                >
                                    Select File
                                </Button>
                            </Upload>
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </>
    );
};

export default FileUploader;
