import React, { useState } from "react";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  ListSubheader,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar
} from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { remote } from "electron";
import { useTypedDispatch } from "../redux/actions";
import { useTypedSelector, CLEAR_STORE } from "../redux/reducers";
import { SET_SETTING } from "../redux/actions/settings";
import { Settings } from "../types";

const { openLogDir } = remote.require("./logs");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: `calc(100vh - 64px)`,
      padding: theme.spacing(2)
    },
    list: {
      width: "100%"
    },
    textField: {
      marginBottom: theme.spacing(2)
    }
  })
);

const SettingsPage: React.FC = () => {
  const styles = useStyles();

  const dispatch = useTypedDispatch();
  const settings = useTypedSelector(state => state.settings);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  const handleValueChange = (
    key: keyof Settings,
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (key === "localPort" || key === "pacPort") {
      const value = parseInt(e.target.value.trim(), 10);
      if (!(value && value > 1024 && value <= 65535)) {
        setSnackbarMessage("Invalid port");
        return;
      }
    }

    dispatch({
      type: SET_SETTING,
      key,
      value: e.target.value
    });
  };

  const handleSwitchValueChange = (
    key: keyof Settings,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch({
      type: SET_SETTING,
      key,
      value: e.target.checked
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarMessage("");
  };

  const handleOpenLog = async () => {
    await openLogDir();
  };

  const handleReset = () => {
    dispatch({
      type: CLEAR_STORE
    } as any);
    setAlertDialogOpen(false);
    setSnackbarMessage("Cleared all data");
  };

  const handleAlertDialogOpen = () => {
    setAlertDialogOpen(true);
  };

  const handleAlertDialogClose = () => {
    setAlertDialogOpen(false);
  };

  return (
    <Container className={styles.container}>
      <TextField
        className={styles.textField}
        required
        fullWidth
        type="number"
        label="Local Port"
        helperText="Port where socks server listen"
        value={settings.localPort}
        onChange={e => handleValueChange("localPort", e)}
      />
      <TextField
        className={styles.textField}
        required
        fullWidth
        type="number"
        label="PAC Port"
        helperText="Port where PAC file is served"
        value={settings.pacPort}
        onChange={e => handleValueChange("pacPort", e)}
      />
      <TextField
        className={styles.textField}
        required
        fullWidth
        type="url"
        label="GFWList URL"
        helperText="GFWList file used to generate PAC"
        value={settings.gfwListUrl}
        onChange={e => handleValueChange("gfwListUrl", e)}
      />
      <List
        className={styles.list}
        subheader={<ListSubheader>Debugging</ListSubheader>}
      >
        <ListItem>
          <ListItemText
            primary="Verbose"
            secondary="See App logs for verbose output"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color="primary"
              checked={settings.verbose}
              onChange={e => handleSwitchValueChange("verbose", e)}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button onClick={handleOpenLog}>
          <ListItemText primary="Open Log Directory" />
        </ListItem>
        <ListItem button onClick={handleAlertDialogOpen}>
          <ListItemText primary="Reset Data" />
        </ListItem>
      </List>
      <Dialog open={alertDialogOpen} onClose={handleAlertDialogClose}>
        <DialogTitle>Reset all data?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action will reset all data to its defaults.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReset} color="primary">
            Ok
          </Button>
          <Button onClick={handleAlertDialogClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        open={snackbarMessage ? true : false}
        autoHideDuration={1500}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default SettingsPage;
