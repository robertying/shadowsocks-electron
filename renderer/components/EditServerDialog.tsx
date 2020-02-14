import React, { useState, useEffect } from "react";
import {
  Dialog,
  TextField,
  DialogProps,
  useMediaQuery,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Container,
  ListItem,
  ListItemText,
  Switch,
  ListItemSecondaryAction,
  List,
  Select,
  MenuItem,
  InputLabel,
  Snackbar,
  InputAdornment,
  Input,
  FormControl
} from "@material-ui/core";
import {
  useTheme,
  makeStyles,
  createStyles,
  Theme
} from "@material-ui/core/styles";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import CloseIcon from "@material-ui/icons/Close";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Config, encryptMethods, plugins } from "../types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: "fixed"
    },
    appBarRelative: {
      position: "relative"
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1
    },
    toolbar: theme.mixins.toolbar,
    container: {
      padding: theme.spacing(2),
      paddingTop: 0,
      paddingBottom: theme.spacing(4),
      "& > *": {
        marginTop: theme.spacing(1.5),
        marginBottom: theme.spacing(1.5)
      }
    }
  })
);

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

export interface EditServerDialogProps extends DialogProps {
  defaultValues: Config | null;
  onValues: (values: Config | null) => void;
}

const EditServerDialog: React.FC<EditServerDialogProps> = props => {
  const styles = useStyles();

  const { open, onClose, defaultValues, onValues } = props;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [values, setValues] = useState<Partial<Config>>(
    defaultValues ?? {
      timeout: 60,
      encryptMethod: "xchacha20-ietf-poly1305"
    }
  );

  useEffect(() => {
    setValues(
      defaultValues ?? {
        timeout: 60,
        encryptMethod: "xchacha20-ietf-poly1305"
      }
    );
  }, [defaultValues]);

  const handleValueChange = (
    key: keyof Config,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues({
      ...values,
      [key]: e.target.value.trim()
    });
  };

  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarMessage("");
  };

  const handleCancel = () => {
    onValues(null);
  };

  const handleAdd = () => {
    if (!values.serverHost) {
      setSnackbarMessage("Invalid server address");
      return;
    }
    if (
      !(
        values.serverPort &&
        values.serverPort > 0 &&
        values.serverPort <= 65535
      )
    ) {
      setSnackbarMessage("Invalid server port");
      return;
    }
    if (!values.password) {
      setSnackbarMessage("Invalid password");
      return;
    }
    if (!values.timeout) {
      setSnackbarMessage("Invalid timeout");
      return;
    }

    onValues(values as Config);
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(v => !v);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      disableBackdropClick
      TransitionComponent={Transition}
    >
      <AppBar className={fullScreen ? styles.appBar : styles.appBarRelative}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={styles.title}>
            Edit Server
          </Typography>
          <Button color="inherit" onClick={handleAdd}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <Container className={styles.container}>
        {fullScreen && <div className={styles.toolbar} />}
        <TextField
          fullWidth
          label="Remark"
          value={values.remark ?? ""}
          onChange={e => handleValueChange("remark", e)}
        />
        <TextField
          required
          fullWidth
          label="Server Address"
          value={values.serverHost ?? ""}
          onChange={e => handleValueChange("serverHost", e)}
        />
        <TextField
          required
          fullWidth
          type="number"
          label="Server Port"
          value={values.serverPort ?? ""}
          onChange={e => handleValueChange("serverPort", e)}
        />
        <FormControl required fullWidth>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={values.password ?? ""}
            onChange={e => handleValueChange("password", e)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <InputLabel required style={{ marginBottom: 0 }}>
          Encryption
        </InputLabel>
        <Select
          required
          label="Encryption"
          displayEmpty
          fullWidth
          value={values.encryptMethod ?? "xchacha20-ietf-poly1305"}
          onChange={(e: any) => handleValueChange("encryptMethod", e)}
        >
          {encryptMethods.map(method => (
            <MenuItem key={method} value={method}>
              {method}
            </MenuItem>
          ))}
        </Select>
        <TextField
          required
          fullWidth
          label="Timeout"
          value={values.timeout ?? 60}
          onChange={e => handleValueChange("timeout", e)}
        />
        <List>
          <ListItem>
            <ListItemText primary="TCP Fast Open" />
            <ListItemSecondaryAction>
              <Switch edge="end" color="primary" />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="TCP No Delay" />
            <ListItemSecondaryAction>
              <Switch edge="end" color="primary" />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="UDP Relay" />
            <ListItemSecondaryAction>
              <Switch edge="end" color="primary" />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        <InputLabel style={{ marginBottom: 0 }}>Plugin</InputLabel>
        <Select
          label="Plugin"
          displayEmpty
          fullWidth
          value={values.plugin ?? ""}
          onChange={(e: any) => handleValueChange("plugin", e)}
        >
          <MenuItem key="none" value="">
            <em>None</em>
          </MenuItem>
          {plugins.map(plugin => (
            <MenuItem key={plugin} value={plugin}>
              {plugin}
            </MenuItem>
          ))}
        </Select>
        <TextField
          fullWidth
          multiline
          label="Plugin Options"
          value={values.pluginOpts ?? ""}
          onChange={e => handleValueChange("pluginOpts", e)}
        />
      </Container>
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
    </Dialog>
  );
};

export default EditServerDialog;
