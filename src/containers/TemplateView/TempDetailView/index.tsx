import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RouteComponentProps } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { createStyles, withStyles } from '@material-ui/core/styles';

import 'easymde/dist/easymde.min.css';
import SimpleMDE from 'react-simplemde-editor';
import SplitPane from 'react-split-pane';
import Button from "components/CustomButtons/Button.jsx";
import CustomTableCell from "components/shared/CustomTableCell";
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import {
	addCategory,
	deleteCategory,
	deleteTemplate,
	editTemplate,
	selectCategory,
	selectTemplate,
	getTemplatesO
} from 'actions/tem-actions';
import { MaterialThemeHOC, UserProfile, TemplateDetailInfo, CategoryPostInfo, TemplatePostInfo } from 'types/global';

const styles = theme => createStyles({
	root: {
		position: 'relative'
	},
	descTag: {
		padding: theme.spacing(1),
		color: theme.palette.text.secondary,
		whiteSpace: 'nowrap',
		margin: theme.spacing(1),
		borderBottom: '5px solid ' + theme.palette.primary.light,
		height: 'calc((100vh - 64px - 48px - 16px) / 2)',
		[theme.breakpoints.up('md')]: {
			height: 'calc(100vh - 64px - 48px - 16px)',
		},
		display: 'flex',
		flexDirection: 'column',
		overflow: 'scroll',
	},
	marginRight: {
		marginRight: "5px"
	},
	cateList: {
		textAlign: 'center',
		color: theme.palette.text.secondary,
		whiteSpace: 'nowrap',
		margin: theme.spacing(1),
		borderBottom: '5px solid ' + theme.palette.primary.light,
		height: 'calc((100vh - 64px - 48px - 16px) / 2)',
		[theme.breakpoints.up('md')]: {
			height: 'calc(100vh - 64px - 48px - 16px)',
		},
		display: 'flex',
		flexDirection: 'column',
		overflow: 'scroll',
	},
	waitingSpin: {
		position: 'relative',
		left: 'calc(50vw - 10px)',
		top: 'calc(50vh - 10px)',
	},
	successAlert: {
		margin: theme.spacing(1),
	},
	editField: {
		lineHeight: '1.5rem',
	},
	busy: {
		position: 'absolute',
		left: 'calc(50% - 20px)',
		top: 'calc(50% - 20px)',
	}
});

interface ConnTempDetailViewProps extends MaterialThemeHOC, RouteComponentProps {
	getTemplatesO: (currentPage: number, rowsPerPage: number) => Promise<void>;
	selectCategory: (id: string) => Promise<void>;
	addCategory: (id: string, data: CategoryPostInfo) => Promise<void>;
	selectTemplate: (id: string) => Promise<TemplateDetailInfo>;
	deleteCategory: (id: string) => Promise<void>;
	editTemplate: (id: string, data: TemplatePostInfo) => Promise<void>;
	deleteTemplate: (id: string) => Promise<void>;
	template: TemplateDetailInfo;
	userProfile: UserProfile;
}

interface ConnTempDetailViewState extends ISnackbarProps {
	name: string;
	description: string;
	cname: string;
	ctype: string;
	cvalue: string;
	cdescription: string;
	openCategoryForm: boolean;
	isSaving: boolean;
	isDeleting: boolean;
	isAdding: boolean;
	isBusy: boolean;
}

