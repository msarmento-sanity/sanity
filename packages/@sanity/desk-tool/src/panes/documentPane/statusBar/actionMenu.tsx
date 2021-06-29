import {useId} from '@reach/auto-id'
import {
  useClickOutside,
  Tooltip,
  Box,
  Button,
  Menu,
  MenuItem,
  MenuButton,
  Stack,
  Popover,
  Hotkeys,
} from '@sanity/ui'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import {ChevronDownIcon} from '@sanity/icons'
import {ActionStateDialog} from './actionStateDialog'

function getNext<T>(array: T[], fromIndex: number, dir = 1): T {
  const next = fromIndex + dir

  // eslint-disable-next-line no-nested-ternary
  return array[next >= array.length ? 0 : next < 0 ? array.length - 1 : next]
}

interface Props {
  actionStates: any[]
  onOpen: () => void
  onClose: () => void
  isOpen: boolean
  disabled: boolean
}

export function ActionMenu({actionStates, onOpen, onClose, disabled, isOpen}: Props) {
  const idPrefix = useId()
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (listRef.current) {
      const el: HTMLUListElement | null = listRef.current

      if (el) {
        el.focus()
      }
    }
  }, [isOpen])

  return (
    <Box marginLeft={2}>
      <Popover
        id={`${idPrefix}-menu`}
        open={isOpen}
        placement="top-end"
        portal
        content={
          <Menu paddingY={1} focusLast>
            {actionStates.map((actionState, idx) => (
              <ActionMenuListItem
                actionState={actionState}
                disabled={disabled}
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
              />
            ))}
          </Menu>
        }
      >
        <Button
          icon={ChevronDownIcon}
          aria-controls={`${idPrefix}-menu`}
          aria-haspopup="true"
          aria-label="Actions"
          disabled={disabled}
          id={`${idPrefix}-button`}
          onClick={isOpen ? onClose : onOpen}
        />
      </Popover>
    </Box>
  )
}

function ActionMenuListItem({actionState, disabled}) {
  const [buttonElement, setButtonElement] = useState<HTMLElement | null>(null)
  // TODO: action items are not accessible with keyboard
  return (
    <MenuItem padding={0} as="div">
      <Tooltip
        disabled={!actionState.title}
        content={
          <Box padding={2} style={{maxWidth: 260}}>
            {actionState.title}
          </Box>
        }
        portal
        placement="left-start"
      >
        <Stack>
          <Button
            aria-label={actionState.label}
            text={actionState.label}
            disabled={disabled || Boolean(actionState.disabled)}
            onClick={actionState.onHandle}
            role="menuitem"
            tabIndex={-1}
            icon={actionState.icon}
            mode="bleed"
            textAlign="left"
            justify="flex-start"
            ref={setButtonElement}
          >
            {actionState.shortcut && <Hotkeys keys={String(actionState.shortcut).split('+')} />}
          </Button>
        </Stack>
      </Tooltip>

      {actionState.dialog && (
        <ActionStateDialog dialog={actionState.dialog} referenceElement={buttonElement} />
      )}
    </MenuItem>
  )
}
