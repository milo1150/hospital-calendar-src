export type loginStatus = any;
export interface AuthContextType {
  loginStatus: loginStatus;
  username: string;
  setLogout: () => any;
}
export type useContextGlobal = AuthContextType | null;

export interface Types {
  children: any;
}

export interface FormLoginInputs {
  username: string;
  password: string;
}
