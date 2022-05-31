import React, { useEffect, useState } from 'react';
import { getUserFromStoredCredentials } from '../api';
import { User } from '../api/types';

interface Context {
  user?: User;
  setUser(newUser: User): void;
}

export const UserContext = React.createContext<Context>({ setUser: () => {} });

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  let [user, setUser] = useState<User>();

  useEffect(() => {
    getUserFromStoredCredentials().then((userResponse) => {
      if (userResponse) {
        setUser(userResponse);
      }
    });
  }, []);

  return <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>;
};

export default UserProvider;
