require("dotenv/config");
const express = require("express");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const { PORT = 5000 } = process.env;
const tasks = require("./tasks.json");
const schema = buildSchema(
  ` type Query{
        hello:[Task]
    }
    type Task{
        id: ID,
        name: String,
        deadline: String,
    }
    `
);
var root = {
  hello: () => {
    return tasks;
  },
};
const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(PORT, () => {
  console.log(`The server started running on ${PORT}`);
});
