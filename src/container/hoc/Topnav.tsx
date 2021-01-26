import React, { FunctionComponent, useContext } from 'react';
import { IconButton } from '@material-ui/core';
import { ExitToAppOutlined } from '@material-ui/icons';
import { AuthContext } from '../../Context/AuthContext';
import { useHistory } from 'react-router';

interface Prop {
  children: Object;
}
const Topnav: FunctionComponent<Prop> = (props): any => {
  const context = useContext(AuthContext);
  const username = context?.username;
  const history = useHistory();
  const logoutHandler: undefined | any = context?.setLogout;
  const logOut = async () => {
    await logoutHandler();
    history.push('/login');
  };

  return (
    <div className="main">
      <div className="top-nav">
        <div className="top-nav__user-action">
          {username && <p className="p--table-header">{username}</p>}
          <IconButton size="small" onClick={() => logOut()}>
            <ExitToAppOutlined className="actionbar__fabicon" />
          </IconButton>
        </div>
      </div>
      <div className="content">{props.children}</div>
    </div>
  );
};

export default Topnav;
