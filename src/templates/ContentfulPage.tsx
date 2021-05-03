import { UniformTracker } from "@uniformdev/optimize-tracker-react"
import React, { useEffect } from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"

// Tracker and Component mapping to enable personalization
import { localTracker } from "../lib/local-tracker"
import { analytics } from "../lib/analytics"
import { Components, componentMapper } from "../lib/componentMapper"
// Global Layouts
import { Layout } from "../layouts/default"

export default function ContentfulPage({ data }) {
  const { contentfulPage } = data

  useEffect(() => {
    if (!data) {
      return
    }

    analytics.page()
  }, [data])

  return (
    <UniformTracker
      trackerInstance={localTracker}
      componentMapping={Components}
    >
      <Helmet
        htmlAttributes={{
          lang: "en-us",
        }}
      >
        <meta charSet="utf-8" />
        <title>{`${contentfulPage.title} | UniformConf`}</title>
      </Helmet>
      <Layout>
        {contentfulPage?.components && componentMapper(contentfulPage)}
      </Layout>
    </UniformTracker>
  )
}

// Each of the component fragments are defined in their
// individual component files
export const query = graphql`
  query PageQuery($slug: String!) {
    contentfulPage(slug: { eq: $slug }) {
      title
      slug
      components {
        ...hero
        ...whyAttend
        ...callToAction
        ...personalizedHero
        ...registrationForm
        ...talkList
      }
    }
  }
`
