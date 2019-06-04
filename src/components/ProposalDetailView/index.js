import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import NoSsr from '@material-ui/core/NoSsr';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';

import { withStyles } from '@material-ui/core/styles';

import ProposalDetailFiles from './ProposalDetailFiles';
import ProposalDetailOverview from './ProposalDetailOverview';
import ProposalDetailMessages from './ProposalDetailMessages';
import ProposalEditView from './ProposalEditView';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';

import { getProposalData, getProposalDetails, submitProposal, addOption } from "../../actions/index";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const styles = theme => ({
	root: {
		height: 'calc(100vh - 144px)',
		padding: theme.spacing(1),
		overflowY: 'auto',
		position: 'relative'
	},
	toolbarstyle: {
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.primary.dark,
		flexGrow: 1
	},
	backBtn: {
		color: theme.palette.primary.dark
	},
	busy: {
		position: "absolute",
		left: "calc(50% - 10px)",
		top: "calc(50%-10px)"
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(40vh)",
	}
});

class ConnectedProposalDetailView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentTab: 0,
			brief: {},
			proposal: null,
			templateNo: 0,
			showAlert: false,
			message: 'Invalid proposal information',
			busy: false
		}
	}

	async componentDidMount() {
		const { match } = this.props;
		let proposal = [];
		let brief = {
			budget: 0, duration: 0, description: ''
		};
		let propId = match.params.id;

		if (propId !== '-1') {
			if (propId && propId.length > 0) {
				try {
					const data = await this.props.getProposalDetails(propId);
					// console.log('ProposalDetailView.cdm', data);
					proposal = this.createDetails(data);
					brief.budget = data.proposal.budget;
					brief.duration = data.proposal.duration;
					brief.description = data.proposal.description;
				} catch (error) {
					console.log(error);
					proposal = this.createEmptyDetails();
				}
			}
		} else {
			proposal = this.createEmptyDetails();
		}

		this.setState({ proposal, brief });
	}

	createDetails = (data) => {
		const { project, proposal, match } = this.props;
		let curProject = project;
		if (match.params.id !== -1 && !!proposal) {
			curProject = proposal.proposal.project;
		}

		const details = [];
		curProject.projectTemplates.forEach((templ, index) => {
			const cats = templ.template.categoryList;
			details[index] = {};
			details[index].id = templ.template.id;
			details[index].name = templ.template.name;
			cats.forEach(cat => {
				details[index][cat.id] = {};
				details[index][cat.id].id = cat.id;
				details[index][cat.id].type = cat.type;
				details[index][cat.id].name = cat.name;
				details[index][cat.id].value = cat.value;
				details[index][cat.id].description = cat.description;
				details[index][cat.id].options = [];
			})
		})

		data.temCatOptionDetail &&
			data.temCatOptionDetail.forEach(template => {
				for (let tid in template) {
					for (let det of details) {
						if (det.id !== tid) continue;

						const cats = template[tid];
						cats.forEach(cat => {
							for (let cid in cat) {
								det[cid].options = cat[cid] || [];
							}
						})

						break;
					}
				}
			});

		return details;
	}

	createEmptyDetails = () => {
		const details = [];
		const { project } = this.props;

		project && project.projectTemplates.forEach((templ, index) => {
			details[index] = {};
			details[index].id = templ.template.id;
			details[index].name = templ.template.name;
			const cats = templ.template.categoryList;
			cats && cats.forEach(cat => {
				details[index][cat.id] = {
					id: cat.id,
					name: cat.name,
					type: cat.type,
					value: cat.value,
					description: cat.description,
					options: []
				};
			});
		});

		return details;
	}

	handleTabChange = (event, value) => {
		this.setState({
			currentTab: value
		});
	}

	handleBack = () => {
		const { match, proposal, project } = this.props;
		if (match.url.includes("g_cont"))
			this.props.history.push("/g_cont/project_detail/" + proposal.proposal.project.id + "/proposals");
		else if (match.url.includes("s_cont"))
			this.props.history.push('/s_cont/pipeline/' + proposal.status.toLowerCase());
		else if (match.url.includes("a_pros")) {
			if (match.params.id !== -1) {
				this.props.history.push("/a_pros/project_detail/" + proposal.proposal.project.id + "/proposals");
			} else {
				this.props.history.push("/a_pros/project_detail/" + project.id + "/proposals");
			}
		}
	}

	handleOverviewChange = (brief) => {
		this.setState({ brief });
	}

	handleTemplateChange = (index) => {
		console.log('ProposalDetailView.handleTemplateChange', index);
		this.setState({ templateNo: index, currentTab: 1 });
	}

	AddOption = (catId, option) => {
		const categories = this.state.proposal[this.state.templateNo];
		categories[catId] && categories[catId].options.push(option);
	}

	UpdateOption = (catId, option) => {
		const categories = this.state.proposal[this.state.templateNo];
		const cat = categories[catId];
		if (!cat) return;

		let len = cat.options.length;
		for (let i = 0; i < len; i++) {
			if (cat.options[i].id === option.id) {
				cat.options[i] = option;
				break;
			}
		}
	}

	DeleteOption = (catId, optId) => {
		const categories = this.state.proposal[this.state.templateNo];
		const cat = categories[catId];
		if (!cat) return;

		let len = cat.options.length;
		for (let i = 0; i < len; i++) {
			if (cat.options[i].id === optId) {
				cat.options.splice(i, 1);
				cat.options = [...cat.options];
				break;
			}
		}
	}

	checkProposal = (brief) => {
		if (!brief.budget || !brief.duration || !brief.description) return false;
		if (brief.description.length == 0) return false;

		return true;
	}

	handleSubmit = async (brief) => {
		console.log(brief);
		if (!this.checkProposal(brief)) {
			this.setState({ showAlert: true, busy: false, message: 'Invalid proposal information' });
			return;
		}

		this.setState({ busy: true });
		const { proposal } = this.state;
		const { project } = this.props;
		try {
			let data = await this.props.submitProposal(project.genContractor.id, project.id, brief);
			const propid = data.id;
			// const propid = '6b1f5540-6f74-4341-b4bd-907e4d38024a';
			// console.log(propid, proposal);
			let tasks = [];
			console.log(proposal);

			for (let templ of proposal) {
				for (let key in templ) {
					if (key !== 'id' && key !== 'name') {
						const options = templ[key].options;
						for (let opt of options) {
							console.log('option: ', propid, templ[key].id, opt);
							tasks.push(this.props.addOption(propid, templ[key].id, {
								name: opt.name,
								value: opt.value,
								budget: opt.budget,
								duration: opt.duration,
								description: opt.description
							}));
						}
					}
				}
			}

			for (let task of tasks) {
				await task;
			}
			this.setState({ busy: false });
			this.handleBack();
		} catch (error) {
			this.setState({ showAlert: true, message: 'Some error occured' });
			console.log(error);
		}

		this.setState({ busy: false });
	}

	closeAlert = () => {
		this.setState({ showAlert: false });
	}

	render() {
		const { classes, match, project } = this.props;
		const { proposal, templateNo, currentTab, brief } = this.state;

		if (proposal === null && match.params.id !== '-1')
			return (
				<CircularProgress className={classes.waitingSpin} />
			);

		// console.log('ProposalDetailView.Render: brief', brief);
		return (

			<NoSsr>
				<Box className={classes.root}>
					<Paper square style={{ height: "100%", overflow: "auto" }}>
						<Box style={{ display: 'flex' }}>
							<IconButton className={classes.backBtn} onClick={this.handleBack}>
								<ArrowBackIcon />
							</IconButton>
							<Tabs
								value={currentTab}
								onChange={this.handleTabChange}
								variant="scrollable"
								indicatorColor="primary"
								textColor="primary"
								scrollButtons="off"
								className={classes.toolbarstyle}
							>
								<Tab label="Detail" />
								<Tab label="Templates" />
								<Tab label="Files" />
								{
									// match.params.id !== '-1' && <Tab label="Files" />
								}
								{
									match.params.id !== '-1' &&
									(
										match.url.includes('/g_cont') ||
										(match.url.includes('/s_cont') && (proposal.status === 'SUBMITTED' || proposal.status === 'AWARDED'))
									) &&
									<Tab label="Messages" />
								}
							</Tabs>
						</Box>

						{currentTab === 0 &&
							<ProposalDetailOverview
								templateSelected={this.handleTemplateChange}
								project={project}
								brief={brief}
								handleSubmit={this.handleSubmit}
								handleOverviewChange={this.handleOverviewChange}
							/>
						}
						{currentTab === 1 &&
							<ProposalEditView
								proposal={proposal[templateNo]}
								edit={match.params.id === '-1'}
								handleAdd={this.AddOption}
								handleUpdate={this.UpdateOption}
								handleDelete={this.DeleteOption}
							/>
						}
						{currentTab === 2 && <ProposalDetailFiles />}
						{currentTab === 3 && <ProposalDetailMessages />}
					</Paper>
					<ConfirmDialog open={this.state.showAlert} message={this.state.message} onYes={this.closeAlert} />
					{this.state.busy && <CircularProgress className={classes.waitingSpin} />}
				</Box>
			</NoSsr>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getProposalData: (id) => dispatch(getProposalData(id)),
		getProposalDetails: id => dispatch(getProposalDetails(id)),
		addOption: (propid, catid, option) => dispatch(addOption(propid, catid, option)),
		submitProposal: (cont_id, pro_id, proposal) => dispatch(submitProposal(cont_id, pro_id, proposal))
	}
}

const mapStateToProps = state => {
	return {
		proposal: state.global_data.proposalDetail,
		project: state.global_data.project
	};
};

const ProposalDetailView = connect(mapStateToProps, mapDispatchToProps)(ConnectedProposalDetailView);

ProposalDetailView.propTypes = {
	classes: PropTypes.object.isRequired,
	project: PropTypes.object
};

export default withRouter(withStyles(styles)(ProposalDetailView));