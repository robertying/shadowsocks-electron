import { RootState } from "../types";

const defaultStore: RootState = {
  config: [],
  status: {
    connected: false
  },
  settings: {
    selectedServer: null,
    mode: "PAC",
    verbose: false,
    localPort: 1080,
    pacPort: 1090,
    gfwListUrl:
      "https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt"
  }
};

export default defaultStore;
