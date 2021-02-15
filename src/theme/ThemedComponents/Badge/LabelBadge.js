import React from 'react';
import Chip from '@material-ui/core/Chip';
import theme from '../../muiTheme';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

export const LabelBadge = ({
    children,
    variant = 'default',
    style,
    ...rest
}) => {
    const colors = theme.colors;

    const badgeCategory = {
        labelBadge: {
            padding: '4px, 20px',
            labelComponent: 'body1',
        },
        statusBadge: {
            chipMinWidth: '72px',
            labelComponent: 'body2',
        },
        statusRound: {
            chipMinWidth: '24px',
            borderRadius: '24px',
            paddingRight: '0px',
            paddingLeft: '0px',
            labelColor: colors.white,
            labelComponent: 'body2',
        },
    };

    const badgeType = {
        default: {
            labelColor: colors.white,
            chipColor: colors.darkBlue,
            ...badgeCategory.labelBadge,
        },
        outline: {
            labelColor: colors.darkBlue,
            chipColor: colors.white,
            chipVariant: 'outlined',
            chipBorder: colors.darkBlue,
            ...badgeCategory.labelBadge,
        },
        'outline-gray': {
            labelColor: colors.slateGrey,
            chipColor: colors.white,
            chipVariant: 'outlined',
            chipBorder: colors.slateGrey,
            ...badgeCategory.labelBadge,
        },
        'status-positive': {
            chipColor: colors.statusGreen,
            ...badgeCategory.statusBadge,
        },
        'status-warning': {
            chipColor: colors.statusYellow,
            ...badgeCategory.statusBadge,
        },
        'status-negative': {
            chipColor: colors.statusRed,
            ...badgeCategory.statusBadge,
        },
        'status-active': {
            chipColor: colors.statusGreen,
            labelColor: colors.white,
            ...badgeCategory.statusBadge,
        },
        'status-past': {
            chipColor: colors.gloom,
            labelColor: colors.white,
            ...badgeCategory.statusBadge,
        },
        'status-new': {
            chipColor: colors.omouBlue,
            labelColor: colors.white,
            ...badgeCategory.statusBadge,
        },
        'round-positive': {
            chipColor: colors.statusGreen,
            ...badgeCategory.statusRound,
        },
        'round-warning': {
            chipColor: colors.statusYellow,
            ...badgeCategory.statusRound,
        },
        'round-negative': {
            chipColor: colors.statusRed,
            ...badgeCategory.statusRound,
        },
        'round-count': {
            chipColor: colors.buttonBlue,
            height: '16px',
            width: '16px',
            ...badgeCategory.statusRound,
            chipMinWidth: '16px',
            chipFontSize: '10px',
        },
    };

    const badgeStyle = badgeType[variant];
    return (
        <Chip
            variant={badgeStyle.chipVariant}
            style={{
                minWidth: badgeStyle.chipMinWidth,
                backgroundColor: badgeStyle.chipColor,
                borderColor: badgeStyle.chipBorder,
                ...badgeStyle,
                ...style,
            }}
            label={
                <Typography
                    variant={badgeStyle.labelComponent}
                    style={{
                        color: badgeStyle.labelColor,
                        fontSize: badgeStyle.chipFontSize,
                    }}
                >
                    {children}
                </Typography>
            }
            {...rest}
        />
    );
};

LabelBadge.propTypes = {
    variant: PropTypes.oneOf([
        'default',
        'outline',
        'outline-gray',
        'status-positive',
        'status-warning',
        'status-negative',
        'status-active',
        'status-past',
        'status-new',
        'round-positive',
        'round-warning',
        'round-negative',
        'round-count',
    ]).isRequired,
};
