import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from 'react';
import {
  Types,
  AuthContextType,
  loginStatus,
} from '../Typescript/ContextTypes';
import { auth } from '../firebase';
import { getTime } from 'date-fns';

export const AuthContext = React.createContext<AuthContextType | null>(null); // null because lazy to set default value

export function useAuth() {
  return useContext(AuthContext);
}

const AuthContextProvider: FunctionComponent<Types> = ({ children }) => {
  const [loginStatus, setLoginStatus] = useState<loginStatus>(); // Object | null because @start mount firebase auth not invoking
  const [username, setUsername] = useState<any>('');

  // console.log('CONTEXT PAGE auth.CurrentUser:', auth.currentUser);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      // console.log('CONTEXT RENDER');
      setLoginStatus(user); // It's magic. Rerender everypage for check singin status *accident
      let userEmail = user?.email;
      userEmail = userEmail?.substr(0, userEmail.indexOf('@'));
      setUsername(userEmail);
    });
  }, []);

  const setLocalKey = () => {
    const currentDate: Date = new Date();
    const dateToNumber: string = getTime(currentDate).toString();
    localStorage.setItem('LOG', dateToNumber);
  };

  const delLocalKey = () => {
    localStorage.removeItem('LOG');
  };

  const logoutHandler = () => {
    auth.signOut();
  };

  /* SET LOCALSTORAGE VALUE */
  if (!auth.currentUser) {
    delLocalKey();
    // console.log('no invoke');
  } else {
    setLocalKey();
    // console.log('invoke');
  }

  const value: AuthContextType = {
    loginStatus: loginStatus,
    username: username,
    setLogout: logoutHandler,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
