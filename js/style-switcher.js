///////*--------------Switcher o interruptor de estilos-----------------*///////

const styleSwitcherToggler = document.querySelector('.style-switcher-toggler');

styleSwitcherToggler.addEventListener('click', () => {
	document.querySelector('.style-switcher').classList.toggle('open');
});
//Oculta el switch al hacer scroll
window.addEventListener('scroll', () => {
	if (document.querySelector('.style-switcher').classList.contains('open')) {
		document.querySelector('.style-switcher').classList.remove('open');
	}
});

///////*-----------------------Temas de color---------------------------*///////
const alternateStyles = document.querySelectorAll('.alternate-style');

function setActiveStyle(color) {
	localStorage.setItem('color', color);
	changeColor();
}

/*Cambiar color*/
function changeColor() {
	alternateStyles.forEach((style) => {
		if (localStorage.getItem('color') === style.getAttribute('title')) {
			style.removeAttribute('disabled');
		} else {
			style.setAttribute('disabled', 'true');
		}
	});
}

//comprueba si hay un color guardado
if (localStorage.getItem('color') !== null) {
	changeColor();
}

// ///////*---------------modo noche y modo dia-------------------------*///////
const dayNightMode = document.querySelector('.day-night');

dayNightMode.addEventListener('click', () => {
	document.body.classList.toggle('dark');
	if (document.body.classList.contains('dark')) {
		localStorage.setItem('theme', 'dark');
	} else {
		localStorage.setItem('theme', 'light');
	}
	updateIcon();
});

function themeMode() {
	//comprueba si hay un modo guardado
	if (localStorage.getItem('theme') !== null) {
		if (localStorage.getItem('theme') === 'light') {
			document.body.classList.remove('dark');
		} else {
			document.body.classList.add('dark');
		}
	}
	updateIcon();
}
themeMode();

/*Actualizar el icono*/
function updateIcon() {
	if (document.body.classList.contains('dark')) {
		dayNightMode.querySelector('i').classList.remove('fa-moon');
		dayNightMode.querySelector('i').classList.add('fa-sun');
	} else {
		dayNightMode.querySelector('i').classList.remove('fa-sun');
		dayNightMode.querySelector('i').classList.add('fa-moon');
	}
}
