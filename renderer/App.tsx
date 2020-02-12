import React, { useEffect, useState, useCallback } from "react";
import { CssBaseline } from "@material-ui/core";
import {
  makeStyles,
  createStyles,
  createMuiTheme,
  Theme,
  ThemeProvider
} from "@material-ui/core/styles";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ipcRenderer, remote } from "electron";
import AppNav from "./components/AppNav";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import AboutPage from "./pages/AboutPage";
import { store, persistor } from "./redux/store";
import Loading from "./components/Loading";
import { SET_STATUS } from "./redux/actions/status";

const nativeTheme = remote.nativeTheme;
const { isConnected } = remote.require("./proxy");

const mainTheme = createMuiTheme({
  palette: {
    secondary: {
      main: "#fff"
    }
  }
});

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#1769aa"
    },
    secondary: {
      main: "#424242"
    }
  }
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1
    }
  })
);

ipcRenderer.on("connected", (e, message) => {
  store.dispatch({
    type: SET_STATUS,
    key: "connected",
    value: message
  });
});

const App: React.FC = () => {
  const styles = useStyles();

  const [darkMode, setDarkMode] = useState(nativeTheme.shouldUseDarkColors);

  useEffect(() => {
    store.dispatch({
      type: SET_STATUS,
      key: "connected",
      value: isConnected()
    });
  }, []);

  const listener = useCallback(() => {
    setDarkMode(nativeTheme.shouldUseDarkColors);
  }, []);

  useEffect(() => {
    nativeTheme.addListener("updated", listener);
    return () => {
      nativeTheme.removeListener("updated", listener);
    };
  }, [listener]);

  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <ThemeProvider theme={darkMode ? darkTheme : mainTheme}>
          <Router>
            <div className={styles.root}>
              <CssBaseline />
              <AppNav />
              <main className={styles.content}>
                <div className={styles.toolbar} />
                <Switch>
                  <Route path="/home">
                    <HomePage />
                  </Route>
                  <Route path="/settings">
                    <SettingsPage />
                  </Route>
                  <Route path="/about">
                    <AboutPage />
                  </Route>
                  <Redirect to="/home" />
                </Switch>
              </main>
            </div>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
