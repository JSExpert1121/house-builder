import { createMuiTheme } from '@material-ui/core/es/styles'

const theme = createMuiTheme({
	palette: {
		primary: {
			// light: will be calculated from palette.primary.main,
			main: '#4a148c',
			dark: '#12005e',
			// contrastText: will be calculated to contrast with palette.primary.main
		},
		secondary: {
			light: '#c7a4ff',
			main: '#9575cd',
			// dark: will be calculated from palette.secondary.main,
			contrastText: '#000000',
		},
		// error: will use the default color
	},

	typography: {
		// Use any custom font instead of the default Roboto font.
		useNextVariants: true,
		fontFamily: [
			'Niramit',
			'Arial',
		].join(','),
	},
	customHeight: {
		level1: 'calc(100vh - 64px - 64px)',	// margin: 8px
		level2: 'calc(100vh - 64px - 100px',
	}

});


export default theme;