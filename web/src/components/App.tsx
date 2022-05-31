import React, { useContext } from 'react';
import { UserContext } from '../providers/UserContext';
import LoginPage from './LoginPage';
import MetricsPage from './MetricsPage';

function App() {
  let user = useContext(UserContext);
  return user ? <MetricsPage user={user} /> : <LoginPage />;
}

export default App;
