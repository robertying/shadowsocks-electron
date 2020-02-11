import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { ReactComponent as LogoSrc } from "../../assets/logo.svg";

const useStyles = makeStyles(theme =>
  createStyles({
    logo: {
      width: 30,
      height: 30,
      filter:
        "invert(100%) sepia(100%) saturate(0%) hue-rotate(151deg) brightness(120%) contrast(101%)"
    }
  })
);

const Logo: typeof LogoSrc = props => {
  const styles = useStyles();
  const { className, ...restProps } = props;

  return <LogoSrc className={`${styles.logo} ${className}`} {...restProps} />;
};

export default Logo;
