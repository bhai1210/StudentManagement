import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  Card,
  Spin,
  Typography,
  Space,
  message,
  Row,
  Col,
  Upload,
} from "antd";
import { motion } from "framer-motion";
import { UploadOutlined } from "@ant-design/icons";
import api from "../Services/api";

const { Title } = Typography;

function ClassCreate() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null); // preview + backend URL

  // Fetch all classes
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/class");
      if (Array.isArray(response.data?.data)) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      message.error("Failed to fetch classes!");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Submit handler (Create / Update)
  const handleSubmit = async (values) => {
    try {
      setSaving(true);

      const payload = { ...values, students: [values.student] };

      if (editId) {
        // Edit mode
        payload.image = imageUrl || users.find((u) => u._id === editId)?.image || null;
        await api.put(`/class/${editId}`, payload);
        message.success("Class updated successfully!");
        setEditId(null);
      } else {
        // Create mode
        payload.image = imageUrl || null;
        await api.post("/class", payload);
        message.success("Class created successfully!");
      }

      await fetchUsers();
      form.resetFields();
      setImageUrl(null);
    } catch (err) {
      console.error(err);
      message.error("Error saving class!");
    } finally {
      setSaving(false);
    }
  };

  // Edit handler
  const onEdit = (user) => {
    setEditId(user._id);
    form.setFieldsValue({
      name: user.name || "",
      subject: user.subject || "",
      teacher: user.teacher || "",
      student: user.students?.[0] || "",
    });
    setImageUrl(user.image || null); // show old image
  };

  // Delete handler
  const deleteUser = async (id) => {
    try {
      await api.delete(`/class/${id}`);
      message.success("Class deleted successfully!");
      await fetchUsers();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete class!");
    }
  };

const handleUpload = async ({ file, onSuccess, onError }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/uploads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const uploadedUrl = res?.data?.fileUrl; // ✅ backend returns fileUrl

    if (!uploadedUrl) throw new Error("Upload response missing fileUrl");

    setImageUrl(uploadedUrl); // ✅ directly works in <img src={imageUrl} />
    message.success("Image uploaded successfully!");

    if (onSuccess) onSuccess("ok");
  } catch (err) {
    console.error(err);
    message.error("Image upload failed!");
    if (onError) onError(err);
  }
};





  // Table columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Subject", dataIndex: "subject", key: "subject" },
    { title: "Teacher", dataIndex: "teacher", key: "teacher" },
    {
      title: "Students",
      dataIndex: "students",
      key: "students",
      render: (students) => (students || []).join(", "),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <img
            src={image}
            alt="class"
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space wrap>
          <Button
            type="primary"
            size="small"
            style={{ background: "#0d3b66", border: "none" }}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Button danger size="small" onClick={() => deleteUser(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", padding: 24, background: "#f5f7fa" }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card
          bordered={false}
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            borderRadius: 16,
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            padding: 24,
          }}
        >
          <Title level={2} style={{ textAlign: "center", color: "#0d3b66" }}>
            {editId ? "Edit Class" : "Create Class"}
          </Title>

          {/* Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ marginBottom: 32 }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="name"
                  label="Class Name"
                  rules={[{ required: true, message: "Please enter class name" }]}
                >
                  <Input placeholder="Enter class name" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="subject"
                  label="Subject"
                  rules={[{ required: true, message: "Please enter subject" }]}
                >
                  <Input placeholder="Enter subject" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="teacher"
                  label="Teacher"
                  rules={[{ required: true, message: "Please enter teacher name" }]}
                >
                  <Input placeholder="Enter teacher name" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="student"
                  label="Student"
                  rules={[{ required: true, message: "Please enter student name" }]}
                >
                  <Input placeholder="Enter student name" />
                </Form.Item>
              </Col>

              {/* Upload + Preview */}
              <Col xs={24} sm={12}>
                <Form.Item label="Upload Image">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Upload
                      customRequest={handleUpload}
                      showUploadList={false}
                      accept="image/*"
                    >
                      <Button icon={<UploadOutlined />}>
                        {editId ? "Change Image" : "Click to Upload"}
                      </Button>
                    </Upload>

                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt="preview"
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 8,
                          border: "1px solid #ddd",
                        }}
                      />
                    )}
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Space>
                <Button
                  style={{
                    background: "#0d3b66",
                    color: "white",
                  }}
                  htmlType="submit"
                  loading={saving}
                >
                  {editId ? "Update Class" : "Create Class"}
                </Button>
                {editId && (
                  <Button
                    onClick={() => {
                      setEditId(null);
                      form.resetFields();
                      setImageUrl(null);
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                )}
              </Space>
            </Form.Item>
          </Form>

          {/* Table */}
          {loading ? (
            <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
          ) : (
            <>
              <Title level={4} style={{ marginBottom: 16, color: "#444" }}>
                Class List
              </Title>
              <div style={{ width: "100%", overflowX: "auto" }}>
                <Table
                  dataSource={users}
                  columns={columns}
                  rowKey="_id"
                  bordered
                  pagination={{ pageSize: 5, responsive: true }}
                  scroll={{ x: "max-content" }}
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                  components={{
                    header: {
                      cell: (props) => (
                        <th
                          {...props}
                          style={{
                            background: "#0d3b66",
                            color: "white",
                            textAlign: "center",
                            fontWeight: "600",
                          }}
                        />
                      ),
                    },
                  }}
                />
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}

export default ClassCreate;
