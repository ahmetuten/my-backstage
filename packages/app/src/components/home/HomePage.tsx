import { Content, Page } from '@backstage/core-components';
import { MockStarredEntitiesApi } from '@backstage/plugin-catalog-react';
import { HomePageSearchBar } from '@backstage/plugin-search';
import { SearchContextProvider } from '@backstage/plugin-search-react';
import { CardHeader, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import TomPayLogo from './TomPayLogo';
import ToolkitTempIcon from './ToolkitTempIcon';
import './home-page.css';
import {
  HomePageToolkit,
  HomePageCompanyLogo,
  HomePageStarredEntities,
} from '@backstage/plugin-home';

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

const starredEntitiesApi = new MockStarredEntitiesApi();
starredEntitiesApi.toggleStarred('component:default/example-starred-entity');
starredEntitiesApi.toggleStarred('component:default/example-starred-entity-2');
starredEntitiesApi.toggleStarred('component:default/example-starred-entity-3');
starredEntitiesApi.toggleStarred('component:default/example-starred-entity-4');

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
                {/* <JiraOverview /> */}
                {/* <MediaCard /> */}
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>
  );
};
