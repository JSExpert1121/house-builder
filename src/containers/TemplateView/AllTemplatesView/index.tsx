import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from "redux";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { createStyles, withStyles } from '@material-ui/core/styles';

import { History } from 'history';
import 'easymde/dist/easymde.min.css';
import SimpleMDE from 'react-simplemde-editor';
import removeMd from 'remove-markdown';

import CustomTableCell from "components/shared/CustomTableCell";
import Button from 'components/CustomButtons/Button';
import { createTemplate, deleteTemplate, getTemplatesO, selectTemplate } from 'actions/tem-actions';
import { MaterialThemeHOC, UserProfile, TemplatePostInfo, Templates } from 'types/global';
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';


const styles = theme => createStyles({
	root: {
		position: 'relative'
	},
	marginRight: {
		marginRight: '5px',
	},
	row: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default,
		},
	},
	waitingSpin: {
		position: 'relative',
		left: 'calc(50% - 10px)',
		top: 'calc(40vh)',
	},
	successAlert: {
		marginBottom: '10px',
	},
	editField: {
		lineHeight: '1.5rem',
	},
	busy: {
		position: 'fixed',
		left: 'calc(50vw - 20px)',
		top: 'calc(50vh - 20px)',
	}
});

interface ConnAllTemplateViewProps extends MaterialThemeHOC {
	getTemplatesO: (currentPage: number, rowsPerPage: number) => Promise<void>;
	selectTemplate: (id: string) => Promise<void>;
	deleteTemplate: (id: string) => Promise<void>;
	createTemplate: (data: TemplatePostInfo) => Promise<void>;
	templates: Templates;
	history: History;
	userProfile: UserProfile;
}

interface ConnAllTemplateViewState extends ISnackbarProps {
	rowsPerPage: number;
	currentPage: number;
	isBusy: boolean;
	openCategoryForm: boolean;
	name: string;
	description: string;
}

class AllTemplateView extends Component<ConnAllTemplateViewProps, ConnAllTemplateViewState> {
	constructor(props) {
		super(props);

		this.state = {
			rowsPerPage: 20,
			currentPage: 0,
			isBusy: false,
			openCategoryForm: false,
			name: '',
			description: '',
			showMessage: false,
			message: '',
			variant: 'success',
			handleClose: this.closeMessage
		};
	}

	closeMessage = () => {
		this.setState({ showMessage: false });
	}

	componentDidMount() {
		this.props.getTemplatesO(0, 20);
	}

	handleChangePage = (event, page) => {
		this.setState({ currentPage: page });

		this.props.getTemplatesO(page, this.state.rowsPerPage);
	};

	handleChangeRowsPerPage = event => {
		const { templates } = this.props;
		const rowsPerPage = event.target.value;
		const currentPage =
			rowsPerPage >= templates.totalElements ? 0 : this.state.currentPage;

		this.setState({
			rowsPerPage: rowsPerPage,
			currentPage: currentPage,
		});

		this.props.getTemplatesO(currentPage, rowsPerPage);
	};

	createTemplate = async () => {
		const { userProfile } = this.props;
		const data = {
			name: this.state.name,
			description: this.state.description,
			updatedBy: userProfile.email,
		};

		this.setState({ isBusy: true, openCategoryForm: false });
		try {
			await this.props.createTemplate(data);
			await this.props.getTemplatesO(0, this.state.rowsPerPage);
			this.setState({
				showMessage: true,
				message: 'Create Template success',
				variant: 'success',
				isBusy: false,
				name: '',
				description: ''
			});
		} catch (error) {
			console.log('AllTemplatesView.createTemplate: ', error);
			this.setState({
				showMessage: true,
				message: 'Create Template failed',
				variant: 'error',
				isBusy: false
			});
		}
	}

