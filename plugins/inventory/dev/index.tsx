import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { inventoryPlugin, InventoryPage } from '../src/plugin';

createDevApp()
  .registerPlugin(inventoryPlugin)
  .addPage({
    element: <InventoryPage />,
    title: 'Root Page',
    path: '/inventory'
  })
  .render();