class TemplateDetailView extends Component<ConnTempDetailViewProps, ConnTempDetailViewState> {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			description: '',
			cname: '',
			ctype: '',
			cvalue: '',
			cdescription: '',
			openCategoryForm: false,
			isSaving: false,
			isDeleting: false,
			isAdding: false,
			isBusy: false,
			showMessage: false,
			message: '',
			variant: 'success',
			handleClose: this.closeMessage
		};
	}

	closeMessage = () => {
		this.setState({ showMessage: false });
	}

	async componentDidMount() {
		const { template } = this.props;
		if (template) {
			this.setState({
				name: template.name,
				description: template.description,
			});
		}
	}

	handleCancel = () => {
		this.props.history.push('/m_temp');
	}

	handleSave = async () => {
		const { userProfile, template } = this.props;
		if (!template) return;

		const data = {
			name: this.state.name,
			description: this.state.description,
			updatedBy: userProfile.email,
		};

		this.setState({ isBusy: true });
		try {
			await this.props.editTemplate(template.id, data);
			await this.props.selectTemplate(template.id);

			this.setState({
				showMessage: true,
				message: 'Edit Template success',
				variant: 'success'
			});
		} catch (error) {
			console.log(error);
			this.setState({
				showMessage: true,
				message: 'Edit Template failed',
				variant: 'error'
			});
		}

		this.setState({ isBusy: false });
	}

	handleDelete = async () => {
		const { template } = this.props;

		this.setState({ isBusy: true });
		try {
			await this.props.deleteTemplate(template.id);
			await this.props.getTemplatesO(0, 20);
			this.setState({
				showMessage: true,
				message: 'Template deleted',
				variant: 'success',
				isBusy: false
			});
		} catch (error) {
			this.setState({
				showMessage: true,
				message: 'Please delete categories and options first',
				variant: 'error',
				isBusy: false
			});
		}
	}

	gotoCategory = async (id) => {
		this.setState({ isBusy: true });
		await this.props.selectCategory(id);
		this.setState({ isBusy: false });
		this.props.history.push(`/m_temp/category_detail`);
	}

	deleteCategory = async (id) => {
		const { template } = this.props;

		this.setState({ isBusy: true });
		try {
			await this.props.deleteCategory(id);
			await this.props.selectTemplate(template.id);
			this.setState({
				showMessage: true,
				message: 'Delete Category success',
				variant: 'success',
				isBusy: false
			});
		} catch (error) {
			this.setState({
				showMessage: true,
				message: 'Please delete options',
				variant: 'error',
				isBusy: false
			});
		}
	}

	addCategory = async () => {
		const { template, userProfile } = this.props;

		this.setState({ isBusy: true });
		const data = {
			name: this.state.cname,
			type: this.state.ctype,
			value: this.state.cvalue,
			description: this.state.cdescription,
			updatedBy: userProfile.email,
		};

		try {
			await this.props.addCategory(template.id, data);
			await this.props.selectTemplate(template.id);
			this.setState({
				showMessage: true,
				message: 'Add Category success',
				variant: 'success',
				openCategoryForm: false,
				isBusy: false,
				cname: '',
				ctype: '',
				cvalue: '',
				cdescription: ''
			});
		} catch (error) {
			console.error('TemplateDetailView.addCategory: ', error);
			this.setState({
				showMessage: true,
				message: 'Add Category failed',
				variant: 'error',
				openCategoryForm: false,
				isBusy: false
			});
		}
	}

	render() {
		const { classes, template } = this.props;

		if (!template)
			return <Box>Template not selected</Box>;

		return (
			<Box className={classes.root}>
				<SplitPane split="vertical" minSize={50} defaultSize={400} style={{ position: 'relative' }}>
					<Paper className={classes.descTag}>
						<TextField
							label="template title"
							margin="normal"
							InputLabelProps={{ shrink: true }}
							value={this.state.name}
							onChange={event => this.setState({ name: event.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<SimpleMDE
							value={this.state.description}
							onChange={val => this.setState({ description: val })}
							options={{ placeholder: 'Description here' }}
						/>
						<Box>
							<Button
								disabled={this.state.isBusy}
								className={classes.marginRight}
								onClick={this.handleCancel}
							>
								Cancel
              				</Button>
							<Button
								className={classes.marginRight}
								disabled={this.state.isBusy}
								onClick={this.handleSave}
								color="success"
							>
								Save
							</Button>
							<Button
								disabled={this.state.isBusy}
								onClick={this.handleDelete}
								color="danger"
							>
								Delete
							</Button>
						</Box>
					</Paper>
					<Paper className={classes.cateList}>
						<Table>
							<TableHead>
								<TableRow>
									<CustomTableCell>Category Name</CustomTableCell>
									<CustomTableCell align="center">Type</CustomTableCell>
									<CustomTableCell align="center">Value</CustomTableCell>
									<CustomTableCell align="center">
										<IconButton
											style={{ color: '#fff' }}
											onClick={() => this.setState({ openCategoryForm: true })}
										>
											<NoteAddIcon />
										</IconButton>
									</CustomTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{template.categoryList && template.categoryList.map(row => (
									<TableRow className={classes.row} key={row.id} hover>
										<CustomTableCell
											component="th"
											scope="row"
											onClick={() => this.gotoCategory(row.id)}
										>
											{row.name}
										</CustomTableCell>
										<CustomTableCell
											align="center"
											onClick={() => this.gotoCategory(row.id)}
										>
											{row.type}
										</CustomTableCell>
										<CustomTableCell
											align="center"
											onClick={() => this.gotoCategory(row.id)}
										>
											{row.value}
										</CustomTableCell>

										<CustomTableCell align="center">
											<IconButton
												className={classes.button}
												aria-label="Delete"
												color="primary"
												onClick={() => this.deleteCategory(row.id)}
											>
												<DeleteIcon />
											</IconButton>
										</CustomTableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Paper>
				</SplitPane>
				<Dialog
					open={this.state.openCategoryForm}
					onClose={() => this.setState({ openCategoryForm: false })}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">Create category</DialogTitle>
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
							onChange={val => this.setState({ cname: val.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<TextField
							margin="dense"
							label="type"
							type="text"
							fullWidth
							value={this.state.ctype}
							onChange={val => this.setState({ ctype: val.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<TextField
							margin="dense"
							label="value"
							type="text"
							fullWidth
							value={this.state.cvalue}
							onChange={val => this.setState({ cvalue: val.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<SimpleMDE
							value={this.state.cdescription}
							onChange={val => this.setState({ cdescription: val })}
							options={{ placeholder: 'Description here' }}
						/>
					</DialogContent>
					<DialogActions>
						<Button
							disabled={this.state.isAdding}
							onClick={() => this.setState({ openCategoryForm: false })}
						>
							Cancel
            			</Button>
						<Button
							disabled={this.state.isAdding}
							onClick={this.addCategory}
							color="primary"
						>
							Add
						</Button>
					</DialogActions>
				</Dialog>
				<CustomSnackbar
					open={this.state.showMessage}
					variant={this.state.variant}
					message={this.state.message}
					handleClose={this.state.handleClose}
				/>
				{this.state.isBusy && <CircularProgress className={classes.busy} />}
			</Box>
		);
	}
}

const mapStateToProps = state => ({
	template: state.tem_data.selectedTemplate,
	userProfile: state.global_data.userProfile,
});

const mapDispatchToProps = {
	getTemplatesO,
	selectTemplate,
	selectCategory,
	deleteCategory,
	addCategory,
	editTemplate,
	deleteTemplate,
};

export default compose(
	withStyles(styles),
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(TemplateDetailView)
