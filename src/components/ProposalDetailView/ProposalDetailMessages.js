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

import ReactScrolla from 'react-scrolla';

import { CircularProgress, IconButton, Snackbar, ListItemSecondaryAction, TextField, Button } from '@material-ui/core';
import { getProposalMessages, addMessageToProposal } from '../../actions';

const styles = theme => ({
	root: {
		flexGrow: 1,
		height: "calc(100vh - 64px - 72px - 48px - 20px)",
		display: 'flex',
		flexDirection: 'column'
	},
	listRoot: {
		padding: "10px",
		overflow: 'scroll',
		flexGrow: 1
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
		display: 'flex',
		borderTop: "1px solid #AAAAAA",
	},
	inputField: {
		flexGrow: 1,
		border: "1px solid #AAAAAA",
	},
	editField: {
		lineHeight: '1.5rem',
		underline: 'none',
		padding: '0 10px 0 10px'
	},
	sendBtn: {
		border: "1px solid #4a148c",
		borderRadius: 0,
		backgroundColor: theme.palette.primary.light,
		color: "#FFFFFF",
		marginLeft: 10,
		height: 39,
		width: 100,
		'&:hover': {
			backgroundColor: theme.palette.primary.dark
		},
		'&:disabled': {
			backgroundColor: "#FAFAFA",
			border: "1px solid #AAAAAA",
		}
	}
});

class ConnectedProposalDetailMessages extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			messageInput: '',
			isSending: false,
			currentPage: 0,
			isLoadingMore: false,
			messageList: []
		}
	}

	async componentDidMount() {
		const { proposal } = this.props;

		await this.props.getProposalMessages(proposal.id, 0, (res) => {
			let { messageList } = this.state;
			messageList.push(res);

			if (res)
				this.setState({ messageList: messageList });
		});
	}

	handleSendMessage = async () => {
		const { proposal, match, userProfile } = this.props;
		const { messageList } = this.state;

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
				const pagen = messageList[messageList.length - 1].numberOfElements === 20 ?
					messageList[messageList.length - 1].number + 1 : messageList[messageList.length - 1].number;

				this.setState({
					isSending: false,
					messageInput: ''
				});

				await this.props.getProposalMessages(proposal.id, pagen, (res) => {
					if (messageList[messageList.length - 1].number === pagen) {
						messageList[messageList.length - 1] = res;
					} else {
						messageList.push(res);
					}

					this.setState({ messageList });
				});
			},
			match.url.substring(1, 7)
		);
	}

	handleMessageKey = (ev) => {
		if (ev.key === 'Enter' && ev.shiftKey) {
			ev.preventDefault();
			this.handleSendMessage();
		}
	}

	handleLoadMore = async () => {
		const { proposal } = this.props;
		const { messageList } = this.state;

		if (this.state.isLoadingMore)
			return;

		this.setState({
			isLoadingMore: true
		});

		if (messageList.length === 0)
			return;

		if (messageList[messageList.length - 1].number < messageList[messageList.length - 1].totalPages - 1) {
			await this.props.getProposalMessages(proposal.id, messageList[messageList.length - 1].number + 1, (res) => {
				messageList.push(res);

				if (res)
					this.setState({ messageList: messageList });
			});
		}

		this.setState({
			isLoadingMore: false
		})
	}

	render() {
		const { classes } = this.props;
		const { messageList } = this.state;
		const lineCount = this.state.messageInput.split('\n').length;

		const renderMessages =
			messageList.map(messages => messages.content.map((message) =>
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
											<pre>{message.content}</pre>
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
			));

		return (
			<div className={classes.root} >
				<ReactScrolla
					className={classes.listRoot}
					percentage={95}
					onPercentage={this.handleLoadMore} >
					{renderMessages}
					<br />
					{this.state.isLoadingMore && <CircularProgress className={classes.waitingSpin}
						size={24}
						thickness={4} />}
				</ReactScrolla>
				<div className={classes.inputArea}>
					<TextField value={this.state.messageInput}
						multiline rows={lineCount > 5 ? 5 : lineCount}
						className={classes.inputField}
						onChange={(event) => this.setState({ messageInput: event.target.value })}
						InputProps={{ disableUnderline: true, classes: { input: classes.editField } }}
						onKeyPress={this.handleMessageKey} />
					<Button className={classes.sendBtn}
						onClick={this.handleSendMessage}
						disabled={this.state.isSending || (this.state.messageInput.length - lineCount + 1) === 0}>Send</Button>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getProposalMessages: (id, page, cb) => dispatch(getProposalMessages(id, page, cb)),
		addMessageToProposal: (prop_id, message, cb, cont_type) => dispatch(addMessageToProposal(prop_id, message, cb, cont_type))
	}
}

const mapStateToProps = state => {
	return {
		userProfile: state.global_data.userProfile,
		proposal: state.global_data.proposal
	};
};

const ProposalDetailMessages = connect(mapStateToProps, mapDispatchToProps)(ConnectedProposalDetailMessages);

ProposalDetailMessages.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ProposalDetailMessages));