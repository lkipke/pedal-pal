import { Pane, Text } from 'evergreen-ui';
import React from 'react';
import { User } from '../api/types';

interface Props {
  user: User;
}

const MetricsPage: React.FC<Props> = ({ user }) => {
  return (
    <Pane display='flex'>
      <Text>{user.firstName}</Text>
    </Pane>
  );
};

export default MetricsPage;
