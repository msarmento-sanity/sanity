import type {Subscription} from 'rxjs'
import React, {useRef, useState} from 'react'
import styled from 'styled-components'
import {Button, Card, Flex, Stack, Label, Text, Grid} from '@sanity/ui'
import {DocumentIcon, ChevronUpIcon, ChevronDownIcon, LinkIcon, TrashIcon} from '@sanity/icons'
import {useTimeAgo} from '@sanity/base/hooks'
import prettyBytes from 'pretty-bytes'
import {FullscreenSpinner} from '../../components/FullscreenSpinner'
import {AssetRecord} from '../../inputs/files/ImageInput/types'
import {versionedClient} from '../versionedClient'
import {AssetUsageDialog} from './AssetUsageDialog'
import {AssetMenu} from './AssetMenu'
import {AssetMenuAction} from './types'
import {DeleteAssetErrorDialog} from './DeleteAssetErrorDialog'
import {formatMimeType} from './utils/mimeType'

const RowButton = styled.button`
  border: 0;
  background: none;
  appearance: none;
  cursor: pointer;
`

interface RowProps {
  isMobile?: boolean
  asset?: AssetRecord
  isSelected: boolean
  onClick?: (...args: any[]) => any
  onKeyPress?: (...args: any[]) => any
  onDeleteFinished: (...args: any[]) => any
}

const STYLES_ROW_CARD = {position: 'relative' as any}
const STYLES_ICON_CARD = {flexShrink: 0}
const STYLES_BUTTON_TEXT = {minWidth: 0}
const DISABLED_DELETE_TITLE = 'Cannot delete current file'

const AssetRow = (props: RowProps) => {
  const deleteRef$ = useRef<Subscription>()
  const [showUsageDialog, setShowUsageDialog] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const {asset, onClick, onKeyPress, onDeleteFinished, isSelected, isMobile} = props
  const {originalFilename, _id, mimeType, size, _createdAt} = asset
  const formattedTime = useTimeAgo(_createdAt, {agoSuffix: true})
  const formattedMimeType = formatMimeType(mimeType)
  const formattedSize = prettyBytes(size)

  const handleDeleteAsset = () => {
    setIsDeleting(true)

    deleteRef$.current = versionedClient.observable.delete(asset._id).subscribe({
      next: () => {
        setIsDeleting(false)
        onDeleteFinished(asset._id)
      },
      error: (err: Error) => {
        setIsDeleting(false)
        setDeleteError(err)
        // eslint-disable-next-line no-console
        console.error('Could not delete asset', err)
      },
    })
  }

  const handleDialogClose = () => {
    setShowUsageDialog(false)
    setDeleteError(null)
  }

  const handleToggleUsageDialog = () => {
    setShowUsageDialog(true)
  }

  const handleToggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const handleMenuAction = (action: AssetMenuAction) => {
    if (action.type === 'delete') {
      handleDeleteAsset()
    }

    if (action.type === 'showUsage') {
      setShowUsageDialog(true)
    }
  }

  if (isMobile) {
    return (
      <Card borderBottom paddingY={3} style={STYLES_ROW_CARD}>
        <Grid
          columns={4}
          gap={1}
          style={{
            gridTemplateColumns: '1fr 30px',
            opacity: isDeleting ? 0.5 : 1,
          }}
        >
          <Flex as={RowButton} gap={2} flex={2} align="center" data-id={_id} onClick={onClick}>
            <Card padding={2} tone="transparent" radius={2}>
              <Text muted size={2} style={STYLES_ICON_CARD}>
                <DocumentIcon />
              </Text>
            </Card>
            <Text size={1} align="left" textOverflow="ellipsis" style={STYLES_BUTTON_TEXT}>
              {originalFilename}
            </Text>
          </Flex>
          <Flex justify="flex-end" align="center">
            <Button
              mode="bleed"
              fontSize={1}
              padding={2}
              onClick={handleToggleOpen}
              icon={isOpen ? ChevronUpIcon : ChevronDownIcon}
            />
          </Flex>
        </Grid>
        {isOpen && (
          <>
            <Grid marginTop={3} columns={3} gap={1}>
              <Stack space={2}>
                <Label size={1} muted>
                  Size
                </Label>
                <Text size={1} muted>
                  {formattedSize}
                </Text>
              </Stack>
              <Stack space={2}>
                <Label size={1} muted>
                  Type
                </Label>
                <Text size={1} muted>
                  {formattedMimeType}
                </Text>
              </Stack>
              <Stack space={2}>
                <Label size={1} muted>
                  Date added
                </Label>
                <Text size={1} muted>
                  {formattedTime}
                </Text>
              </Stack>
            </Grid>
            <Stack space={2} marginTop={3}>
              <Button
                fontSize={1}
                tone="default"
                mode="ghost"
                text="Show documents using this"
                onClick={handleToggleUsageDialog}
                icon={LinkIcon}
              />
              <Button
                fontSize={1}
                tone="critical"
                mode="ghost"
                text="Delete asset"
                icon={TrashIcon}
                disabled={isSelected}
                title={isSelected ? DISABLED_DELETE_TITLE : undefined}
                onClick={handleDeleteAsset}
              />
            </Stack>
          </>
        )}
        {showUsageDialog && (
          <AssetUsageDialog
            assetType="file"
            asset={asset}
            onClose={handleDialogClose}
            onDelete={handleDeleteAsset}
          />
        )}
        {deleteError && (
          <DeleteAssetErrorDialog asset={asset} onClose={handleDialogClose} error={deleteError} />
        )}
        {isDeleting && <FullscreenSpinner />}
      </Card>
    )
  }

  return (
    <Card borderBottom paddingY={3} style={STYLES_ROW_CARD}>
      <Grid
        columns={4}
        gap={1}
        data-id={_id}
        style={{
          gridTemplateColumns: '3fr 1fr 1fr 2fr 30px',
          opacity: isDeleting ? 0.5 : 1,
        }}
      >
        <Flex
          as={RowButton}
          gap={2}
          flex={2}
          paddingRight={1}
          align="center"
          onClick={onClick}
          onKeyPress={onKeyPress}
          data-id={_id}
          title={`Select the file ${originalFilename}`}
        >
          <Card padding={2} tone="transparent" radius={2} style={STYLES_ICON_CARD}>
            <Text muted size={2}>
              <DocumentIcon />
            </Text>
          </Card>
          <Text size={1} align="left" textOverflow="ellipsis" style={STYLES_BUTTON_TEXT}>
            {originalFilename}
          </Text>
        </Flex>
        <Flex align="center">
          <Text size={1} muted>
            {formattedSize}
          </Text>
        </Flex>
        <Flex align="center">
          <Text size={1} muted>
            {formattedMimeType}
          </Text>
        </Flex>
        <Flex align="center">
          <Text as="time" size={1} muted dateTime={_createdAt}>
            {formattedTime}
          </Text>
        </Flex>
        <Flex justify="flex-end" align="center">
          <AssetMenu
            disabledDeleteTitle={DISABLED_DELETE_TITLE}
            isSelected={isSelected}
            onAction={handleMenuAction}
          />
        </Flex>
      </Grid>
      {showUsageDialog && (
        <AssetUsageDialog
          assetType="file"
          asset={asset}
          onClose={handleDialogClose}
          onDelete={handleDeleteAsset}
        />
      )}
      {deleteError && (
        <DeleteAssetErrorDialog asset={asset} onClose={handleDialogClose} error={deleteError} />
      )}
      {isDeleting && <FullscreenSpinner />}
    </Card>
  )
}

export default AssetRow
