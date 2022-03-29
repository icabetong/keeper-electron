import React, { useState, useRef, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router";
import { withRouter, } from "react-router-dom";
import {
  AppBar, 
  Box, 
  Button, 
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  Grow,
  Hidden, 
  ListItemIcon,
  ListItemText,
  MenuList, 
  MenuItem, 
  Popper, 
  Paper, 
  Toolbar, 
  useMediaQuery,
  useTheme, 
  makeStyles, 
  Typography,
  lighten
} from "@material-ui/core"; 
import { SnackbarProvider } from "notistack";
import { 
  ArrowDropDown,   
  SettingsOutlined,
  AccountCircleOutlined,
  ExitToAppRounded
} from "@material-ui/icons";
import { ReactComponent as Logo } from "../../shared/brand.svg";

import { signOut } from "firebase/auth";
import { AuthStatus, useAuthState } from "../auth/AuthProvider";
import { Destination, NavigationComponent, TopNavigationComponent } from "../navigation/NavigationComponent";
import { ErrorNotFoundState } from "../state/ErrorStates";
import { MainLoadingStateComponent, ContentLoadingStateComponent } from "../state/LoadingStates";
import { auth } from "../../index";

const AssetScreen = lazy(() => import('../asset/AssetScreen'));
const UserScreen = lazy(() => import('../user/UserScreen'));
const ProfileScreen = lazy(() => import('../profile/ProfileScreen'));
const SettingsScreen = lazy(() => import('../settings/SettingsScreen'));

type InnerComponentPropsType = {
  destination: Destination,
  onDrawerToggle: () => void,
}

const InnerComponent = (props: InnerComponentPropsType) => {
  switch (props.destination) {
    case Destination.ASSETS:
      return <AssetScreen onDrawerToggle={props.onDrawerToggle} />
    case Destination.USERS:
      return <UserScreen onDrawerToggle={props.onDrawerToggle} />
    case Destination.PROFILE:
      return <ProfileScreen onDrawerToggle={props.onDrawerToggle} />
    case Destination.SETTINGS:
      return <SettingsScreen onDrawerToggle={props.onDrawerToggle} />
    default:
      return <ErrorNotFoundState />
  }
}

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%', // if turned into viewport width; it will cause horizontal scrollbar!
    height: '100vh',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'column'
    }
  },
  nav: {
    [theme.breakpoints.up('md')]: {
      height: 64,
      flexShrink: 0,
    }
  },
  drawerPaper: {
    width: drawerWidth,
  },
  container: {
    minWidth: '100%',
    minHeight: '100%',
  },
  divider: {
    margin: '0.8em 0'
  },
  icon: {
    maxWidth: '3em',
    maxHeight: '3em',
  },
  content: {
    width: '100%',
    margin: '0 auto',
    flexGrow: 1,
    [theme.breakpoints.up('xl')]: {
      maxWidth: '1600px'
    }
  },
  headerIcon: {
    fontSize: '1em',
    display: 'block',
    margin: 'auto'
  },
  header: {
    display: 'block',
    textAlign: 'center'
  },
  profile: {
    marginLeft: theme.spacing(2),
    textTransform: 'none'
  },
  profileMenu: {
    backgroundColor: lighten(theme.palette.background.paper, 0.2)
  }
}));

type RootContainerComponentPropsType = {
  onNavigate: (destination: Destination) => void,
  currentDestination: Destination,
}

