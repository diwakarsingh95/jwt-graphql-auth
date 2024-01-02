import { useMutation } from "@apollo/client";
import React from "react";
import { REGISTER_MUTATION } from "../../gql/auth.gql";
import { useNavigate } from "react-router-dom";

type RegisterForm = HTMLFormElement & {
  email: HTMLInputElement;
  password: HTMLInputElement;
};

const Register = () => {
  const navigate = useNavigate();
  const [register, { loading, error, reset }] = useMutation(REGISTER_MUTATION);

  const handleSubmit = async (e: React.FormEvent<RegisterForm>) => {
    e.preventDefault();
    reset();

    const { currentTarget } = e;
    const { email, password } = currentTarget;

    try {
      await register({
        variables: { email: email.value, password: password.value },
      });
      navigate("/login", { state: { email: email.value } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semitbold text-center">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5 p-5">
        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          className="p-2 rounded-lg border"
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
          {loading ? "Submitting..." : "Submit"}
        </button>
        {error && <p className="text-red-500">{error.message}</p>}
      </form>
    </div>
  );
};

export default Register;
