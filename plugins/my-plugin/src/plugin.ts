import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';
import { rootCatalogMyPluginRouteRef } from './routes';
import { MyPluginApiImpl } from './api/MyPluginApiImpl';
import { myPluginApiRef } from './api/MyPluginApi';

export const myPluginPlugin = createPlugin({
  id: 'my-plugin',
  apis: [], // Define your API here if needed
  routes: {
    root: rootCatalogMyPluginRouteRef,
  },
});

export const EntityMyPluginContent = myPluginPlugin.provide(
  createRoutableExtension({
    name: 'EntityMyPluginContent',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootCatalogMyPluginRouteRef,
  }),
);

export { MyPluginApiImpl };
