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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import NoteAddIcon from '@material-ui/icons/NoteAdd';
import DeleteIcon from '@material-ui/icons/Delete';

// Redux
import { connect } from 'react-redux';
import { selectCategory, addCategory, selectTemplate, deleteCategory, editTemplate } from '../../../actions/tem-actions';

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
	cateList: {
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

class ConnTempDetailView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: "",
			description: "",
			cname: "",
			ctype: "",
			cvalue: "",
			cdescription: "",
			openCategoryForm: false,
			isSaving: false
		}
	}

	async componentDidMount() {
		const { template } = this.props;
		if (!template)
			return;

		if (template['isLoading'] !== true)
			await this.props.selectTemplate(template.id);

		this.setState({
			name: template.name,
			description: template.description
		})
	}

	render() {
		const { classes, template } = this.props;

		if (template === null)
			return <div></div>;
		if (template['isLoading'] === true)
			return <CircularProgress className={classes.waitingSpin} />;

		return (
			<Grid container spacing={0}>
				<Grid item xs={12} md={4}>
					<Paper className={classes.descTag}>
						<TextField
							label="template title"
							margin="normal"
							InputLabelProps={{
								shrink: true,
							}}
							value={this.state.name}
							onChange={(val) => this.setState({ name: val.target.value })}
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
							<Button disabled={this.state.isSaving} className={classes.halfWidth} onClick={() => this.props.history.push("/m_temp")} color="primary">
								Cancel
						</Button>
							<Button className={classes.halfWidth} disabled={this.state.isSaving} onClick={async () => {
								this.setState({ isSaving: true });
								const { userProfile } = this.props;
								const data = {
									"name": this.state.name,
									"description": this.state.description,
									"updatedBy": userProfile.email
								};

								await this.props.editTemplate(template.id, data);
								await this.props.selectTemplate(template.id);

								this.setState({ isSaving: false });
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

				<Grid item xs={12} md={8}>
					<Paper className={classes.cateList}>
						<Table >
							<TableHead>
								<TableRow>
									<CustomTableCell> Category Name </CustomTableCell>
									<CustomTableCell align="center">Type</CustomTableCell>
									<CustomTableCell align="center">Value</CustomTableCell>
									<CustomTableCell align="center" >
										<IconButton style={{ color: "#FFFFFF" }} onClick={
											() => this.setState({ openCategoryForm: true })
										}>
											<NoteAddIcon />
										</IconButton>
									</CustomTableCell>
								</TableRow>
							</TableHead>
							<TableBody >
								{
									template.categoryList.map(
										row => (
											<TableRow className={classes.row} key={row.id} hover>
												<CustomTableCell component="th" scope="row" onClick={async () => {
													await this.props.selectCategory(row.id);
													this.props.history.push("/m_temp/category_detail");
												}}>
													{row.name}
												</CustomTableCell>
												<CustomTableCell align="center" onClick={async () => {
													await this.props.selectCategory(row.id);
													this.props.history.push("/m_temp/category_detail");
												}}>{row.type}</CustomTableCell>
												<CustomTableCell align="center" onClick={async () => {
													await this.props.selectCategory(row.id);
													this.props.history.push("/m_temp/category_detail");
												}}>{row.value}</CustomTableCell>

												<CustomTableCell align="center">
													<IconButton className={classes.button} aria-label="Delete" color="primary" onClick={
														async () => {
															await this.props.deleteCategory(row.id);
															await this.props.selectTemplate(template.id);
														}
													}>
														<DeleteIcon />
													</IconButton>
												</CustomTableCell>
											</TableRow>
										)
									)
								}
							</TableBody>
						</Table>
					</Paper>
				</Grid>
				<Dialog
					open={this.state.openCategoryForm}
					onClose={() => this.setState({ openCategoryForm: false })}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">create category</DialogTitle>
					<DialogContent>
						<DialogContentText>
							please input the correct category information
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							label="name"
							type="email"
							fullWidth
							value={this.state.cname}
							onChange={(val) => this.setState({ cname: val.target.value })}
						/>
						<TextField
							margin="dense"
							label="type"
							type="text"
							fullWidth
							value={this.state.ctype}
							onChange={(val) => this.setState({ ctype: val.target.value })}
						/>
						<TextField
							margin="dense"
							label="value"
							type="text"
							fullWidth
							value={this.state.cvalue}
							onChange={(val) => this.setState({ cvalue: val.target.value })}
						/>
						<TextField
							label="detail"
							margin="dense"
							multiline
							rows="10"
							fullWidth
							value={this.state.cdescription}
							onChange={(val) => this.setState({ cdescription: val.target.value })}
						/>
					</DialogContent>
					<DialogActions>
						<Button disabled={this.state.isSaving} onClick={() => this.setState({ openCategoryForm: false })} color="primary">
							Cancel
						</Button>
						<Button disabled={this.state.isSaving} onClick={async () => {
							this.setState({ isSaving: true });
							const { userProfile } = this.props;
							const data = {
								"name": this.state.cname,
								"type": this.state.ctype,
								"value": this.state.cvalue,
								"description": this.state.cdescription,
								"updatedBy": userProfile.email
							};

							await this.props.addCategory(template.id, data);
							await this.props.selectTemplate(template.id);

							this.setState({ openCategoryForm: false, isSaving: false });
						}} color="primary">
							Add {
								this.state.isSaving && <CircularProgress
									disableShrink
									size={24}
									thickness={4} />
							}
						</Button>
					</DialogActions>
				</Dialog>
			</Grid>
		);
	}
}

const mapStateToProps = state => {
	return {
		template: state.tem_data.selectedTemplate,
		userProfile: state.global_data.userProfile,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		selectTemplate: (id) => dispatch(selectTemplate(id)),
		selectCategory: (id) => dispatch(selectCategory(id)),
		deleteCategory: (id) => dispatch(deleteCategory(id)),
		addCategory: (id, data) => dispatch(addCategory(id, data)),
		editTemplate: (id, data) => dispatch(editTemplate(id, data))
	};
}

const TempDetailView = connect(mapStateToProps, mapDispatchToProps)(ConnTempDetailView);

TempDetailView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(TempDetailView));