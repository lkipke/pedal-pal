import { Pane, Button, Popover } from 'evergreen-ui';
import React, { useCallback, useContext } from 'react';
import { logout } from '../api';
import { User } from '../api/types';
import { UserContext } from '../providers/UserContext';
import LoginPage from './pages/LoginPage';
import MetricsPage from './pages/MetricsPage';

interface UserMenuProps {
  user: User;
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const { refreshUser } = useContext(UserContext);

  const onLogoutClicked = useCallback(async () => {
    await logout();
    refreshUser();
  }, [refreshUser]);

  return (
    <Pane margin={25}>
      <Popover
        trigger='hover'
        minWidth={78}
        minHeight={32}
        shouldCloseOnExternalClick={true}
        content={
          <Pane
            width={78}
            height={32}
            display='flex'
            alignItems='center'
            justifyContent='center'
            flexDirection='column'
          >
            <Button color='red' onClick={onLogoutClicked}>
              Log out
            </Button>
          </Pane>
        }
      >
        <Button float='right'>{user.firstName}</Button>
      </Popover>
    </Pane>
  );
};

function App() {
  let { user } = useContext(UserContext);

  return !user ? (
    <LoginPage />
  ) : (
    <Pane>
      <UserMenu user={user} />
      <MetricsPage />
    </Pane>
  );
}

export default App;
