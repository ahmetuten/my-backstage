import React, { useState, useRef, useEffect } from 'react';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';

import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Tag,
  message,
  Popconfirm,
} from 'antd';
import type { InputRef } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  KafkaModel,
  KafkaTopicModel,
} from '@internal/plugin-kafka-api-backend/src/service/persistance/KafkaDatabase';

import { inventoryApiRef } from '../../apis';
import { useApi } from '@backstage/core-plugin-api';

import {
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { FORM_LAYOUT, FORM_TAIL_LAYOUT } from '../../util';
import { PageProps } from '../Props';

export const KafkaListPage = (props: PageProps) => {
  const modelName = 'Kafka';
  const [form] = Form.useForm();

  const [kafkas, setKafkas] = useState<KafkaModel[]>([]);
  const [open, setOpen] = useState(false);
  const api = useApi(inventoryApiRef);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [topics, setTopics] = useState<KafkaTopicModel[]>([]);
  const inputRef = useRef<InputRef>(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedKafka, setSelectedKafka] = useState<KafkaModel>();

  const onFinish = async (values: any) => {
    if (!values.id) {
      await api.addKafka(values);
      message.info('Successfully added!');
    } else {
      await api.updateKafka(values);
      message.info('Successfully updated!');
    }
    setOpen(false);
    reload();
  };

  const topicColumns: ColumnsType<KafkaTopicModel> = [
    {
      title: 'Topic Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '',
      key: '',
      render: (_, record) => {
        const onDeleteClicked = async (values: any) => {
          await api.deleteKafkaTopic(selectedKafka, record.name);
          message.success(`Successfully deleted!`);
          fetchTopics(selectedKafka);
        };

        return (
          <div>
            <Popconfirm
              title="Delete Operation"
              description="Are you sure to delete?"
              onConfirm={() => onDeleteClicked(record)}
              okText="Yes"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              cancelText="No"
            >
              <Button
                icon={<DeleteOutlined />}
                style={{ color: 'red' }}
                type="link"
                color="red"
              />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const columns: ColumnsType<KafkaModel> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Zookeeper Nodes',
      dataIndex: 'zookeeperNodes',
      key: 'zookeeperNodes',
      render: (_, { zookeeperNodes }) => (
        <>
          {zookeeperNodes.split(',').map(tag => {
            return (
              <Tag color="geekblue" key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Brokers',
      dataIndex: 'brokers',
      key: 'brokers',
      render: (_, { brokers }) => (
        <>
          {brokers.split(',').map(tag => {
            return (
              <Tag color="geekblue" key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Admin Url',
      dataIndex: 'adminUrl',
      key: 'adminUrl',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const onTopicClicked = (values: any) => {
          setInputValue('');
          setSelectedKafka(values);
          fetchTopics(values);
          setIsTopicModalOpen(true);
        };

        return (
          <div>
            <Button type="link" onClick={() => onTopicClicked(record)}>
              Topics
            </Button>
          </div>
        );
      },
    },
    {
      title: '',
      key: '',
      render: (_, record) => {
        const onEditClicked = (values: any) => {
          setSelectedKafka(values);
          form.setFieldsValue(values);
          setOpen(true);
        };

        const onDeleteClicked = async (values: any) => {
          await api.deleteKafka(values.id);
          message.success(`Successfully deleted!`);
          reload();
        };

        return (
          <div>
            <Popconfirm
              title="Delete Operation"
              description="Are you sure to delete?"
              onConfirm={() => onDeleteClicked(record)}
              okText="Yes"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              cancelText="No"
            >
              <Button
                icon={<DeleteOutlined />}
                style={{ color: 'red' }}
                type="link"
                color="red"
              />
            </Popconfirm>

            <Button
              icon={<EditOutlined />}
              type="link"
              onClick={() => onEditClicked(record)}
            />
          </div>
        );
      },
    },
  ];

  const handleOk = () => {
    setIsTopicModalOpen(false);
  };

  const handleCancel = () => {
    setIsTopicModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    setInputValue('');
    // add topic
  };

  async function reload() {
    const kafkaList = await api.getKafkas();
    setKafkas(kafkaList);
  }

  async function fetchTopics(kafkaModel: KafkaModel) {
    const kafkaTopics = await api.getKafkaTopics(kafkaModel);
    setTopics(kafkaTopics);
  }

  useEffect(() => {
    reload();
  }, []);

  return (
    <Page themeId={props.themeId}>
      <Header
        title="Inventory"
        subtitle="Tom Digital Inventory Management System"
      >
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Kafka List">
          <Button
            type="default"
            onClick={() => {
              form.resetFields();
              setOpen(true);
            }}
          >
            {`Add New ${modelName}`}
          </Button>
          <SupportButton>
            You can add or update Kafka on this page.
          </SupportButton>
        </ContentHeader>

        <Table columns={columns} dataSource={kafkas} />

        <Modal
          title={`Add/Update ${modelName}`}
          centered
          footer={null}
          open={open}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          width={1000}
        >
          <Form
            {...FORM_LAYOUT}
            form={form}
            name="control-hooks"
            style={{ maxWidth: 600 }}
            onFinish={onFinish}
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
            <Form.Item
              name="brokers"
              label="Brokers"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="version"
              label="Version"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="adminUrl"
              label="Admin Url"
              rules={[{ required: true }]}
            >
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
            <Form.Item {...FORM_TAIL_LAYOUT}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={`Kafka Topics [${selectedKafka?.name}]`}
          open={isTopicModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          Topic Name:
          <Input
            style={{ width: '200px', marginLeft: '10px', marginRight: '10px' }}
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onPressEnter={handleInputConfirm}
          />
          <Button
            style={{ marginTop: '10px' }}
            type="primary"
            onClick={async () => {
              await api.addKafkaTopic(selectedKafka, inputValue);
              message.success(`Successfully added!`);
              fetchTopics(selectedKafka);
            }}
          >
            Add New Topic
          </Button>
          <Table
            style={{ marginTop: '20px' }}
            columns={topicColumns}
            dataSource={topics}
          />
        </Modal>
      </Content>
    </Page>
  );
};
