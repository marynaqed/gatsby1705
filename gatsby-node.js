const path = require("path")

exports.onPostBuild = ({ reporter }) => {
  reporter.info("Your Gatsby site has been built!")
}

// creatre contentful pages dynamically
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const contentfulPageTemplate = path.resolve(
    "./src/templates/ContentfulPage.tsx"
  )

  const result = await graphql(`
    query {
      allContentfulPage {
        edges {
          node {
            id
            slug
            title
            sys {
              contentType {
                sys {
                  id
                  linkType
                  type
                }
              }
              revision
              type
            }
          }
        }
      }
    }
  `)

  result.data.allContentfulPage.edges.forEach(edge => {
    createPage({
      path: `${edge.node.slug}`,
      component: contentfulPageTemplate,
      context: {
        title: edge.node.title,
        slug: edge.node.slug,
        sys: {
          ...edge.node.sys,
        },
        components: edge.node.components, // array of components
      },
    })
  })
}

const intentTagResolver = (source, _args, context, _info) => {
  if (!source.unfrmOptIntentTag___NODE) {
    return null
  }

  const tagNode = context.nodeModel.getNodeById({
    id: source.unfrmOptIntentTag___NODE,
  })

  if (tagNode) {
    const { internal } = tagNode
    const { content } = internal

    if (content) {
      try {
        const json = JSON.parse(content)
        return json
      } catch (e) {
        console.error(e)
      }
    }
  }

  return null
}

const createUniformResolvers = ({ createResolvers, tagTypes }) => {
  createResolvers(
    tagTypes.reduce((p, c) => {
      p[c] = {
        intentTag: {
          type: "JSON",
          resolve: intentTagResolver,
        },
      }
      return p
    }, {})
  )
}

// Types to add "intentTag" fields to.
const taggedGraphQLTypes = ["ContentfulHero", "ContentfulTalk"]

exports.createResolvers = ({ createResolvers }) => {
  createUniformResolvers({
    createResolvers,
    tagTypes: taggedGraphQLTypes,
  })
}
