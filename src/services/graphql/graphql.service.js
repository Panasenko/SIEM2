
const graphqlHTTP = require('express-graphql')
const {makeExecutableSchema} = require('graphql-tools')
const {importSchema} = require('graphql-import')
/*

const resolvers = require('./resolvers/main.resolvers')
const typeDefs = importSchema('./schems/schema.graphql')
*/
const typeDefs = importSchema('./src/services/graphql/schems.graphql')
const resolvers = require('./resolvers')

module.exports = function (app) {
  const executableSchema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers.call(app)
  })

  app.use('/graphql', graphqlHTTP(()=>{
    return {
      schema: executableSchema
    }
  }))

}
