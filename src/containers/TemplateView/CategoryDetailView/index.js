import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

// material ui
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
	CircularProgress,
	Table, TableHead, TableCell, TableRow, TableBody,
	IconButton,
	Button,
	Link
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
import { selectCategory, addOption, deleteOption, editOption, editCategory, selectOption, selectTemplate } from '../../../actions/tem-actions';

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

class ConnCategoryDetailView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: "",
			type: "",
			value: "",
			description: "",
			oname: "",
			ovalue: "",
			oid: "",
			odescription: "",
			openCategoryForm: false,
			isSaving: false,
			template: null,
		}
	}

	async componentDidMount() {
		const { category } = this.props;
		if (!category)
			return;

		this.setState({
			name: category.name,
			type: category.type,
			value: category.value,
			description: category.description,
		});
	}

	render() {
		const { classes, category } = this.props;

		if (category === null)
			return <div> </div>;

		if (category['isLoading'] === true)
			return <CircularProgress className={classes.waitingSpin} />;

		return (
			<Grid container spacing={0}>
				<Grid item xs={12} md={4}>
					<Paper className={classes.descTag}>
						<div><Link style={{ float: "left" }} onClick={async () => {
							await this.props.selectTemplate(category.tem_name.id);
							this.props.history.push("/m_temp/template_detail");
						}
						}>{category.tem_name.name}</Link></div>
						<TextField
							label="category name"
							margin="normal"
							InputLabelProps={{
								shrink: true,
							}}
							value={this.state.name}
							onChange={(val) => this.setState({ name: val.target.value })}
						/>
						<TextField
							label="category type"
							margin="normal"
							InputLabelProps={{
								shrink: true,
							}}
							value={this.state.type}
							onChange={(val) => this.setState({ type: val.target.value })}
						/>
						<TextField
							label="category value"
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

								await this.props.editCategory(category.id, data);
								await this.props.selectCategory(category.id);

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

				<Grid item xs={12} md={8}>
					<Paper className={classes.optList}>
						<Table >
							<TableHead>
								<TableRow>
									<CustomTableCell> Option Name </CustomTableCell>
									<CustomTableCell align="center">Value</CustomTableCell>
									<CustomTableCell align="center" >
										<IconButton style={{ color: "#FFFFFF" }} onClick={
											() => this.setState({
												oname: "",
												ovalue: "",
												odescription: "",
												oid: "",
												openCategoryForm: true
											})
										}>
											<NoteAddIcon />
										</IconButton>
									</CustomTableCell>
								</TableRow>
							</TableHead>
							<TableBody >
								{
									category.optionList.map(
										row => (
											<TableRow className={classes.row} key={row.id} hover>
												<CustomTableCell component="th" scope="row" onClick={async () => {
													await this.props.selectOption(row.id);
													this.props.history.push("/m_temp/option_detail");
												}}>
													{row.name}
												</CustomTableCell>
												<CustomTableCell align="center" onClick={async () => {
													await this.props.selectOption(row.id);
													this.props.history.push("/m_temp/option_detail");
												}}>{row.value}</CustomTableCell>

												<CustomTableCell align="center">
													<IconButton className={classes.button} aria-label="Delete" color="primary" onClick={
														async () => {
															await this.props.deleteOption(row.id);
															await this.props.selectCategory(category.id);
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
					<DialogTitle id="form-dialog-title"> create option</DialogTitle>
					<DialogContent>
						<DialogContentText>
							please input the correct option information
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							label="name"
							type="email"
							fullWidth
							value={this.state.oname}
							onChange={(val) => this.setState({ oname: val.target.value })}
						/>
						<TextField
							margin="dense"
							label="value"
							type="text"
							fullWidth
							value={this.state.ovalue}
							onChange={(val) => this.setState({ ovalue: val.target.value })}
						/>
						<TextField
							label="detail"
							margin="dense"
							multiline
							rows="10"
							fullWidth
							value={this.state.odescription}
							onChange={(val) => this.setState({ odescription: val.target.value })}
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
								"name": this.state.oname,
								"value": this.state.ovalue,
								"description": this.state.odescription,
								"updatedBy": userProfile.email
							};

							await this.props.addOption(category.id, data);
							await this.props.selectCategory(category.id);

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
		category: state.tem_data.selectedCategory,
		userProfile: state.global_data.userProfile
	};
};

const mapDispatchToProps = dispatch => {
	return {
		selectTemplate: (id) => dispatch(selectTemplate(id)),
		deleteOption: (id) => dispatch(deleteOption(id)),
		selectCategory: (id) => dispatch(selectCategory(id)),
		addOption: (id, data) => dispatch(addOption(id, data)),
		editOption: (id, data) => dispatch(editOption(id, data)),
		editCategory: (id, data) => dispatch(editCategory(id, data)),
		selectOption: (id) => dispatch(selectOption(id)),
		getTemplateById: (id, cb) => dispatch(getTemplateById(id, cb))
	};
}

const CategoryDetailView = connect(mapStateToProps, mapDispatchToProps)(ConnCategoryDetailView);

CategoryDetailView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(CategoryDetailView));