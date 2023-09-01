import { ReactNode } from 'react';

export type PageProps = {
  themeId: string;
  title: string;
  subtitle?: ReactNode;
};

export type TableProps = {
  data: any;
  onEditClicked: any;
  onDeleteClicked: any;
  onTopicClicked: any;
};
