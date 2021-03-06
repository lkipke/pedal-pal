import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getUserFromStoredCredentials } from '../api';
import { User } from '../api/types';

interface Context {
  user?: User;
  setUser(newUser: User): void;
  refreshUser(): void;
}

export const UserContext = React.createContext<Context>({
  setUser: () => {},
  refreshUser: () => {},
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  let [user, setUser] = useState<User>();

  const refreshUser = useCallback(async () => {
    let userResponse = await getUserFromStoredCredentials();
    setUser(userResponse);
  }, [setUser]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const store = useMemo(
    () => ({ user, setUser, refreshUser }),
    [user, setUser, refreshUser]
  );

  return <UserContext.Provider value={store}>{children}</UserContext.Provider>;
};

export default UserProvider;
