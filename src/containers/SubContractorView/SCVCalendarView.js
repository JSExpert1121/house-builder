import React from 'react';
import Calendar from '../../components/Calendar';

class SCVCalendarView extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<main>
				<Calendar />
			</main>
		);
	}
}

export default SCVCalendarView;