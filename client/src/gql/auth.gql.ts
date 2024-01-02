import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
    }
  }
`;
