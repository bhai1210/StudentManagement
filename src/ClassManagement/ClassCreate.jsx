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
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/class");
      if (Array.isArray(response.data?.data)) {
        setClasses(response.data.data);
      } else {
        setClasses([]);
      }
    } catch (error) {
      message.error("Failed to fetch classes!");
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Submit handler (Create / Update)
  const handleSubmit = async (values) => {
    try {
      setSaving(true);

      const payload = {
        ...values,
        stockcount: [values.stockcount], // backend expects array
        image: imageUrl || null,
      };

      if (editId) {
        await api.put(`/class/${editId}`, payload);
        message.success("Class updated successfully!");
        setEditId(null);
      } else {
        await api.post("/class", payload);
        message.success("Class created successfully!");
      }

      await fetchClasses();
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
  const onEdit = (cls) => {
    setEditId(cls._id);
    form.setFieldsValue({
      name: cls.name || "",
      price: cls.price || "",
      description: cls.description || "",
      stockcount: cls.stockcount?.[0] || "",
    });
    setImageUrl(cls.image || null);
  };

  // Delete handler
  const deleteClass = async (id) => {
    try {
      await api.delete(`/class/${id}`);
      message.success("Class deleted successfully!");
      await fetchClasses();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete class!");
    }
  };

  // File Upload
  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl = res?.data?.fileUrl;
      if (!uploadedUrl) throw new Error("Upload response missing fileUrl");

      setImageUrl(uploadedUrl);
      message.success("Image uploaded successfully!");
      if (onSuccess) onSuccess("ok");
    } catch (err) {
      console.error("Upload error:", err);
      message.error("Image upload failed!");
      if (onError) onError(err);
    }
  };

  // Table columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Stock Count",
      dataIndex: "stockcount",
      key: "stockcount",
      render: (stockcount) => (stockcount || []).join(", "),
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
          <Button danger size="small" onClick={() => deleteClass(record._id)}>
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
            {editId ? "Edit Product" : "Create Product"}
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
                  label="Product Name"
                  rules={[{ required: true, message: "Please enter product name" }]}
                >
                  <Input placeholder="Enter product name" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="price"
                  label="Product Price"
                  rules={[{ required: true, message: "Please enter price" }]}
                >
                  <Input placeholder="Enter price" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="description"
                  label="Product Description"
                  rules={[{ required: true, message: "Please enter description" }]}
                >
                  <Input placeholder="Enter description" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="stockcount"
                  label="Stock of Product"
                  rules={[{ required: true, message: "Please enter stock count" }]}
                >
                  <Input placeholder="Enter stock count" />
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
                  {editId ? "Update Product" : "Create Product"}
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
                Product List
              </Title>
              <div style={{ width: "100%", overflowX: "auto" }}>
                <Table
                  dataSource={classes}
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
