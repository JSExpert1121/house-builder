import React from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { approveContractor, rejectContractor } from '../../../actions/cont-actions';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px",
		height: "calc(100vh - 64px - 72px - 48px - 20px)",
	},
	textField: {
		boxShadow: "0 0 5px #999999",
    },
});

class ConnectedContractorInfoView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	render() {
		const { classes, selectedContractor } = this.props;
		return (
			<div className={classes.root}>
				<ul>
					<li>Email: {selectedContractor? selectedContractor.email: "N/A"}</li>
					<li>Name: {selectedContractor.address ? selectedContractor.address.name: "N/A"} </li>
					<li>City: {selectedContractor.address? selectedContractor.address.city: "N/A"} </li>
					<li>Street: {selectedContractor.address? selectedContractor.address.street: "N/A"} </li>
					<li>Status: {selectedContractor.Status? selectedContractor.status: "N/A"}</li>
					<li>
						<TextField
						placeholder=""
						multiline={true}
						rows={4}
						className={classes.textField}
						/> 						
					</li>
					<li>
						<Button onClick = {() => this.props.approveContractor(selectedContractor.id, {"status" : "ACTIVE"})}>Approve</Button>
						<Button onClick = {() => this.props.rejectContractor(selectedContractor.id, {"status" : "REJECTED"})}>Reject</Button>
					</li>
				</ul>				
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedContractor: state.cont_data.selectedContractor
	};
};

const mapDispatchToProps = dispatch => {
	return {
		approveContractor: (id, data) => dispatch(approveContractor(id, data)),
		rejectContractor: (id, data) => dispatch(rejectContractor(id, data)),		
	}
}
const ContractorInfoView = connect(mapStateToProps, mapDispatchToProps)(ConnectedContractorInfoView);

ContractorInfoView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContractorInfoView);