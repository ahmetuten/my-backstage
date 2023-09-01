import React, { ReactNode, useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';

import { Table, Tag, Button, Modal, Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ServerModel } from '@internal/data';

import { inventoryApiRef } from '../../apis';

import { useApi } from '@backstage/core-plugin-api';

const columns: ColumnsType<ServerModel> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Operating System',
    dataIndex: 'operatingSystem',
    key: 'operatingSystem',
  },
  {
    title: 'CPU',
    dataIndex: 'cpu',
    key: 'cpu',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
];

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

type AnnouncementPageProps = {
  themeId: string;
  title: string;
  subtitle?: ReactNode;
};

export const ServerListPage = (props: AnnouncementPageProps) => {
  const [form] = Form.useForm();
  const [servers, setServers] = useState<ServerModel[]>([]);
  const [open, setOpen] = useState(false);
  const api = useApi(inventoryApiRef);

  async function reload() {
    const serverList = await api.getServers();
    setServers(serverList);
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
        <ContentHeader title="Server List">
          <Button type="primary" onClick={() => setOpen(true)}>
            Add New Item
          </Button>
          <SupportButton>You can add or update Servers on this page.</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <Table columns={columns} dataSource={servers} />
          </Grid>
        </Grid>
        <Modal
          title="Add/Update New Item"
          centered
          open={open}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          width={1000}
        >
          <Form
            {...layout}
            form={form}
            name="control-hooks"
            style={{ maxWidth: 600 }}
          >
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="operatingSystem" label="Operating System" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="cup" label="CPU" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="tags" label="Tags" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Page>
  );
};
