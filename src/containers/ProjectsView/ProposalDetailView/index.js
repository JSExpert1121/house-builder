import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

const styles = (theme) => ({

});

class ConnectedProposalDetailView extends Component {
	render() {
		const { match } = this.props;
		const mode = match.params.mode;

		return (
			<div>
				<TextField value={"123"} disabled={mode === 'v'} />
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
	};
}

const mapStateToProps = state => {
	return {
		proposal: state.gen_data.selectedProposal
	};
};

const ProposalDetailView = connect(mapStateToProps, mapDispatchToProps)(ConnectedProposalDetailView);

ProposalDetailView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ProposalDetailView));