const graphqlHTTP = require('express-graphql')
const {makeExecutableSchema} = require('graphql-tools')
const {importSchema} = require('graphql-import')

const typeDefs = importSchema('./src/services/graphql/schems/schema.graphql')
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
