import React, { FunctionComponent, useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { useContextGlobal } from '../../Typescript/ContextTypes';
import { auth } from '../../firebase';

// SINGLE PROTECT ROUTE
interface propTypes {
  component: FunctionComponent & any;
  exact: boolean;
  path: string;
}

/* Get localstoragekey for route check */
const localKey = localStorage.getItem('LOG');

const ProtectRoute: FunctionComponent<propTypes> = (props): any => {
  const context = useContext<useContextGlobal>(AuthContext); // Compiler read this shit ... but it's work fine for rerender *loginStatus get update

  const { component: Component, ...rest } = props; // component: Component is cut component from default ...rest
  return (
    <Route
      {...rest}
      render={(props) => {
        return auth.currentUser || localKey ? ( // THIS LINE IS GOLDEN KEY.
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    ></Route>
  );
};
export default ProtectRoute;
