import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../../gql/auth.gql";
import { useContext } from "react";
import { AuthContext, AuthContextType } from "../../context/AuthContext";

type LoginForm = HTMLFormElement & {
  email: HTMLInputElement;
  password: HTMLInputElement;
};

const Login = () => {
  const { setAccessToken } = useContext(AuthContext) as AuthContextType;
  const [login, { loading, error, reset }] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const handleSubmit = async (e: React.FormEvent<LoginForm>) => {
    e.preventDefault();
    reset();

    const { currentTarget } = e;
    const { email, password } = currentTarget;

    try {
      const { data } = await login({
        variables: { email: email.value, password: password.value },
      });
      if (data && data.login.accessToken) {
        setAccessToken(data.login.accessToken);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semitbold text-center">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5 p-5">
        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          className="p-2 rounded-lg border"
          defaultValue={email || ""}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="p-2 rounded-lg border"
        />
        <button
          className="p-2 bg-slate-300 rounded-lg hover:bg-slate-200"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-500">{error.message}</p>}
      </form>
    </div>
  );
};

export default Login;
