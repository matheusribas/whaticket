import React, { useContext } from "react"

import Paper from "@material-ui/core/Paper"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography";

import useTickets from "../../hooks/useTickets"

import { AuthContext } from "../../context/Auth/AuthContext";

import { i18n } from "../../translate/i18n";

import Chart from "./Chart"

const useStyles = makeStyles(theme => ({
  mainContainer: {
    height: `calc(100% + 90px)`,
    width: '100%',
    background: theme.palette.background.default,
  },
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4)
	},
	fixedHeightPaper: {
		padding: theme.spacing(2),
		display: "flex",
		overflow: "auto",
		flexDirection: "column",
		height: 240,
    boxShadow: theme.palette.type === 'dark' ? "0 3px 10px 0 rgba(34, 41, 47, 0.2)" : "0 3px 10px 0 rgba(34, 41, 47, 0.1)",
    borderRadius: theme.spacing(1),
	},
	customFixedHeightPaper: {
    display: "flex",
		flexDirection: "column",
    justifyContent: 'space-between',
		height: '100%',
		minHeight: 120,
		overflow: "auto",
		padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: theme.palette.type === 'dark' ? "0 3px 10px 0 rgba(34, 41, 47, 0.2)" : "0 3px 10px 0 rgba(34, 41, 47, 0.1)",
	},
	customFixedHeightPaperLg: {
		padding: theme.spacing(2),
		display: "flex",
		overflow: "auto",
		flexDirection: "column",
		height: "100%",
	},
}))

const Dashboard = () => {
	const classes = useStyles()

	const { user } = useContext(AuthContext);
	var userQueueIds = [];

	if (user.queues && user.queues.length > 0) {
		userQueueIds = user.queues.map(q => q.id);
	}

	const GetTickets = (status, showAll, withUnreadMessages) => {

		const { count } = useTickets({
			status: status,
			showAll: showAll,
			withUnreadMessages: withUnreadMessages,
			queueIds: JSON.stringify(userQueueIds)
		});
		return count;
	}

	return (
		<div className={classes.mainContainer}>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.customFixedHeightPaper} style={{ overflow: "hidden" }}>
              <Typography component="h3" variant="h6" color="primary" paragraph>
                {i18n.t("dashboard.messages.inAttendance.title")}
              </Typography>
              <Grid item>
                <Typography component="h1" variant="h4">
                  {GetTickets("open", "true", "false")}
                </Typography>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.customFixedHeightPaper} style={{ overflow: "hidden" }}>
              <Typography component="h3" variant="h6" color="primary" paragraph>
                {i18n.t("dashboard.messages.waiting.title")}
              </Typography>
              <Grid item>
                <Typography component="h1" variant="h4">
                  {GetTickets("pending", "true", "false")}
                </Typography>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.customFixedHeightPaper} style={{ overflow: "hidden" }}>
              <Typography component="h3" variant="h6" color="primary" paragraph>
                {i18n.t("dashboard.messages.closed.title")}
              </Typography>
              <Grid item>
                <Typography component="h1" variant="h4">
                  {GetTickets("closed", "true", "false")}
                </Typography>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.fixedHeightPaper}>
              <Chart />
            </Paper>
          </Grid>
        </Grid>
      </Container>
		</div>
	)
}

export default Dashboard