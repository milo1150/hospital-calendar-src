import React, {
  FunctionComponent,
  useEffect,
  useContext,
  useState,
} from 'react';
import { TextField } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'antd';

import { auth } from '../../firebase.js';
// import { AuthContext } from '../../Context/AuthContext';
import { FormLoginInputs } from '../../Typescript/ContextTypes';
// import { useDispatch } from 'react-redux';

interface props {
  history: Object[];
}

const Login: FunctionComponent<props> = (props): any => {
  const { handleSubmit, errors, control } = useForm<FormLoginInputs>();
  // const context = useContext(AuthContext);
  const [loginError, setLoginError] = useState<boolean>(true);
  // const _dispatch = useDispatch();

  useEffect(() => {
    auth.signOut(); // no invoke when history get push but if rerender it will
  }, []);

  const loginHandler = async (data: FormLoginInputs) => {
    setLoginError(true);
    const username = data.username + '@gmail.com';
    const password = data.password;
    try {
      await auth.signInWithEmailAndPassword(username, password).then(() => {
        return props.history.push('/setup');
      });
    } catch (error) {
      setLoginError(false);
    }
  };

  return (
    <div className="form-login">
      <form onSubmit={handleSubmit(loginHandler)}>
        <div className="form-login__input-layout">
          <Controller
            as={TextField}
            control={control}
            defaultValue=""
            label="ID"
            name="username"
            variant="outlined"
            size="medium"
            className="form-login__input-element"
            rules={{
              required: true,
              pattern: {
                value: /^[A-Za-z0-9][A-Za-z0-9]*$/i,
                message: 'invalid type',
              },
            }}
          />
          <span className="span-error">
            {errors.username &&
              errors.username.type === 'required' &&
              'ID is required'}
            {errors.username &&
              errors.username.type === 'pattern' &&
              errors.username.message}
          </span>
        </div>
        <div className="form-login__input-layout">
          <Controller
            as={TextField}
            control={control}
            defaultValue=""
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            className="form-login__input-element"
            rules={{
              required: true,
            }}
          />
          <span className="span-error">
            {errors.password &&
              errors.password.type === 'required' &&
              'Password is required'}
          </span>
        </div>
        <span className="span-error" hidden={loginError}>
          just try again...
        </span>
        <div className="form-login__button-box">
          <Button
            className="form-login__button form-login__button--normal"
            htmlType="submit"
          >
            LOGIN
          </Button>
          {/* <Divider className="form-login__divider">OR</Divider> */}
          {/* <Button
            className="form-login__button form-login__button--demo"
            onClick={() => context?.setLogout()}
          >
            DEMO
          </Button> */}
        </div>
      </form>
      {/* <button onClick={() => test()}>TEST</button>  */}
    </div>
  );
};

export default Login;
