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
  Select,
} from "antd";
import { motion } from "framer-motion";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import api from "../../Services/api";
import {
  fetchClasses,
  createClass,
  updateClass,
  deleteClass,
} from "../../features/classSlice";

const { Title } = Typography;
const { Option } = Select;

function ClassCreate() {
  const dispatch = useDispatch();
  const { data: classes, loading, saving } = useSelector(
    (state) => state.classes
  );

  const [editId, setEditId] = useState(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);

  // ✅ Category state
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchClasses());
    fetchCategories();
  }, [dispatch]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  // ✅ Submit handler
  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      stockcount: values.stockcount ? [values.stockcount] : [],
      image: imageUrl || null,
    };

    if (editId) {
      dispatch(updateClass({ id: editId, payload }));
      setEditId(null);
    } else {
      dispatch(createClass(payload));
    }

    form.resetFields();
    setImageUrl(null);
  };

  // ✅ Edit
  const onEdit = (cls) => {
    setEditId(cls._id);
    form.setFieldsValue({
      name: cls.name || "",
      price: cls.price || "",
      description: cls.description || "",
      stockcount: cls.stockcount?.[0] || "",
      category: cls.category || null,
    });
    setImageUrl(cls.image || null);
  };

  // ✅ Delete
  const onDelete = (id) => {
    dispatch(deleteClass(id));
  };

  // ✅ File Upload
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

  // ✅ Columns
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
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat) => cat || "N/A",
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
          <Button danger size="small" onClick={() => onDelete(record._id)}>
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

          {/* ✅ Form */}
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
                  label="Stock Count"
                  rules={[{ required: true, message: "Please enter stock count" }]}
                >
                  <Input placeholder="Enter stock count" />
                </Form.Item>
              </Col>

              {/* ✅ Category Select */}
              <Col xs={24} sm={12}>
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[{ required: true, message: "Please select category" }]}
                >
                  <Select placeholder="Select category">
                    {categories.map((cat) => (
                      <Option key={cat.id || cat._id} value={cat.name}>
                        {cat.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* ✅ Upload */}
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
                  style={{ background: "#0d3b66", color: "white" }}
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

          {/* ✅ Table */}
          {loading ? (
            <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
          ) : (
            <>
              <Title level={4} style={{ marginBottom: 16, color: "#444" }}>
                Product List
              </Title>
              <Table
                dataSource={classes}
                columns={columns}
                rowKey="_id"
                bordered
                pagination={{ pageSize: 5, responsive: true }}
                scroll={{ x: "max-content" }}
              />
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}

export default ClassCreate;
