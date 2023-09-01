import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  serverRouteRef,
  kafkaRouteRef,
  databaseRouteRef,
} from '../routes';
import { InventoryPage } from './InventoryPage';
import { ServerListPage } from './ServerListPage';
import { DatabaseListPage } from './DatabaseListPage';
import { KafkaListPage } from './KafkaListPage';

type RouterProps = {
  themeId?: string;
  title?: string;
  subtitle?: string;
};

export const Router = (props: RouterProps) => {
  const propsWithDefaults = {
    themeId: 'home',
    title: 'Inventory',
    ...props,
  };

  return (
    <Routes>
      <Route path="/" element={<InventoryPage {...propsWithDefaults} />} />
      <Route
        path={`${serverRouteRef.path}`}
        element={<ServerListPage {...propsWithDefaults} />}
      />
       <Route
        path={`${serverRouteRef.path}`}
        element={<ServerListPage {...propsWithDefaults} />}
      />
      <Route
       path={`${kafkaRouteRef.path}`}
       element={<KafkaListPage {...propsWithDefaults} />}
      />
      <Route
       path={`${databaseRouteRef.path}`}
       element={<DatabaseListPage {...propsWithDefaults} />}
      />
    </Routes>
  );
};
