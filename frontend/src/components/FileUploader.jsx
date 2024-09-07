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

    const handleDownload = async (file) => {
        const code = codeInputs[file._id];
        try {
            const response = await fetch(
                `http://localhost:8000/files/download-image/${code}`,
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

            const extension = contentType ? contentType.split('/')[1] : 'jpg';
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '') +
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
                `http://localhost:8000/files/${userId}/${filesId}`,
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
            const response = await fetch(
                `http://localhost:8000/files/${userId}`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

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
                message.error(`${file.name} is larger than 5MB.`);
                return Upload.LIST_IGNORE;
            }

            return false;
        },
        customRequest: (options) => {
            const { file, onSuccess, onError } = options;

            const formData = new FormData();
            formData.append('file', file);
            fetch(`http://localhost:8000/files/${userId}`, {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    message.success(`File ${file.name} uploaded successfully.`);
                    onSuccess();
                })
                .catch((error) => {
                    message.error(`File ${file.name} upload failed.`);
                    onError(error);
                });
        },
    };

    return (
        <>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
            >
                Add File
            </Button>
            <Table
                columns={columns}
                dataSource={files}
                rowKey={(record) => record._id}
                pagination={false}
            />
            <Modal
                title="Upload Files"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleUpload} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[
                            { required: true, message: 'Please enter a title' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="files"
                        label="Files"
                        getValueFromEvent={({ fileList }) => fileList}
                    >
                        <Upload.Dragger {...uploadProps} multiple>
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag file to this area to upload
                            </p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload.
                            </p>
                        </Upload.Dragger>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Upload
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default FileUploader;
