import React from 'react';
import { Button, Form, Input } from 'antd';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

type FormProps = {
  onSubmit: any;
};

export const KafkaForm = (props: FormProps) => {
  const [form] = Form.useForm();

  return (
    <Form
      {...layout}
      form={form}
      name="control-hooks"
      style={{ maxWidth: 600 }}
      onFinish={props.onSubmit}
      scrollToFirstError
    >
      <Form.Item name="id" label="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="zookeeperNodes"
        label="Zookeeper Nodes"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="brokers" label="Brokers" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="version" label="Version" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="adminUrl" label="Admin Url" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="adminUser"
        label="Admin User"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="adminPassword"
        label="Admin Password"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
