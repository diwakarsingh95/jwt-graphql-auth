import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { BACKEND_URL } from "../utils/constants";

export type AuthContextType = {
  accessToken: string;
  setAccessToken: Dispatch<SetStateAction<string>>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    fetch(`${BACKEND_URL}/refresh_token`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setAccessToken(data.accessToken);
      })
      .catch(console.error);
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
