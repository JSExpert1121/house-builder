import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';

import Button from "components/CustomButtons/Button.jsx";
import ProjectEditView from 'components/ProjectDetailView/ProjectEditView';


const useStyles = makeStyles(theme => ({
	root: {
		position: 'relative'
	},
	mainBoard: {
		width: '100%',
		height: '100%',
		borderBottom: '5px solid ' + theme.palette.primary.light,
		padding: theme.spacing(1),
		display: 'flex',
		flexDirection: 'column',
		overflow: 'auto',
	},
	busy: {
		position: 'absolute',
		left: 'calc(50% - 20px)',
		top: 'calc(50% - 20px)',
	},
	fileUpload: {
		display: 'flex',
		flexWrap: 'wrap',
		padding: theme.spacing(1)
	},
	fileItem: {
		margin: '6px',
		padding: theme.spacing(1),
		border: '1px solid #CCC',
	},
	textFieldHalf: {
		width: 'calc(50% - 8px)',
		paddingRight: theme.spacing(1)
	},
}));

export interface ProjectBriefInfo {
	title: string;
	price: number;
	description: string;
	dueDate: Date;
	files: Array<File>;
}

interface IAddProjectOverviewProps extends RouteComponentProps, ProjectBriefInfo {
	isBusy: boolean;
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleRemove: (file: File) => void;
	handleDateChange: (date: Date) => void;
	handleDescChange: (desc: string) => void;
	handleTitleChange: (title: string) => void;
	handlePriceChange: (price: number) => void;
	handleAdd: (info: ProjectBriefInfo) => Promise<string>;
}

const AddProjectOverview: React.SFC<IAddProjectOverviewProps> = (props) => {

	const {
		handleFileChange,
		handleRemove,
		handleDateChange,
		handleDescChange,
		handleTitleChange,
		handlePriceChange,
		handleAdd,
		title, price, description, dueDate, files, isBusy
	} = props;
	const classes = useStyles({});

	return (
		<Box className={classes.root}>
			<Box className={classes.mainBoard}>
				<ProjectEditView
					title={title}
					price={price}
					dueDate={dueDate}
					description={description}
					handleTitleChange={handleTitleChange}
					handlePriceChange={handlePriceChange}
					handleDateChange={handleDateChange}
					handleDescChange={handleDescChange}
				/>
				<Box className={classes.fileUpload}>
					<input
						accept="text/*,image/*,video/*,audio/*,application/*,font/*,message/*,model/*,multipart/*"
						id="upload-file"
						multiple
						type="file"
						style={{ display: 'none' }}
						onChange={handleFileChange}
					/>
					<label htmlFor="upload-file" style={{ display: 'inline' }}>
						<Button
							variant="contained"
							component="span"
						>
							<CloudUploadIcon />
							&nbsp;&nbsp;Upload
                        </Button>
					</label>
					{files.map(file => (
						<span className={classes.fileItem} key={file.name + file.size}>
							{file.name}
							<IconButton
								onClick={() => handleRemove(file)}
								style={{ padding: '0px' }}
							>
								<DeleteIcon />
							</IconButton>
						</span>
					))}
				</Box>
				<Box style={{ width: '100%', textAlign: 'center' }}>
					<Button
						color="primary"
						disabled={isBusy}
						onClick={handleAdd}
					>
						Add Project
                    </Button>
				</Box>
			</Box>
		</Box>
	);
}

export default AddProjectOverview;