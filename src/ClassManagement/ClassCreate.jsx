import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  Table,
  Card,
  Spin,
  Modal,
  Typography,
  Space,
  message,
  Row,
  Col,
} from "antd";

const { Title } = Typography;

function ClassCreate() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);     // page/table loading
  const [saving, setSaving] = useState(false);       // form submit loading
  const [editId, setEditId] = useState(null);
  const [form] = Form.useForm();

  // fetch all classes
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://student-management-backend-node-rd8.vercel.app/class"
      );
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

  // create or update class
  const handleSubmit = async (values) => {
    try {
      setSaving(true);
      if (editId) {
        await axios.put(
          `https://student-management-backend-node-rd8.vercel.app/class/${editId}`,
          { ...values, students: [values.student] }
        );
        message.success("Class updated successfully!");
        setEditId(null);
      } else {
        await axios.post(
          "https://student-management-backend-node-rd8.vercel.app/class",
          { ...values, students: [values.student] }
        );
        message.success("Class created successfully!");
      }
      await fetchUsers();
      form.resetFields();
    } catch (err) {
      message.error("Error saving class!");
    } finally {
      setSaving(false);
    }
  };

  // edit handler
  const onedit = (user) => {
    setEditId(user._id);
    form.setFieldsValue({
      name: user.name || "",
      subject: user.subject || "",
      teacher: user.teacher || "",
      student: user.students?.[0] || "",
    });
  };

  // delete handler with confirmation (return promise so AntD waits)
  const deleteuser = async (id) => {
  
        try {
          await axios
            .delete(`https://student-management-backend-node-rd8.vercel.app/class/${id}`);
          message.success("Class deleted successfully!");
          await fetchUsers();
        } catch {
          message.error("Failed to delete class!");
        }
   
  };

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
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space wrap>
          <Button type="primary" size="small" onClick={() => onedit(record)}>
            Edit
          </Button>
          <Button danger size="small" onClick={() => deleteuser(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f5ff", padding: 24 }}>
      <Card
        bordered={false}
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Title level={2} style={{ textAlign: "center", color: "#1890ff" }}>
          {editId ? "Edit Class" : "Create Class"}
        </Title>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginBottom: 32 }}
        >
          <Row gutter={16}>
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
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={saving}>
                {editId ? "Update Class" : "Create Class"}
              </Button>
              {editId && (
                <Button
                  onClick={() => {
                    setEditId(null);
                    form.resetFields();
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
                style={{ background: "#fff", borderRadius: 8, minWidth: 600 }}
                scroll={{ x: "max-content" }}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default ClassCreate;
