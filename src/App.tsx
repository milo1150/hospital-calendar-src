import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  // Router,
  Redirect,
} from 'react-router-dom';

import AuthContextProvider from '../src/Context/AuthContext';
import Calendar from '../src/container/Main/Main';
import Login from '../src/components/Login/Login';
// import ErrorPage from '../src/components/Utils/PageNotFound';
import ProtectRoute from '../src/components/Utils/ProtectRoute';
import WorkSheetSetting from '../src/components/Worksheet/SelectWs';

const App: React.FC = () => {
  // exTS();
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectRoute
            exact={true}
            path="/setup"
            component={WorkSheetSetting}
          />
          <ProtectRoute exact={true} path="/worksheet" component={Calendar} />
          <Redirect to="/login" />
          {/* <Route component={ErrorPage} /> */}
        </Switch>
      </BrowserRouter>
    </AuthContextProvider>
  );
};

export default App;
