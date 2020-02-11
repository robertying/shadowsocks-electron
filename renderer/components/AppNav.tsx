import React from "react";
import {
  Drawer,
  Hidden,
  useTheme,
  AppBar,
  Toolbar,
  IconButton,
  Theme,
  Typography
} from "@material-ui/core";
import { makeStyles, createStyles, withStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import { useLocation } from "react-router-dom";
import DrawerMenu, { drawerWidth } from "./DrawerMenu";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    appBar: {
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth
      }
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none"
      }
    }
  })
);

const StyledDrawer = withStyles({
  paper: {
    width: drawerWidth
  }
})(Drawer);

const AppNav: React.FC = () => {
  const theme = useTheme();
  const styles = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const title =
    path === "home"
      ? "Shadowsocks"
      : path === "settings"
      ? "Settings"
      : "About";

  return (
    <div>
      <AppBar position="fixed" className={styles.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            className={styles.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      </AppBar>
      <nav className={styles.drawer}>
        <Hidden smUp implementation="css">
          <StyledDrawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={open}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true
            }}
          >
            <DrawerMenu onClick={handleDrawerToggle} />
          </StyledDrawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <StyledDrawer variant="permanent" open>
            <DrawerMenu onClick={handleDrawerToggle} />
          </StyledDrawer>
        </Hidden>
      </nav>
    </div>
  );
};

export default AppNav;
