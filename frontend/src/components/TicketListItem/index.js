import React, { useEffect, useRef } from "react";

import { useHistory, useParams } from "react-router-dom";
import { parseISO, format, isSameDay } from "date-fns";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";
import Chip from '@material-ui/core/Chip';
import AccountTreeOutlinedIcon from '@material-ui/icons/AccountTreeOutlined';
import SyncAltOutlinedIcon from '@material-ui/icons/SyncAltOutlined';

import { i18n } from "../../translate/i18n";
import MarkdownWrapper from "../MarkdownWrapper";

const useStyles = makeStyles(theme => ({
	ticket: {
		position: "relative",
	},
  avatar: {
    minHeight: "74px",
    display: 'flex',
    alignItems: 'flex-start',

    "& .MuiAvatar-root": {
      width: '45px',
      height: '45px',
    }
  },

	pendingTicket: {
		cursor: "unset",
	},

	noTicketsDiv: {
		display: "flex",
		height: "100px",
		margin: 40,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	},

	noTicketsText: {
		textAlign: "center",
		color: "rgb(104, 121, 146)",
		fontSize: "14px",
		lineHeight: "1.4",
	},

	noTicketsTitle: {
		textAlign: "center",
		fontSize: "16px",
		fontWeight: "600",
		margin: "0px",
	},

	contactNameWrapper: {
		display: "flex",
		justifyContent: "space-between",
    marginTop: '.25rem',
    "& a": {
      color: "#53bdeb"
    },
	},
  contactHeader: {

  },
  contactFooter: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'end',

    marginTop: '.5rem',
    
    "& .MuiChip-root": {
      paddingRight: '.25rem',
      paddingLeft: '.25rem',
      color: theme.palette.warning.light,
      borderColor: theme.palette.warning.light,

      marginTop: '.25rem',
      "& + .MuiChip-root": {
        marginLeft: '.25rem',
      }
    },
    "& svg.MuiChip-avatar": {
      background: 'transparent',
      color: `${theme.palette.warning.light}`
    },
  },

	lastMessageTime: {
		justifySelf: "flex-end",
	},

	closedBadge: {
		alignSelf: "center",
		justifySelf: "flex-end",
		marginRight: 32,
		marginLeft: "auto",
	},

	contactLastMessage: {
		paddingRight: 20,
	},

	newMessagesCount: {
		alignSelf: "center",
		marginRight: 8,
		marginLeft: "auto",
	},

	badgeStyle: {
		color: theme.palette.text.primary,
		backgroundColor: theme.palette.primary.dark,
	},

	acceptButton: {
		position: "absolute",
		left: "50%",
	},

	ticketQueueColor: {
		flex: "none",
		width: "8px",
		height: "80%",
		position: "absolute",
		top: "0%",
		left: "0%",
    margin: '7px 0 0 4px',
    borderRadius: "8px"
	},

	userTag: {
		position: "absolute",
		marginRight: 5,
		right: 5,
		bottom: 5,
		background: "#2576D2",
		color: "#ffffff",
		border: "1px solid #CCC",
		padding: 1,
		paddingLeft: 5,
		paddingRight: 5,
		borderRadius: 10,
		fontSize: "0.9em"
	},
}));

const TicketListItem = ({ ticket }) => {

	const classes = useStyles();
	const history = useHistory();
	const { ticketId } = useParams();
	const isMounted = useRef(true);

	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	const handleSelectTicket = id => {
		history.push(`/tickets/${id}`);
	};

	return (
		<React.Fragment key={ticket.id}>
			<ListItem
				dense
        component='a'
				button
				onClick={e => handleSelectTicket(ticket.id)}
				selected={ticketId && +ticketId === ticket.id}
				className={clsx(classes.ticket, {
					[classes.pendingTicket]: ticket.status === "pending",
				})}
			>
				<ListItemAvatar className={classes.avatar}>
					<Avatar src={ticket?.contact?.profilePicUrl} />
				</ListItemAvatar>
				<ListItemText
					disableTypography
					primary={
            <div className={classes.contactHeader}>
              <span className={classes.contactNameWrapper}>
                <Typography
                  noWrap
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  {ticket.contact.name}
                </Typography>
                {ticket.status === "closed" && (
                  <Badge
                    className={classes.closedBadge}
                    badgeContent={"fechado"}
                    color="danger"
                  />
                )}
                {ticket.lastMessage && (
                  <Typography
                    className={classes.lastMessageTime}
                    component="span"
                    variant="body2"
                    color="textSecondary"
                  >
                    {isSameDay(parseISO(ticket.updatedAt), new Date()) ? (
                      <>{format(parseISO(ticket.updatedAt), "HH:mm")}</>
                    ) : (
                      <>{format(parseISO(ticket.updatedAt), "dd/MM/yyyy")}</>
                    )}
                  </Typography>
                )}
              </span>
              <span className={classes.contactNameWrapper}>
                <Typography
                  className={classes.contactLastMessage}
                  noWrap
                  component="span"
                  variant="body2"
                  color="textSecondary"
                >
                  {ticket.lastMessage ? (
                    <MarkdownWrapper>{ticket.lastMessage}</MarkdownWrapper>
                  ) : (
                    <br />
                  )}
                </Typography>

                <Badge
                  className={classes.newMessagesCount}
                  badgeContent={ticket.unreadMessages}
                  classes={{
                    badge: classes.badgeStyle,
                  }}
                />
              </span>
            </div>
					}
					secondary={
            <div className={classes.contactFooter}>
              {ticket.queue?.name && (
                <Chip
                  avatar={(
                    <AccountTreeOutlinedIcon 
                      style={{ color: ticket.queue?.color }}
                    />
                  )}
                  variant="outlined"
                  size="small"
                  style={{ borderColor: ticket.queue?.color, color: ticket.queue?.color }}
                  title={`Fila que o contato está atualmente.`}
                  label={ticket.queue?.name}
                />
              )}
              <Chip
                avatar={<SyncAltOutlinedIcon />}
                variant="outlined"
                size="small"
                title={i18n.t("ticketsList.connectionTitle")}
                label={ticket.whatsapp?.name}
              />
            </div>
					}
				/>
			</ListItem>
			<Divider variant="inset" component="li" />
		</React.Fragment>
	);
};

export default TicketListItem;
