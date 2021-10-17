const { gql } = require("apollo-server-express");

module.exports = gql`
  type Post {
    _id: ID!
    content: String
    image: Image
    postedBy: User
  }
  type TodosResult {
    todos: [Post]
    totalCount: Int
  }
  # input type
  input PostCreateInput {
    content: String!
    image: ImageInput
  }
  input PostUpdateInput {
    _id: ID!
    content: String
    image: ImageInput
  }
  input PostDeleteInput {
    _id: ID!
  }
  type Query {
    allTodosPost(offset: Int!, limit: Int!): TodosResult!
    postSearch(filter: String!): [Post!]!
    postsByUser: [Post!]!
    postGetId(_id: String!): [Post!]!
  }
  # mutations
  type Mutation {
    postCreate(input: PostCreateInput!): Post!
    postUpdate(input: PostUpdateInput): Post!
    postDelete(input: PostDeleteInput): Post!
  }
`;