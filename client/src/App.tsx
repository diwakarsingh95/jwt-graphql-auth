import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "./gql/auth.gql";

function App() {
  const [login, { data, loading }] = useMutation(LOGIN_MUTATION);

  if (data) console.log(data.login.accessToken);
  if (loading) console.log(loading);

  return (
    <div>
      <button
        onClick={() => {
          login({
            variables: { email: "diwakar@mail.com", password: "Web@1234" },
          });
        }}
      >
        Login
      </button>
    </div>
  );
}

export default App;
