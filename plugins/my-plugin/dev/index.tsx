import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { createDevApp } from '@backstage/dev-utils';
import { myPluginPlugin, EntityMyPluginContent } from '../src/plugin';
import { TestApiProvider } from '@backstage/test-utils';
import { MyPluginApi, myPluginApiRef } from '../src';

const mockEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'backstage',
    description: 'backstage.io',
    annotations: {
      'backstage.io/kubernetes-id': 'dice-roller',
    },
  },
  spec: {
    lifecycle: 'production',
    type: 'service',
    owner: 'user:guest',
  },
};

class MockMyPluginClient implements MyPluginApi {
  async getHealth(): Promise<{ status: string }> {
    return { status: 'ok' };
  }
}

createDevApp()
  .registerPlugin(myPluginPlugin)
  .addPage({
    path: '/fixture-1',
    title: 'Fixture 1',
    element: (
      <TestApiProvider apis={[[myPluginApiRef, new MockMyPluginClient()]]}>
        <EntityProvider entity={mockEntity}>
          <EntityMyPluginContent />
        </EntityProvider>
      </TestApiProvider>
    ),
  })
  .render();
