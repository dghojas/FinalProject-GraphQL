import { gql } from 'apollo-boost';
import { USER_INFO, POST_DATA } from './fragments';

export const PROFILE = gql`
  query {
    profile {
      ...userInfo
    }
  }
  ${USER_INFO}
`;

export const PUBLIC_PROFILE = gql`
  query publicProfile($username: String!) {
    publicProfile(username: $username) {
      _id
      name
      email
      username
      images {
        public_id
        url
      }
      about
    }
  }
`;

export const ALL_USERS = gql`
  query {
    allUsers {
      ...userInfo
    }
  }
  ${USER_INFO}
`;

export const GET_POST_ID = gql`
  query postGetId($_id: String!) {
    postGetId(_id: $_id) {
      ...postData
    }
  }
  ${POST_DATA}
`;

export const GET_ALL_POST = gql`
  query allTodosPost($offset: Int!, $limit: Int!) {
    allTodosPost(offset: $offset, limit: $limit) {
      todos {
        ...postData
      }
      totalCount
    }
  }
  ${POST_DATA}
`;

export const GET_SEARCH_POST = gql`
  query postSearch($filter: String!) {
    postSearch(filter: $filter) {
      ...postData
    }
  }
  ${POST_DATA}
`;

export const POSTS_BY_USER = gql`
  query {
    postsByUser {
      ...postData
    }
  }
  ${POST_DATA}
`;