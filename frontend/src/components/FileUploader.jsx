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
const BASE_URL = import.meta.env.VITE_APP_URI_API;

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
            const response = await fetch(`${BASE_URL}/files/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch files');
            const data = await response.json();
            setFiles(data);
        } catch (error) {
            message.error('Failed to fetch files');
            console.error('Fetch files error:', error);
        }
    };
        const handleDownload = async (file) => {
            const code = codeInputs[file._id];
            try {
                const response = await fetch(
                    `${BASE_URL}/files/download-image/${code}`,
                    {
                        method: 'GET',
                    }
                );

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const contentDisposition = response.headers.get(
                    'Content-Disposition'
                );
                const contentType = response.headers.get('Content-Type');

                const extension = contentType
                    ? contentType.split('/')[1]
                    : 'jpg';
                const filename = contentDisposition
                    ? contentDisposition
                          .split('filename=')[1]
                          .replace(/"/g, '') +
                      '.' +
                      extension
                    : 'downloaded-file.' + extension;
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                setCodeInputs((prev) => ({ ...prev, [file._id]: '' })); // Clear input after download
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error downloading the file:', error);
            }
        };
const handleDelete = async (filesId) => {
        try {
            const response = await fetch(
                `${BASE_URL}/files/${userId}/${filesId}`,
                {
                    method: 'DELETE',
                }
            );
            if (!response.ok) throw new Error('Failed to delete files');
            const data = await response.json();
            message.success('Files deleted successfully');
            setFiles(files?.filter((file) => file?._id !== filesId));
        } catch (error) {
            message.error(`Delete failed: ${error.message}`);
            console.error('Delete error:', error);
        }
    };
    const handleEdit = (file) => {
        setEditingFiles(file);
        setIsModalVisible(true);
        form.setFieldsValue({
            title: file.title,
        });
    };
    const handleUpdate = async (values) => {
        try {
            const response = await fetch(
                `${BASE_URL}/files/${userId}/${editingFiles._id}`,
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
            message.success('Files updated successfully');
            setFiles(
                files?.map((file) => (file?._id === data?._id ? data : file))
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
            const response = await fetch(`${BASE_URL}/files/${userId}`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Failed to upload files');
            const data = await response.json();
            message.success('Files uploaded successfully');
            setFiles([...files, { ...data, code: generatedCode }]);
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error(`Upload failed: ${error.message}`);
            console.error('Upload error:', error);
        }
    };
    const handleCodeInputChange = (fileId, value) => {
        setCodeInputs((prev) => ({ ...prev, [fileId]: value }));
    };
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text, record) => (
                <div>
                    <strong>{text.toUpperCase()}</strong> <br />
                    <span style={{ color: '#888' }}>
                        Code: {record.code}
                    </span>{' '}
                </div>
            ),
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
                            src={`${BASE_URL}/${file}`}
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
                                value={codeInputs[record._id] || ''}
                                onChange={(e) =>
                                    handleCodeInputChange(
                                        record._id,
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
                                onClick={() => handleDownload(record)}
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
            <div style={{ textAlign: 'center', padding: '10px' }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                >
                    Add File
                </Button>
            </div>
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
