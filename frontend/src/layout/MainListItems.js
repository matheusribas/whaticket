import React, { useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import { Badge, makeStyles } from "@material-ui/core";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import ContactPhoneOutlinedIcon from "@material-ui/icons/ContactPhoneOutlined";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import QuestionAnswerOutlinedIcon from "@material-ui/icons/QuestionAnswerOutlined";

import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import { Can } from "../components/Can";

const useStyles = makeStyles(theme => ({
  menuItemCustom: {
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      transform: "translateY(-3px)",
      color: theme.palette.primary.main,

      "& svg": {
        fill: theme.palette.primary.main,
      }
    }
  },
  menuAdmin: {
    marginTop: theme.spacing(6)
  }
}));

function ListItemLink(props) {
  const { icon, primary, to, className } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <li>
      <ListItem button component={renderLink} className={className}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

const MainListItems = (props) => {
  const classes = useStyles()
  const { drawerClose } = props;
  const { whatsApps } = useContext(WhatsAppsContext);
  const { user } = useContext(AuthContext);
  const [connectionWarning, setConnectionWarning] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats) => {
          return (
            whats.status === "qrcode" ||
            whats.status === "PAIRING" ||
            whats.status === "DISCONNECTED" ||
            whats.status === "TIMEOUT" ||
            whats.status === "OPENING"
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  return (
    <>
      <div onClick={drawerClose}>
        <ListItemLink
          to="/"
          className={classes.menuItemCustom}
          primary="Dashboard"
          icon={<DashboardOutlinedIcon />}
        />
        <ListItemLink
          to="/connections"
          className={classes.menuItemCustom}
          primary={i18n.t("mainDrawer.listItems.connections")}
          icon={
            <Badge badgeContent={connectionWarning ? "!" : 0} color="error">
              <SyncAltIcon />
            </Badge>
          }
        />
        <ListItemLink
          to="/tickets"
          className={classes.menuItemCustom}
          primary={i18n.t("mainDrawer.listItems.tickets")}
          icon={<WhatsAppIcon />}
        />

        <ListItemLink
          to="/contacts"
          className={classes.menuItemCustom}
          primary={i18n.t("mainDrawer.listItems.contacts")}
          icon={<ContactPhoneOutlinedIcon />}
        />
        <ListItemLink
          to="/quickAnswers"
          className={classes.menuItemCustom}
          primary={i18n.t("mainDrawer.listItems.quickAnswers")}
          icon={<QuestionAnswerOutlinedIcon />}
        />
      </div>
      <Can
        role={user.profile}
        perform="drawer-admin-items:view"
        yes={() => (
          <div className={classes.menuAdmin}>
            <ListSubheader inset>
              {i18n.t("mainDrawer.listItems.administration")}
            </ListSubheader>
            <ListItemLink
              to="/users"
              className={classes.menuItemCustom}
              primary={i18n.t("mainDrawer.listItems.users")}
              icon={<PeopleAltOutlinedIcon />}
            />
            <ListItemLink
              to="/queues"
              className={classes.menuItemCustom}
              primary={i18n.t("mainDrawer.listItems.queues")}
              icon={<AccountTreeOutlinedIcon />}
            />
            <ListItemLink
              to="/settings"
              className={classes.menuItemCustom}
              primary={i18n.t("mainDrawer.listItems.settings")}
              icon={<SettingsOutlinedIcon />}
            />
          </div>
        )}
      />
    </>
  );
};

export default MainListItems;
