import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import { CircularProgress, IconButton, Snackbar, ListItemSecondaryAction, TextField, Button } from '@material-ui/core';
import { getProposalMessages, addMessageToProposal } from '../../actions';

const styles = theme => ({
	root: {
		flexGrow: 1,
		height: "calc(100vh - 64px - 72px - 48px)",
	},
	listRoot: {
		padding: "10px",
		height: "calc(100vh - 64px - 72px - 48px - 64px)",
		overflow: 'auto'
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(50% - 10px)",
	},
	inline: {
		display: 'inline',
	},
	inputArea: {
		backgroundColor: "#FBFBFB",
		padding: '10px',
		display: 'flex'
	},
	inputField: {
		flexGrow: '1'
	},
	editField: {
		lineHeight: '1.5rem'
	},
	sendBtn: {
		border: "1px solid #4a148c",
		borderRadius: 0,
		backgroundColor: theme.palette.primary.light,
		color: "#FFFFFF",
		marginLeft: 10,
		'&:hover': {
			backgroundColor: theme.palette.primary.dark
		},
		'&:disabled': {
			backgroundColor: "#FFFFFF"
		}
	}
});

class ConnectedProposalDetailMessages extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			messageInput: '',
			isSending: false
		}
	}

	async componentDidMount() {
		const { proposal } = this.props;

		await this.props.getProposalMessages(proposal.id);
	}

	handleSendMessage = async () => {
		const { proposal, match, userProfile } = this.props;
		if (this.state.messageInput === '')
			return;

		this.setState({
			isSending: true
		})

		this.props.addMessageToProposal(
			proposal.id,
			{
				'content': this.state.messageInput,
				'updatedBy': userProfile.email
			},
			async (res) => {
				this.setState({
					isSending: false,
					messageInput: ''
				});

				await this.props.getProposalMessages(proposal.id);
			},
			match.url.substring(1, 7)
		);
	}

	render() {
		const { classes, proposalMessages } = this.props;

		return (
			<div className={classes.root}>
				<List className={classes.listRoot}>
					{
						proposalMessages && proposalMessages.content.map((message) =>
							(
								<div key={message.id}>
									<ListItem alignItems="flex-start">
										<ListItemAvatar>
											<Avatar> {message.from.email[0]}</Avatar>
										</ListItemAvatar>
										<ListItemText
											primary={message.from.email}
											secondary={
												<React.Fragment>
													<Typography
														component="span"
														variant="body2"
														className={classes.inline}
														color="textPrimary"
													>
														{message.content}
														{
															/* message.contractorFiles.map(file => {

															})*/
														}
													</Typography>
												</React.Fragment>
											}
										/>
										<ListItemSecondaryAction>
											{message.updatedAt}
										</ListItemSecondaryAction>
									</ListItem>
									<Divider variant="inset" component="li" />
								</div>
							)
						)
					}
				</List>
				<div className={classes.inputArea}>
					<TextField value={this.state.messageInput} className={classes.inputField}
						onChange={(event) => this.setState({ messageInput: event.target.value })}
						InputProps={{ classes: { input: classes.editField } }} />
					<Button className={classes.sendBtn}
						onClick={this.handleSendMessage} disabled={this.state.isSending}>Send</Button>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getProposalMessages: (id) => dispatch(getProposalMessages(id)),
		addMessageToProposal: (prop_id, message, cb, cont_type) => dispatch(addMessageToProposal(prop_id, message, cb, cont_type))
	}
}

const mapStateToProps = state => {
	return {
		proposalMessages: state.global_data.proposalMessages,
		userProfile: state.global_data.userProfile,
		proposal: state.global_data.proposal
	};
};

const ProposalDetailMessages = connect(mapStateToProps, mapDispatchToProps)(ConnectedProposalDetailMessages);

ProposalDetailMessages.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ProposalDetailMessages));