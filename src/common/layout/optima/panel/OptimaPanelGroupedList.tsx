import * as React from 'react';

import type { SxProps } from '@mui/joy/styles/types';
import { Box, Checkbox, MenuList } from '@mui/joy';

import { ExpanderControlledBox } from '~/common/components/ExpanderControlledBox';
import { adjustContentScaling, themeScalingMap, } from '~/common/app.theme';
import { useIsMobile } from '~/common/components/useMatchMedia';
import { useUIContentScaling } from '~/common/stores/store-ui';


const gutterSx: SxProps = {
  px: 'var(--ListItem-paddingX)',
  py: 'var(--ListItem-paddingY)',
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
};

export function OptimaPanelGroupGutter(props: { children?: React.ReactNode }) {
  return (
    <Box sx={gutterSx}>
      {props.children}
    </Box>
  );
}


// Header

const headerSx: SxProps = {
  // style
  backgroundColor: 'background.level1',
  borderBottom: '1px solid',
  borderTop: '1px solid',
  borderTopColor: 'var(--joy-palette-neutral-outlinedDisabledBorder)',
  borderBottomColor: 'rgba(var(--joy-palette-neutral-mainChannel) / 0.05)',

  // mimics ListItem
  px: 'var(--ListItem-paddingX, 0.75rem)',
  py: 'var(--ListItem-paddingY, 0.25rem)',
  minBlockSize: 'var(--ListItem-minHeight, 2.25rem)',

  // layout
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1,

  // '--A': 'var(--joy-palette-background-level1)',
  // '--B': 'var(--joy-palette-background-popup)',
  // background: 'linear-gradient(45deg, var(--A) 25%, var(--B) 25%, var(--B) 50%, var(--A) 50%, var(--A) 75%, var(--B) 75%)',
  // backgroundSize: '40px 40px',
  // boxShadow: 'xs',

  // if the role is button, show the cursor
  '&[role="button"]': {
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: 'background.level2',
    },
  },

  // if expanded, soften the bottom border
  '&[aria-expanded="false"]': {
    backgroundColor: 'background.surface',
    borderColor: 'transparent',
  },
};

const headerTitleSx: SxProps = {
  color: 'text.tertiary',
  // fontSize: 'xs',
  fontWeight: 'lg',
};


// List containing the items

const groupListSx: SxProps = {
  border: 'none',
  borderRadius: 0,
  background: 'transparent',
  flexGrow: 0,

  // NOTE 2: removed the margin-bottom, so the spacing is used as gap only
  // NOTE: switched to smaller margin on mobile, keeping it larger on desktop
  // mb: { xs: 1, md: OPTIMA_PANEL_GROUPS_SPACING } as const,
  // mb: OPTIMA_PANEL_GROUPS_SPACING,

  // fontSize: '0.9375rem', // 15px (14 too small, 16 too big?)
  // py: 0,
  // py: 'var(--ListDivider-gap)',
} as const;


export function OptimaPanelGroupedList(props: {
  title?: string;
  endDecorator?: React.ReactNode;
  children?: React.ReactNode;
  persistentCollapsibleId?: string;
  startExpanded?: boolean;
}) {

  // state
  // TODO: persist by id
  const [_expanded, setExpanded] = React.useState(props.startExpanded === true);

  // external state
  const isMobile = useIsMobile();
  const contentScaling = adjustContentScaling(useUIContentScaling(), isMobile ? 1 : 0);
  const smallerContentScaling = adjustContentScaling(contentScaling, -1);

  // derived state
  const isCollapsible = !!props.persistentCollapsibleId;
  const isExpanded = !isCollapsible || _expanded;

  // handlers

  const toggleExpanded = React.useCallback(() => {
    setExpanded(expanded => !expanded);
  }, []);


  return (
    <Box>

      {/* Header */}
      {(!!props.title || isCollapsible) && (
        <Box
          aria-expanded={isExpanded}
          onClick={isCollapsible ? toggleExpanded : undefined}
          role={isCollapsible ? 'button' : undefined}
          sx={headerSx}
        >
          <Box fontSize={smallerContentScaling} sx={headerTitleSx}>{props.title}</Box>
          {isCollapsible && <Checkbox size='md' variant='outlined' color='neutral' checked={isExpanded} />}
        </Box>
      )}

      {/* Collapsible Items  */}
      <ExpanderControlledBox expanded={isExpanded}>
        <MenuList size={themeScalingMap[contentScaling]?.optimaPanelGroupSize} sx={groupListSx}>
          {props.children}
        </MenuList>
      </ExpanderControlledBox>

    </Box>
  );
}
