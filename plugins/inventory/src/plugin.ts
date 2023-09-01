import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { inventoryApiRef, InventoryClient } from './apis';

export const inventoryPlugin = createPlugin({
  id: 'inventory',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: inventoryApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new InventoryClient(discoveryApi, fetchApi),
    }),
  ],
});

export const InventoryPage = inventoryPlugin.provide(
  createRoutableExtension({
    name: 'InventoryPage',
    component: () =>
      import('./components/Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);

export const ServerListPage = inventoryPlugin.provide(
  createRoutableExtension({
    name: 'ServerListPage',
    component: () =>
      import('./components/ServerListPage').then(m => m.ServerListPage),
    mountPoint: rootRouteRef,
  }),
);
