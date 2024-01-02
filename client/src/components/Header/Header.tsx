import { Link, NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 w-full">
      <div className="flex justify-between p-4 bg-slate-200">
        <div className="text-xl font-semibold">
          <Link to="/">
            <span className="text-slate-700">JWT GraphQL </span>
            <span className="text-slate-500">Auth</span>
          </Link>
        </div>
        <nav className="flex gap-2 text-slate-500">
          <NavLink className="hidden md:inline" to="/">
            Home
          </NavLink>
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/login">Login</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
