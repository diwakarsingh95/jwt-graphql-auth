import { gql } from "./__generated__";

export const GET_USERS_QUERY = gql(`
  query Users {
    users {
      id
      email
    }
  }
`);
