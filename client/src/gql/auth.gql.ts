import { gql } from "./__generated__";

export const REGISTER_MUTATION = gql(`
  mutation Register($password: String!, $email: String!) {
    register(password: $password, email: $email) {
      success
      message
    }
  }
`);

export const LOGIN_MUTATION = gql(`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
    }
  }
`);

export const LOGOUT_MUTATION = gql(`
  mutation Mutation {
    logout
  }
`);
