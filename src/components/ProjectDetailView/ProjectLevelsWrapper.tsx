import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import ProjectLevels from './ProjectLevels';
import { ProjectLevel, ProjectLevelCategory } from 'types/project';

interface IProjectLevelsWrapperProps extends RouteComponentProps {
}

const ProjectLevelsWrapper: React.SFC<IProjectLevelsWrapperProps> = (props) => {

	const init: ProjectLevel[] = [
		{
			id: 0,
			name: 'Level 1',
			description: 'Largest and expensive rooms',
			categories: [
				{
					id: 0,
					title: 'My Room',
					category: 'Bed Room',
					description: 'the room with ambiguent light',
					contents: {
						width: 7.2, height: 3.4, length: 9.6
					}
				},
				{
					id: 1,
					title: 'Your Room',
					category: 'Living Room',
					description: 'the room with sunlight',
					contents: {
						width: 9.2, height: 3.2, length: 10.6
					}
				},
				{
					id: 2,
					title: 'Long Hall',
					category: 'Hallway',
					description: 'the room with ambiguent light',
					contents: {
						width: 2.2, height: 3.4, length: 8.8
					}
				},
			]
		},
		{
			id: 1,
			name: 'Level 2',
			description: 'Middle Rooms',
			categories: [
				{
					id: 0,
					title: 'Inexpensive Room',
					category: 'Bath Room',
					description: 'Hot / Cool water',
					contents: {
						width: 8.4, height: 3.2, length: 6.3
					}
				},
				{
					id: 1,
					title: 'Expensive Room',
					category: 'Living Room',
					description: 'Inexpensive Room',
					contents: {
						width: 10.2, height: 3.8, length: 6.6
					}
				},
			]
		}
	];
	const [levels, setLevels] = React.useState<ProjectLevel[]>(init);

	const addLevel = (name, desc) => {
		levels.push({
			id: levels.length,
			name: name,
			description: desc,
			categories: []
		});

		setLevels([...levels]);
	}

	const deleteLevel = (id: number) => {
		levels.splice(id, 1);
		const len = levels.length;
		for (let i = id; i < len; i++) {
			levels[i].id--;
		}

		setLevels([...levels]);
	}

	const addCategory = (id: number, cat: ProjectLevelCategory) => {
		const level = levels[id];
		if (!level) return;

		cat.id = level.categories.length;
		level.categories.push(cat);
		setLevels([...levels]);
	}

	const updateCategory = (lvlId: number, cat: ProjectLevelCategory) => {
		const level = levels[lvlId];
		if (!level) return;

		level.categories[cat.id] = cat;
		setLevels([...levels]);
	}

	const deleteCategory = (lvlId: number, catId: number) => {
		const level = levels[lvlId];
		if (!level) return;

		const cats = level.categories;
		cats.splice(catId, 1);
		const len = cats.length;
		for (let i = catId; i < len; i++) {
			cats[i].id--;
		}
		setLevels([...levels]);
	}

	return (
		<ProjectLevels
			levels={levels}
			addLevel={addLevel}
			deleteLevel={deleteLevel}
			addCategory={addCategory}
			updateCategory={updateCategory}
			deleteCategory={deleteCategory}
			{...props}
		/>
	);
};

export default ProjectLevelsWrapper;
