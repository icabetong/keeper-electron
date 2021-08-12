import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import Menu from "@material-ui/core/Menu";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

import DotsVerticalIcon from "@heroicons/react/outline/DotsVerticalIcon";
import MenuIcon from "@heroicons/react/outline/MenuIcon";

type ComponentHeaderPropsType = {
    title: string,
    onDrawerToggle: () => void,
    buttonText?: string,
    buttonIcon?: JSX.Element,
    buttonOnClick?: React.MouseEventHandler,
    menuItems?: JSX.Element[]
}

export const ComponentHeader = (props: ComponentHeaderPropsType) => {
    const useStyles = makeStyles((theme) => ({
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        toolbar: theme.mixins.toolbar,
        navigationButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
                display: 'none'
            },
        },
        overflowButton: {
            marginLeft: theme.spacing(2)
        },
        title: {
            width: '100%',
        },
        icon: {
            color: theme.palette.text.primary,
            width: '1em',
            height: '1em'
        },
    }));
    const classes = useStyles();

    const [anchor, setAnchor] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchor);
    const anchorProperties = {
        vertical: 'top',
        horizontal: 'right'
    } as const

    return (
        <AppBar position="static" className={classes.appBar} color="transparent" elevation={0}>
            <Toolbar>
                <IconButton
                    aria-label="Open Drawer"
                    edge="start"
                    onClick={props.onDrawerToggle}
                    className={classes.navigationButton}>
                        <MenuIcon className={classes.icon}/>
                </IconButton>
                <Hidden only="xs">
                    <Typography variant="h5" className={classes.title}>
                        {props.title}
                    </Typography>
                </Hidden>
                <Hidden only={['sm', 'md', 'lg', 'xl']}>
                    <Typography variant="h6" noWrap>
                        {props.title}
                    </Typography>
                </Hidden>
                { props.buttonText &&
                    <Button 
                        variant="outlined"
                        color="primary"
                        startIcon={props.buttonIcon}
                        onClick={props.buttonOnClick}>
                        {props.buttonText}
                    </Button>
                }
                <div>
                    <IconButton
                        className={classes.overflowButton}
                        aria-haspopup="true"
                        onClick={(e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget)}>
                        <DotsVerticalIcon className={classes.icon}/>
                    </IconButton>
                    <Menu
                        keepMounted
                        anchorEl={anchor}
                        anchorOrigin={anchorProperties}
                        transformOrigin={anchorProperties}
                        open={menuOpen}
                        onClose={() => setAnchor(null)}>
                        {props.menuItems && 
                            props.menuItems.map((menuItem) => {
                            return menuItem
                            })
                        }
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    )
}