const RootContainerComponent = (props: RootContainerComponentPropsType) => {
  const classes = useStyles();
  const theme = useTheme();
  const { user } = useAuthState();
  const { t } = useTranslation();
  const [triggerConfirmSignOut, setTriggerConfirmSignOut] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const onTriggerSignOut = async () => {
    await signOut(auth);
    setTriggerConfirmSignOut(false);
  }

  const onTriggerMenu = () => {
    setMenuOpen((prevOpen) => !prevOpen);
  }

  const onMenuDispose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setMenuOpen(false);
  }

  const onToggleDrawerState = () => {
    setDrawerOpen(!drawerOpen);
  }

  const onNavigateThenDismiss = (destination: Destination) => {
    if (drawerOpen) 
      setDrawerOpen(false);

    if (menuOpen)
      setMenuOpen(false);

    props.onNavigate(destination)
  }

  const signOutDialog = (
    <Dialog
      open={triggerConfirmSignOut}
      fullWidth={true}
      maxWidth="xs"
      onClose={() => setTriggerConfirmSignOut(false)}>
      <DialogTitle>{t("dialog.signout")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("dialog.signout_message")}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => setTriggerConfirmSignOut(false)}>{t("button.cancel")}</Button>
        <Button color="primary" onClick={onTriggerSignOut}>{t("button.continue")}</Button>
      </DialogActions>
    </Dialog>
  )

  const drawerItems = (
    <NavigationComponent
      onNavigate={onNavigateThenDismiss}
      currentDestination={props.currentDestination} />
  )

  return (
    <div className={classes.root}>
      <nav className={classes.nav}>
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? 'right' : 'left'}
            open={drawerOpen}
            onClose={onToggleDrawerState}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}>
            {drawerItems}
          </Drawer>
        </Hidden>
        <Hidden smDown>
          <AppBar color='inherit' elevation={2}>
            <Toolbar>
              <Box component={Logo} className={classes.icon} marginRight={3}/>
              <Divider variant="middle" orientation="vertical" flexItem className={classes.divider}/>
              <Box flexGrow={1} marginX={1}>
                <TopNavigationComponent 
                  onNavigate={onNavigateThenDismiss}
                  currentDestination={props.currentDestination}/>
              </Box>
              <Divider variant="middle" orientation="vertical" flexItem className={classes.divider}/>
              <Button
                ref={anchorRef}
                aria-haspopup="true"
                onClick={onTriggerMenu}
                className={classes.profile}
                endIcon={<ArrowDropDown/>}>
                <Box flexDirection="column" textAlign="start">
                  <Typography variant="body2">{user && user.firstName}</Typography>
                  <Typography variant="caption">{user && user.email}</Typography>
                </Box>
              </Button>
              <Popper open={menuOpen} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
                    }}>
                    <Paper className={classes.profileMenu}>
                      <ClickAwayListener onClickAway={onMenuDispose}>
                        <MenuList id="navigation-menu">
                          <MenuItem 
                            key="profile"
                            onClick={() => onNavigateThenDismiss(Destination.PROFILE)}>
                            <ListItemIcon><AccountCircleOutlined/></ListItemIcon>
                            <ListItemText>{t("navigation.profile")}</ListItemText>
                          </MenuItem>
                          <MenuItem 
                            key="settings"
                            onClick={() => onNavigateThenDismiss(Destination.SETTINGS)}>
                            <ListItemIcon><SettingsOutlined/></ListItemIcon>
                            <ListItemText>{t('navigation.settings')}</ListItemText>
                          </MenuItem>
                          <MenuItem 
                            key="signout"
                            onClick={() => setTriggerConfirmSignOut(true)}>
                            <ListItemIcon><ExitToAppRounded/></ListItemIcon>
                            <ListItemText>{t('button.signout')}</ListItemText>
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Toolbar>
          </AppBar>
        </Hidden>
      </nav>
      <Box className={classes.content}>
        <Suspense fallback={<ContentLoadingStateComponent />}>
          <InnerComponent destination={props.currentDestination} onDrawerToggle={onToggleDrawerState} />
        </Suspense>
      </Box>
      {signOutDialog}
    </div>
  );
}

const RootComponent = () => {
  const { status, user } = useAuthState();
  const [destination, setDestination] = useState<Destination>(Destination.ASSETS);
  const theme = useTheme();
  const isXSDeviceWidth = useMediaQuery(theme.breakpoints.down('xs'));

  const onNavigate = (newDestination: Destination) => {
    setDestination(newDestination)
  }

  if (status === AuthStatus.PENDING) {
    return <MainLoadingStateComponent />
  } else if (status === AuthStatus.FETCHED) {
    if (user !== undefined) {
      return (
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={3000}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: isXSDeviceWidth ? 'center' : 'right'
          }}>
          <RootContainerComponent
            onNavigate={onNavigate}
            currentDestination={destination} />
        </SnackbarProvider>
      )
    } else return <Redirect to="/auth" />
  } else return <Redirect to="/error" />
}
export default withRouter(RootComponent);