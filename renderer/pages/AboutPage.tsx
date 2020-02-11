import React from "react";
import { Container, Typography } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      height: `calc(100vh - 64px)`,
      padding: theme.spacing(2)
    }
  })
);

const AboutPage: React.FC = () => {
  const styles = useStyles();

  return (
    <Container className={styles.container}>
      <Typography variant="h6" gutterBottom>
        Shadowsocks Electron
      </Typography>
      <Typography variant="body1" gutterBottom>
        Shadowsocks GUI with cross-platform desktop support
      </Typography>
      <Typography
        variant="body2"
        component="a"
        href="https://github.com/robertying/shadowsocks-electron"
        gutterBottom
        color="primary"
      >
        robertying/shadowsocks-electron
      </Typography>
      <Typography variant="caption" gutterBottom>
        © 2020 Rui Ying
      </Typography>
    </Container>
  );
};

export default AboutPage;
