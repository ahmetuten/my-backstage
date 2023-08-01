import {
  HomePageToolkit,
  HomePageCompanyLogo,
  HomePageStarredEntities,
  TemplateBackstageLogoIcon,
} from '@backstage/plugin-home';
import { wrapInTestApp, TestApiProvider } from '@backstage/test-utils';
import { Content, Page, InfoCard } from '@backstage/core-components';
import {
  starredEntitiesApiRef,
  MockStarredEntitiesApi,
  entityRouteRef,
  catalogApiRef,
} from '@backstage/plugin-catalog-react';
import { configApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/config';
import { HomePageSearchBar, searchPlugin } from '@backstage/plugin-search';
import {
  searchApiRef,
  SearchContextProvider,
} from '@backstage/plugin-search-react';
import {
  stackOverflowApiRef,
  HomePageStackOverflowQuestions,
} from '@backstage/plugin-stack-overflow';
import { Grid, makeStyles } from '@material-ui/core';
import React, { ComponentType, PropsWithChildren } from 'react';
import TomPayLogo from './TomPayLogo';
import ToolkitTempIcon from './ToolkitTempIcon';

const entities = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'mock-starred-entity',
      title: 'Mock Starred Entity!',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'mock-starred-entity-2',
      title: 'Mock Starred Entity 2!',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'mock-starred-entity-3',
      title: 'Mock Starred Entity 3!',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'mock-starred-entity-4',
      title: 'Mock Starred Entity 4!',
    },
  },
];

const mockCatalogApi = {
  getEntities: async () => ({ items: entities }),
};

const mockStackOverflowApi = {
  listQuestions: async () => [
    {
      title: 'Customizing Spotify backstage UI',
      link: 'stackoverflow.question/1',
      answer_count: 0,
      tags: ['backstage'],
      owner: { 'some owner': 'name' },
    },
    {
      title: 'Customizing Spotify backstage UI',
      link: 'stackoverflow.question/1',
      answer_count: 0,
      tags: ['backstage'],
      owner: { 'some owner': 'name' },
    },
  ],
};

const starredEntitiesApi = new MockStarredEntitiesApi();
starredEntitiesApi.toggleStarred('component:default/example-starred-entity');
starredEntitiesApi.toggleStarred('component:default/example-starred-entity-2');
starredEntitiesApi.toggleStarred('component:default/example-starred-entity-3');
starredEntitiesApi.toggleStarred('component:default/example-starred-entity-4');

// s.overflow mock api

// export default {
//   title: 'Plugins/Home/Templates',
//   decorators: [
//     (Story: ComponentType<PropsWithChildren<{}>>) =>
//       wrapInTestApp(
//         <>
//           <TestApiProvider
//             apis={[
//               [stackOverflowApiRef, mockStackOverflowApi],
//               [catalogApiRef, mockCatalogApi],
//               [starredEntitiesApiRef, starredEntitiesApi],
//               [searchApiRef, { query: () => Promise.resolve({ results: [] }) }],
//               [
//                 configApiRef,
//                 new ConfigReader({
//                   stackoverflow: {
//                     baseUrl: 'https://api.stackexchange.com/2.2',
//                   },
//                 }),
//               ],
//             ]}
//           >
//             <Story />
//           </TestApiProvider>
//         </>,
//         {
//           mountedRoutes: {
//             '/hello-company': searchPlugin.routes.root,
//             '/catalog/:namespace/:kind/:name': entityRouteRef,
//           },
//         },
//       ),
//   ],
// };

// anasayfa search bar style'ı
const useStyles = makeStyles(theme => ({
  searchBarInput: {
    maxWidth: '60vw',
    margin: 'auto',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '50px',
    boxShadow: theme.shadows[1],
  },
  searchBarOutline: {
    borderStyle: '',
  },
}));

// logonun style'ı
const useLogoStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(5, 0), // ustten/alttan 5*8 = 40px margin,
  },
  svg: {
    width: 'auto',
    height: 100, // svgnin genislik yukseklıgı
  },
  path: {
    fill: '#7df3e1', // çizilen svg'nin içini hangi renkle doldurduğu
  },
}));

export const HomePageTemplate = () => {
  const classes = useStyles();
  const { container } = useLogoStyles();

  return (
    <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TomPayLogo />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar
                InputProps={{
                  classes: {
                    root: classes.searchBarInput,
                    notchedOutline: classes.searchBarOutline,
                  },
                }}
                placeholder="Search"
              />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              {/* Toolkit Start */}
              <Grid item xs={12} md={6}>
                {/* Same key hatası buradaki url'den geliyor. */}
                <HomePageToolkit
                  tools={Array(5).fill({
                    url: '',
                    label: 'Tool',
                    icon: <ToolkitTempIcon />,
                  })}
                />
              </Grid>
              {/* Toolkit End */}

              <Grid item xs={12} md={6}>
                {/* <HomePageStackOverflowQuestions
                  requestParams={{
                    tagged: 'backstage',
                    site: 'stackoverflow',
                    pagesize: 5,
                  }}
                /> */}
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>
  );
};