	deleteTemplate = async (id) => {

		const { templates } = this.props;
		this.setState({ isBusy: true });
		try {
			await this.props.deleteTemplate(id);

			let curPage = this.state.currentPage;
			if (this.state.rowsPerPage * this.state.currentPage >= templates.totalElements - 1) {
				curPage--;
			}

			await this.props.getTemplatesO(curPage, this.state.rowsPerPage);
			this.setState({
				isBusy: false,
				showMessage: true,
				variant: 'success',
				message: 'Delete Template success',
				currentPage: curPage
			});
		} catch (error) {
			console.log('AllTemplatesView.deleteTemplate: ', error);
			this.setState({
				isBusy: false,
				showMessage: true,
				variant: 'error',
				message: 'Please delete categories'
			});
		}
	}

	selectTemplate = async (id) => {
		this.setState({ isBusy: true });
		await this.props.selectTemplate(id);
		this.setState({ isBusy: false });
		this.props.history.push(`/m_temp/template_detail`);
	}

	render() {
		const { classes, templates } = this.props;

		if (!templates) {
			return <CircularProgress className={classes.waitingSpin} />;
		}

		return (
			<Paper className={classes.root}>
				<Table>
					<TableHead>
						<TableRow>
							<CustomTableCell> Template Name </CustomTableCell>
							<CustomTableCell align="center">
								Template Description
              				</CustomTableCell>
							<CustomTableCell align="center">
								<IconButton
									style={{ color: '#FFFFFF' }}
									onClick={() => this.setState({ openCategoryForm: true })}
								>
									<NoteAddIcon />
								</IconButton>
							</CustomTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{templates.content.map(row => (
							<TableRow className={classes.row} key={row.id} hover>
								<CustomTableCell
									component="th"
									scope="row"
									onClick={() => this.selectTemplate(row.id)}
								>
									{row.name}
								</CustomTableCell>
								<CustomTableCell
									align="center"
									onClick={() => this.selectTemplate(row.id)}
								>
									{removeMd(row.description)}
								</CustomTableCell>
								<CustomTableCell align="center">
									<IconButton
										className={classes.button}
										aria-label="Delete"
										color="primary"
										onClick={() => this.deleteTemplate(row.id)}
									>
										<DeleteIcon />
									</IconButton>
								</CustomTableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<TablePagination
					style={{ overflow: 'auto' }}
					rowsPerPageOptions={[5, 10, 20]}
					component="div"
					count={templates.totalElements}
					rowsPerPage={this.state.rowsPerPage}
					page={this.state.currentPage}
					backIconButtonProps={{ 'aria-label': 'Previous Page' }}
					nextIconButtonProps={{ 'aria-label': 'Next Page' }}
					onChangePage={this.handleChangePage}
					onChangeRowsPerPage={this.handleChangeRowsPerPage}
				/>

				<Dialog
					open={this.state.openCategoryForm}
					onClose={() => this.setState({ openCategoryForm: false })}
					aria-labelledby="create-template"
				>
					<DialogTitle id="create-template">Create template</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Please input the correct template information
            			</DialogContentText>
						<TextField
							autoFocus
							margin="normal"
							label="name"
							type="email"
							fullWidth
							value={this.state.name}
							onChange={val => this.setState({ name: val.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<SimpleMDE
							value={this.state.description}
							onChange={val => this.setState({ description: val })}
							options={{
								placeholder: 'Description here',
							}}
						/>
					</DialogContent>
					<DialogActions>
						<Button
							disabled={this.state.isBusy}
							onClick={() => this.setState({ openCategoryForm: false })}
							className={classes.marginRight}
						>
							Cancel
            			</Button>
						<Button
							disabled={this.state.isBusy}
							onClick={this.createTemplate}
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
			</Paper>
		);
	}
}

const mapStateToProps = state => ({
	templates: state.tem_data.templates,
	userProfile: state.global_data.userProfile,
});

const mapDispatchToProps = {
	getTemplatesO,
	selectTemplate,
	deleteTemplate,
	createTemplate,
};

export default compose(
	withRouter,
	withStyles(styles),
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(AllTemplateView)
