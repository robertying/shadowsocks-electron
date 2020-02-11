import React from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/Home";
import SettingsIcon from "@material-ui/icons/Settings";
import InfoIcon from "@material-ui/icons/Info";
import { Link } from "react-router-dom";

export const drawerWidth = 200;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar
  })
);

export interface DrawerMenuProps {
  onClick?: () => void;
}

const DrawerMenu: React.FC<DrawerMenuProps> = props => {
  const styles = useStyles();

  return (
    <div>
      <div className={styles.toolbar} />
      <Divider />
      <List>
        <Link to="/home" onClick={props.onClick}>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </Link>
        <Link to="/settings" onClick={props.onClick}>
          <ListItem button>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </Link>
        <Link to="/about" onClick={props.onClick}>
          <ListItem button>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
        </Link>
      </List>
    </div>
  );
};

export default DrawerMenu;
