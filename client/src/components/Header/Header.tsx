import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import { useMutation } from "@apollo/client";
import { LOGOUT_MUTATION } from "../../gql/auth.gql";

const Header = () => {
  const { accessToken, setAccessToken } = useContext(
    AuthContext
  ) as AuthContextType;
  const [logout, { loading }] = useMutation(LOGOUT_MUTATION);

  const handleLogout = async () => {
    try {
      await logout({
        context: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      });
      setAccessToken("");
    } catch (err) {
      console.error(err);
      if (err instanceof Error) alert(err.message);
      alert("Something went wrong.");
    }
  };

  return (
    <header className="fixed top-0 w-full">
      <div className="flex justify-between p-4 bg-slate-200">
        <div className="text-xl font-semibold">
          <Link to="/">
            <span className="text-slate-700">JWT GraphQL </span>
            <span className="text-slate-500">Auth</span>
          </Link>
        </div>
        <nav className="flex gap-2 text-slate-500 items-center">
          <NavLink className="hidden md:inline hover:underline" to="/">
            Home
          </NavLink>
          {!accessToken ? (
            <>
              <NavLink className="hover:underline" to="/register">
                Register
              </NavLink>
              <NavLink className="hover:underline" to="/login">
                Login
              </NavLink>
            </>
          ) : (
            <button disabled={loading} onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
