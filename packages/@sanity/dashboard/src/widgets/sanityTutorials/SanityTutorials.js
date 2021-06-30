import React from 'react'
import PropTypes from 'prop-types'
import {get} from 'lodash'
import {Card, Box, Heading, Flex, Stack} from '@sanity/ui'
import Tutorial from './Tutorial'
import dataAdapter from './dataAdapter'

const {urlBuilder, getFeed} = dataAdapter

function createUrl(slug, type) {
  if (type === 'tutorial') {
    return `https://www.sanity.io/docs/tutorials/${slug.current}`
  } else if (type === 'guide') {
    return `https://www.sanity.io/docs/guides/${slug.current}`
  }
  return false
}

class SanityTutorials extends React.Component {
  static propTypes = {
    templateRepoId: PropTypes.string,
  }

  static defaultProps = {
    templateRepoId: null,
  }

  state = {
    feedItems: [],
  }

  componentDidMount() {
    const {templateRepoId} = this.props
    this.subscription = getFeed(templateRepoId).subscribe((response) => {
      this.setState({
        feedItems: response.items,
      })
    })
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  render() {
    const {feedItems} = this.state
    const title = 'Learn about Sanity'

    return (
      <Card radius={3} paddingY={4}>
        <Stack space={4}>
          <Box as="header" paddingX={4}>
            <Heading as="h1" size={1}>
              {title}
            </Heading>
          </Box>
          <Flex as="ul" overflow="auto" align="stretch">
            {feedItems?.map((feedItem, index) => {
              if (!feedItem.title || (!feedItem.guideOrTutorial && !feedItem.externalLink)) {
                return null
              }
              const presenter =
                feedItem.presenter || get(feedItem, 'guideOrTutorial.presenter') || {}
              const subtitle = get(feedItem, 'category')
              const {guideOrTutorial = {}} = feedItem
              return (
                <Flex
                  as="li"
                  key={feedItem._id}
                  paddingRight={index < feedItems?.length - 1 ? 1 : 3}
                  paddingLeft={index === 0 && 3}
                  align="stretch"
                  flex="0 0 27.5%"
                  style={{minWidth: 272, width: '30%'}}
                >
                  <Tutorial
                    title={feedItem.title}
                    href={
                      createUrl(guideOrTutorial.slug, guideOrTutorial._type) ||
                      feedItem.externalLink
                    }
                    presenterName={presenter.name}
                    presenterSubtitle={subtitle}
                    showPlayIcon={feedItem.hasVideo}
                    posterURL={urlBuilder.image(feedItem.poster).height(360).url()}
                  />
                </Flex>
              )
            })}
          </Flex>
        </Stack>
      </Card>
    )
  }
}

export default SanityTutorials
