import React, { useEffect } from "react";
import { CssBaseline, Theme, ThemeProvider } from "@material-ui/core";
import {
  makeStyles,
  createStyles,
  createMuiTheme
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

const { isConnected } = remote.require("./proxy");

const theme = createMuiTheme({
  palette: {
    secondary: { main: "#ffffff" }
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

  useEffect(() => {
    store.dispatch({
      type: SET_STATUS,
      key: "connected",
      value: isConnected()
    });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <ThemeProvider theme={theme}>
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
