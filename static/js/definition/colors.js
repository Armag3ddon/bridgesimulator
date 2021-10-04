import Colors from '../basic/colors.js';

export default {
	defaultSceneBackground: getComputedStyle(document.body).getPropertyValue('--background'),
	defaultTextColor: getComputedStyle(document.body).getPropertyValue('--text'),
    textbox: new Colors(
		getComputedStyle(document.body).getPropertyValue('--darkest'),
		getComputedStyle(document.body).getPropertyValue('--dark')
	),
	button: new Colors(
		getComputedStyle(document.body).getPropertyValue('--dark'),
		getComputedStyle(document.body).getPropertyValue('--medium'),
		getComputedStyle(document.body).getPropertyValue('--bright'),
		getComputedStyle(document.body).getPropertyValue('--medium'))
};