import React from "react";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  DialogProps,
  ButtonBaseProps,
  ListItemProps
} from "@material-ui/core";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import CopyIcon from "@material-ui/icons/Code";
import CreateIcon from "@material-ui/icons/Create";

export interface AddServerDialog extends DialogProps {
  onClose: (selection: "qrcode" | "url" | "manual") => void;
}

const ListItemButton = ListItem as React.ComponentType<
  ButtonBaseProps & ListItemProps
>;

const AddServerDialog: React.FC<AddServerDialog> = props => {
  const { onClose, open } = props;

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Add Server</DialogTitle>
      <List>
        <ListItemButton button onClick={() => onClose("qrcode")}>
          <ListItemAvatar>
            <CameraIcon />
          </ListItemAvatar>
          <ListItemText primary="Scan QR Code From Screen" />
        </ListItemButton>
        <ListItemButton button onClick={() => onClose("url")}>
          <ListItemAvatar>
            <CopyIcon />
          </ListItemAvatar>
          <ListItemText primary="Import Server URL from Clipboard" />
        </ListItemButton>
        <ListItemButton button onClick={() => onClose("manual")}>
          <ListItemAvatar>
            <CreateIcon />
          </ListItemAvatar>
          <ListItemText primary="Add Server Manually" />
        </ListItemButton>
      </List>
    </Dialog>
  );
};

export default AddServerDialog;
