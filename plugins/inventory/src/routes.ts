import { createRouteRef, createSubRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'inventory',
});

export const serverRouteRef = createSubRouteRef({
  id: 'inventory/server',
  path: '/server',
  parent: rootRouteRef,
});

export const databaseRouteRef = createSubRouteRef({
  id: 'inventory/database',
  path: '/database',
  parent: rootRouteRef,
});

export const kafkaRouteRef = createSubRouteRef({
  id: 'inventory/kafka',
  path: '/kafka',
  parent: rootRouteRef,
});