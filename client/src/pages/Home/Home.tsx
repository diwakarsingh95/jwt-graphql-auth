import { useQuery } from "@apollo/client";
import { GET_USERS_QUERY } from "../../gql/user.gql";
import { useContext } from "react";
import { AuthContext, AuthContextType } from "../../context/AuthContext";

const Home = () => {
  const { accessToken } = useContext(AuthContext) as AuthContextType;
  const { data, loading } = useQuery(GET_USERS_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  return (
    <div className="max-w-2xl mx-auto flex flex-col justify-center gap-4 p-2">
      <h1 className="text-2xl text-center">Users</h1>
      {loading && <p>Loading...</p>}
      {!loading ? (
        data && data.users ? (
          <table className="border-collapse border border-slate-500">
            <thead>
              <tr>
                <th className="font-semibold border border-slate-600">ID</th>
                <th className="font-semibold border border-slate-600">Email</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user.id}>
                  <td className="border border-slate-700">{user.id}</td>
                  <td className="border border-slate-700">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Data</p>
        )
      ) : null}
    </div>
  );
};

export default Home;
