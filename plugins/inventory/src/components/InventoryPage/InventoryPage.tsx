import React, { ReactNode } from 'react';
import { Grid } from '@material-ui/core';
import { Header, Page, Content, HeaderLabel } from '@backstage/core-components';
import { Card } from 'antd';

import { CloudServerOutlined } from '@ant-design/icons';

const { Meta } = Card;

type AnnouncementPageProps = {
  themeId: string;
  title: string;
  subtitle?: ReactNode;
};

export const InventoryPage = (props: AnnouncementPageProps) => {
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
        <Grid container item xs={12}>
          <Grid item xs={2} md={2}>
            <Card
              hoverable
              style={{ width: 240 }}
              onClick={() => (window.location.href = '/inventory/server')}
              cover={<CloudServerOutlined style={{ fontSize: 100 }} />}
            >
              <Meta title="Server List" />
            </Card>
          </Grid>
          <Grid item xs={2} md={2}>
            <Card
              hoverable
              style={{ width: 240 }}
              onClick={() => (window.location.href = '/inventory/database')}
              cover={<CloudServerOutlined style={{ fontSize: 100 }} />}
            >
              <Meta title="Database List" />
            </Card>
          </Grid>
          <Grid item xs={2} md={2}>
            <Card
              hoverable
              style={{ width: 240 }}
              onClick={() => (window.location.href = '/inventory/kafka')}
              cover={<CloudServerOutlined style={{ fontSize: 100 }} />}
            >
              <Meta title="Kafka List" />
            </Card>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
