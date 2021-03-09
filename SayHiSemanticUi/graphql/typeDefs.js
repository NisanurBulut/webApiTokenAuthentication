const  gql  = require('graphql-tag');

module.exports = gql`
  type PostBook {
    id: ID!
    author: String!
    name: String!
    username: String!
    createdAt: String!
  }
  type User {
    id: ID!,
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getBookPosts: [PostBook]
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
  }
`;