import React from 'react';

import { Table, Button, Tag, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { KafkaModel } from '@internal/plugin-kafka-api-backend/src/service/persistance/KafkaDatabase';

import {
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { TableProps } from '../Props';

interface KafkaTableProps extends TableProps {
  onTopicClicked: any;
}

export const KafkaTable = (props: KafkaTableProps) => {
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
          props.onTopicClicked(values);
        };

        return (
          <div>
            <Button type="link" onClick={onTopicClicked}>
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
          props.onEditClicked(values);
        };

        const onDeleteClicked = async (values: any) => {
          props.onDeleteClicked(values);
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

  return <Table columns={columns} dataSource={props.data} />;
};
