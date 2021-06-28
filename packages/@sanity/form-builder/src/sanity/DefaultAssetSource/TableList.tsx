import React from 'react'
import {Box, Card, Flex, Grid, Label, Spinner, Stack} from '@sanity/ui'
import {AssetRecord} from '../../inputs/files/ImageInput/types'
import AssetRow from './AssetRow'
import {useMatchesMedia} from './utils/useMatchesMedia'

interface Props {
  onClick?: (...args: any[]) => any
  onKeyPress?: (...args: any[]) => any
  onDeleteFinished: (...args: any[]) => any
  assets: AssetRecord[]
  isLoading?: boolean
  selectedAssets: AssetRecord[]
}

export default function TableList(props: Props) {
  const isMobile = useMatchesMedia(1)
  const {assets, onClick, onKeyPress, onDeleteFinished, selectedAssets, isLoading} = props

  return (
    <Box padding={4}>
      <Card borderBottom paddingBottom={2}>
        {isMobile ? (
          <Grid
            style={{
              gridTemplateColumns: '3fr 1fr 1fr 2fr 30px',
            }}
          >
            <Box flex={2} paddingLeft={3}>
              <Label muted size={1}>
                Filename
              </Label>
            </Box>
          </Grid>
        ) : (
          <Grid
            style={{
              gridTemplateColumns: '3fr 1fr 1fr 2fr 30px',
            }}
          >
            <Box flex={2} paddingLeft={3}>
              <Label muted size={1}>
                Filename
              </Label>
            </Box>
            <Box flex={1}>
              <Label muted size={1}>
                Size
              </Label>
            </Box>
            <Box flex={1}>
              <Label muted size={1}>
                Type
              </Label>
            </Box>
            <Box flex={1}>
              <Label muted size={1}>
                Date added
              </Label>
            </Box>
          </Grid>
        )}
      </Card>
      <Stack>
        {isLoading && assets.length === 0 && (
          <Box paddingTop={4} paddingBottom={2}>
            <Flex justify="center">
              <Spinner muted />
            </Flex>
          </Box>
        )}
        {assets.map((asset) => (
          <AssetRow
            key={asset._id}
            asset={asset}
            isMobile={isMobile}
            isSelected={selectedAssets.some((selected) => selected._id === asset._id)}
            onClick={onClick}
            onKeyPress={onKeyPress}
            onDeleteFinished={onDeleteFinished}
          />
        ))}
      </Stack>
    </Box>
  )
}
