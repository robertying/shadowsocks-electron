import React, { useState, useEffect } from "react";
import {
  Container,
  ButtonGroup,
  Button,
  List,
  Theme,
  Fab,
  ButtonProps,
  Snackbar,
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Dialog,
  Typography
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { green, yellow } from "@material-ui/core/colors";
import AddIcon from "@material-ui/icons/Add";
import { remote } from "electron";
import uuid from "uuid/v1";
import Logo from "../components/Logo";
import ServerListItem from "../components/ServerListItem";
import AddServerDialog from "../components/AddServerDialog";
import EditServerDialog from "../components/EditServerDialog";
import { Config, Mode } from "../types";
import { useTypedSelector } from "../redux/reducers";
import { useTypedDispatch } from "../redux/actions";
import {
  ADD_CONFIG,
  EDIT_CONFIG,
  REMOVE_CONFIG
} from "../redux/actions/config";
import { SET_SETTING } from "../redux/actions/settings";

const { startClient, stopClient } = remote.require("./proxy");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: `calc(100vh - 64px)`,
      padding: theme.spacing(2)
    },
    empty: {
      flex: 1,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    list: {
      width: "100%",
      flex: 1,
      overflowY: "auto",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
    fabs: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      "& > *": {
        marginLeft: theme.spacing(2)
      },
      position: "fixed",
      bottom: theme.spacing(3),
      right: theme.spacing(3)
    },
    fabPlaceholder: {
      height: theme.spacing(5)
    },
    extendedIcon: {
      marginRight: theme.spacing(1)
    },
    snackbar: {
      marginBottom: theme.spacing(10)
    }
  })
);

const HomePage: React.FC = () => {
  const styles = useStyles();

  const dispatch = useTypedDispatch();
  const config = useTypedSelector(state => state.config);
  const selectedServer = useTypedSelector(
    state => state.settings.selectedServer
  );
  const mode = useTypedSelector(state => state.settings.mode);
  const settings = useTypedSelector(state => state.settings);
  const connected = useTypedSelector(state => state.status.connected);

  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editServerDialogOpen, setEditServerDialogOpen] = useState(false);
  const [editingServerId, setEditingServerId] = useState<string | null>(null);
  const [removingServerId, setRemovingServerId] = useState<string | null>(null);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  const handleModeChange: ButtonProps["onClick"] = e => {
    dispatch({
      type: SET_SETTING,
      key: "mode",
      value: e.currentTarget.id as Mode
    });
  };

  const handleServerSelect = (id: string) => {
    dispatch({
      type: SET_SETTING,
      key: "selectedServer",
      value: id
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarMessage("");
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = (selection: "qrcode" | "url" | "manual") => {
    setDialogOpen(false);
    if (selection === "manual") {
      setEditServerDialogOpen(true);
    }
  };

  const handleEditServer = (values: Config | null) => {
    setEditServerDialogOpen(false);
    if (values) {
      if (!editingServerId) {
        dispatch({ type: ADD_CONFIG, config: values, id: uuid() });
        setSnackbarMessage("Added a server");
      } else {
        dispatch({
          type: EDIT_CONFIG,
          config: values,
          id: values.id
        });
        setSnackbarMessage("Edited a server");
      }
    }

    setEditingServerId(null);
  };

  const handleEditServerDialogClose = () => {
    setEditServerDialogOpen(false);
    setEditingServerId(null);
  };

  const handleServerConnect = async () => {
    if (selectedServer) {
      setLoading(true);

      if (connected) {
        await stopClient();
      } else {
        await startClient(config.find(i => i.id === selectedServer)!, settings);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (selectedServer && connected) {
        setLoading(true);

        await startClient(config.find(i => i.id === selectedServer)!, settings);

        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, selectedServer, settings]);

  const handleEditButtonClick = (id: string) => {
    setEditingServerId(id);
    setEditServerDialogOpen(true);
  };

  const handleRemoveButtonClick = (id: string) => {
    if (id === selectedServer) {
      setSnackbarMessage("Cannot remove selected server");
      return;
    }

    setRemovingServerId(id);
    setAlertDialogOpen(true);
  };

  const handleServerRemove = () => {
    dispatch({
      type: REMOVE_CONFIG,
      config: null as any,
      id: removingServerId!
    });
    setSnackbarMessage("Removed a server");

    setAlertDialogOpen(false);
    setRemovingServerId(null);
  };

  const handleAlertDialogClose = () => {
    setAlertDialogOpen(false);
    setRemovingServerId(null);
  };

  return (
    <Container className={styles.container}>
      <ButtonGroup variant="contained" color="primary">
        {["PAC", "Global", "Manual"].map(value => (
          <Button
            key={value}
            id={value}
            onClick={handleModeChange}
            variant={mode === value ? "outlined" : "contained"}
            disableTouchRipple
            disableFocusRipple
            disableElevation
          >
            {value}
          </Button>
        ))}
      </ButtonGroup>
      {config.length === 0 ? (
        <div className={styles.empty}>
          <Typography variant="body1" color="textSecondary">
            No Server
          </Typography>
        </div>
      ) : (
        <List className={styles.list}>
          {config.map(item => (
            <ServerListItem
              key={item.id}
              remark={item.remark}
              ip={item.serverHost}
              port={item.serverPort}
              plugin={item.plugin}
              selected={item.id === selectedServer}
              onClick={() => handleServerSelect(item.id)}
              onEdit={() => handleEditButtonClick(item.id)}
              onRemove={() => handleRemoveButtonClick(item.id)}
            />
          ))}
        </List>
      )}
      <div className={styles.fabPlaceholder} />
      <div className={styles.fabs}>
        <Fab size="medium" color="secondary" onClick={handleDialogOpen}>
          <AddIcon />
        </Fab>
        <Fab
          size="medium"
          variant="extended"
          disabled={loading}
          style={{
            backgroundColor: connected ? yellow["700"] : green["A700"],
            color: "#fff"
          }}
          onClick={handleServerConnect}
        >
          {loading ? (
            <CircularProgress
              className={styles.extendedIcon}
              color="secondary"
              size={20}
            />
          ) : (
            <Logo className={styles.extendedIcon} />
          )}
          {loading ? "Connecting" : connected ? "Disconnect" : "Connect"}
        </Fab>
      </div>
      <AddServerDialog open={dialogOpen} onClose={handleDialogClose} />
      <EditServerDialog
        open={editServerDialogOpen}
        defaultValues={
          editingServerId ? config.find(i => i.id === editingServerId)! : null
        }
        onClose={handleEditServerDialogClose}
        onValues={handleEditServer}
      />
      <Dialog open={alertDialogOpen} onClose={handleAlertDialogClose}>
        <DialogTitle>Remove this server?</DialogTitle>
        <DialogContent>
          <DialogContentText>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleServerRemove} color="primary">
            Ok
          </Button>
          <Button onClick={handleAlertDialogClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        className={styles.snackbar}
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

export default HomePage;
