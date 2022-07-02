require("dotenv/config");
const express = require("express");
const {
  buildSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLSchema,
} = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const { PORT = 5000 } = process.env;
const tasks = require("./tasks.json");
const projects = require("./projects.json");
const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: () => ({
    id: { type: GraphQLID },
    description: { type: GraphQLString },
    name: { type: GraphQLString },
    deadline: { type: GraphQLString },
    project: {
      type: ProjectType,
      resolve(parent, args) {
        return projects.find((project) => project.id == parent.projectId);
      },
    },
  }),
});
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    title: { type: GraphQLString },
    description: { type: GraphQLString },
  }),
});
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    task: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return tasks.find((task) => task.id == args.id);
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return projects.find((project) => project.id === args.id);
      },
    },
  },
});
const schema = new GraphQLSchema({
  query: RootQuery,
});
const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
app.listen(PORT, () => {
  console.log(`The server started running on ${PORT}`);
});
