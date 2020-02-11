import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  ListItemProps,
  ListItemIcon
} from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import ShareIcon from "@material-ui/icons/Share";
import RemoveIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    action: {
      "& > *": {
        marginLeft: theme.spacing(2)
      }
    }
  })
);

export interface ServerListItemProps extends ListItemProps {
  remark?: string;
  ip: string;
  port: number;
  plugin?: string;
  onEdit?: () => void;
  onShare?: () => void;
  onRemove?: () => void;
}

const ServerListItem: React.FC<ServerListItemProps> = props => {
  const styles = useStyles();

  const {
    remark,
    ip,
    port,
    plugin,
    selected,
    onClick,
    onEdit,
    onShare,
    onRemove
  } = props;

  const origin = `${ip}:${port}`;

  const [actionHidden, setActionHidden] = useState(true);

  const handleActionHide = () => {
    setActionHidden(true);
  };

  const handleActionShow = () => {
    setActionHidden(false);
  };

  const handleEditButtonClick = () => {
    onEdit?.();
  };

  const handleShareButtonClick = () => {
    onShare?.();
  };

  const handleRemoveButtonClick = () => {
    onRemove?.();
  };

  return (
    <div onMouseEnter={handleActionShow} onMouseLeave={handleActionHide}>
      <ListItem button onClick={onClick as any}>
        {selected && (
          <ListItemIcon>
            <CheckIcon />
          </ListItemIcon>
        )}
        <ListItemText
          primary={remark ? remark : origin}
          secondary={
            remark && plugin
              ? `${origin} / ${plugin}`
              : remark
              ? origin
              : plugin
              ? plugin
              : ""
          }
        />
        <ListItemSecondaryAction
          className={styles.action}
          hidden={actionHidden}
        >
          <IconButton edge="end" onClick={handleShareButtonClick}>
            <ShareIcon />
          </IconButton>
          <IconButton edge="end" onClick={handleEditButtonClick}>
            <EditIcon />
          </IconButton>
          <IconButton edge="end" onClick={handleRemoveButtonClick}>
            <RemoveIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  );
};

export default ServerListItem;
