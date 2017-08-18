const colors = [
	'rgb(122, 163, 229)',
	'rgb(158, 213, 107)',
	'rgb(103, 215, 196)',
	'rgb(235, 217, 95)',
	'rgb(239, 166, 112)',
	'rgb(230, 135, 130)',
	'rgb(152, 142, 227)',
	'rgb(224, 150, 233)'
];

export function chooseColorForComponents(component, pointer) {
	// Console.log('chooseColorForComponents', colors, component);
	component.__color__ = colors[pointer];
	pointer = (pointer + 1) % colors.length;
	if (Array.isArray(component.children)) {
		component.children.forEach(child => {
			pointer = chooseColorForComponents(child, pointer);
		});
	}
	return pointer;
}
