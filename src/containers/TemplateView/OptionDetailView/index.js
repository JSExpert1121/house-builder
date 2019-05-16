import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

// material ui
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
	CircularProgress,
	Table, TableHead, TableCell, TableRow, TableBody,
	IconButton,
	Button
} from '@material-ui/core';
import { Paper, TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import DeleteIcon from '@material-ui/icons/Delete';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// Redux
import { connect } from 'react-redux';
import { selectOption, editOption } from '../../../actions/tem-actions';

const styles = theme => ({
	descTag: {
		padding: theme.spacing.unit,
		textAlign: 'center',
		color: theme.palette.text.secondary,
		whiteSpace: 'nowrap',
		margin: theme.spacing.unit,
		borderBottom: "5px solid " + theme.palette.primary.light,
		height: "calc((100vh - 64px - 72px - 20px) / 2)",
		[theme.breakpoints.up('md')]: {
			height: "calc(100vh - 64px - 72px - 20px)",
		},
		display: 'flex',
		flexDirection: "column",
		overflow: "scroll"
	},
	halfWidth: {
		width: "calc(50% - 20px)"
	},
	optList: {
		textAlign: 'center',
		color: theme.palette.text.secondary,
		whiteSpace: 'nowrap',
		margin: theme.spacing.unit,
		borderBottom: "5px solid " + theme.palette.primary.light,
		height: "calc((100vh - 64px - 72px - 40px) / 2)",
		[theme.breakpoints.up('md')]: {
			height: "calc(100vh - 64px - 72px - 20px)",
		},
		display: 'flex',
		flexDirection: "column",
		overflow: "scroll"
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50vw - 10px)",
		top: "calc(50vh - 10px)",
	}
});

const CustomTableCell = withStyles(theme => ({
	head: {
		backgroundColor: theme.palette.primary.light,
		color: theme.palette.common.white,
	},
	body: {
		fontSize: 14,
		color: theme.palette.primary.light
	},
}))(TableCell);

class ConnOptionDetailView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: "",
			value: "",
			description: "",
			openCategoryForm: false,
			isSaving: false,
			isEditing: false,
		}
	}

	componentDidMount() {
		const { option } = this.props;
		if (!option)
			return;

		this.setState({
			name: option.name,
			value: option.value,
			description: option.description
		})
	}

	render() {
		const { classes, option } = this.props;

		if (option === null)
			return <div> </div>;

		if (option['isLoading'] === true)
			return <CircularProgress className={classes.waitingSpin} />;

		return (
			<Grid container spacing={0}>
				<Grid item xs={12} md={3}>
					<Paper className={classes.descTag}>
						template: {option.tem_name} -> category: {option.cat_name}
						<TextField
							label="option name"
							margin="normal"
							InputLabelProps={{
								shrink: true,
							}}
							value={this.state.name}
							onChange={(val) => this.setState({ name: val.target.value })}
						/>
						<TextField
							label="option value"
							margin="normal"
							InputLabelProps={{
								shrink: true,
							}}
							value={this.state.value}
							onChange={(val) => this.setState({ value: val.target.value })}
						/>
						<TextField
							label="detail"
							multiline
							rows="10"
							margin="normal"
							InputLabelProps={{
								shrink: true,
							}}
							value={this.state.description}
							onChange={(val) => this.setState({ description: val.target.value })}
						/>
						<div>
							<Button className={classes.halfWidth} disabled={this.state.isSaving} onClick={() => this.props.history.push("/m_temp/template_detail")} color="primary">
								Cancel
							</Button>
							<Button className={classes.halfWidth} disabled={this.state.isSaving} onClick={async () => {
								this.setState({ isSaving: true });
								const { userProfile } = this.props;
								const data = {
									"name": this.state.name,
									"type": this.state.type,
									"value": this.state.value,
									"description": this.state.description,
									"updatedBy": userProfile.email
								};

								await this.props.editOption(option.id, data);
								await this.props.selectOption(option.id);

								this.setState({ openCategoryForm: false, isSaving: false });
							}} color="primary">
								Save {
									this.state.isSaving && <CircularProgress
										disableShrink
										size={24}
										thickness={4} />
								}
							</Button>
						</div>
					</Paper>
				</Grid>

				<Grid item xs={12} md={9}>
					<Paper className={classes.optList}>

					</Paper>
				</Grid>
			</Grid>
		);
	}
}

const mapStateToProps = state => {
	return {
		option: state.tem_data.selectedOption,
		userProfile: state.global_data.userProfile
	};
};

const mapDispatchToProps = dispatch => {
	return {
		selectOption: (id) => dispatch(selectOption(id)),
		editOption: (id, data) => dispatch(editOption(id, data)),
	};
}

const OptionDetailView = connect(mapStateToProps, mapDispatchToProps)(ConnOptionDetailView);

OptionDetailView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(OptionDetailView));