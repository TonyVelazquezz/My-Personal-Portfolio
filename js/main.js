///////*-----------------------Menu de navegación-----------------------*///////
(() => {
	const hamburgerBtn = document.querySelector('.hamburger-btn');
	const navMenu = document.querySelector('.nav-menu');
	const closeNavBtn = navMenu.querySelector('.close-nav-menu');

	//abre el menu de navegación
	hamburgerBtn.addEventListener('click', openNavMenu);

	//cierra el menu de navegación
	closeNavBtn.addEventListener('click', closeNavMenu);

	function openNavMenu() {
		navMenu.classList.add('open');
		navMenu.style.top = '0';
		bodyScrollingToggle();
	}

	function closeNavMenu() {
		navMenu.classList.remove('open');
		navMenu.style.top = '-100vh';
		bodyScrollingToggle();
	}

	function fadeOutEffect() {
		document.querySelector('.fade-out-effect').classList.add('active');
		setTimeout(() => {
			document.querySelector('.fade-out-effect').classList.remove('active');
		}, 300);
	}

	//Controlador de eventos
	document.addEventListener('click', (event) => {
		//
		if (event.target.classList.contains('link-item')) {
			/*comprobar que event.target.hash tenga el valor
			antes de anular el comportamiento predeterminado*/
			if (event.target.hash !== '') {
				//previene el comportamiento por defecto cuando no encuentra la URL
				// event.preventDefault();
				const hash = event.target.hash;
				//desactiva la sección activa
				document.querySelector('.section.active').classList.add('hide');
				document.querySelector('.section.active').classList.remove('active');
				// activa la nueva sección
				document.querySelector(hash).classList.add('active');
				document.querySelector(hash).classList.remove('hide');
				//desactiva el botón del enlace del menu
				navMenu
					.querySelector('.active')
					.classList.add('outer-shadow', 'hover-in-shadow');
				navMenu
					.querySelector('.active')
					.classList.remove('active', 'inner-shadow');
				//Si se hace click, el enlace se incluye en el menu de navegación
				if (navMenu.classList.contains('open')) {
					//activa el nuevo enlace del menu de navegación
					event.target.classList.add('active', 'inner-shadow');
					event.target.classList.remove('outer-shadow', 'hover-in-shadow');
					//oculta el menu de navegación
					closeNavMenu();
				} else {
					let navItems = navMenu.querySelectorAll('.link-item');
					//Si se cliquea en el mismo enlace, conserva los estilos
					//y la mantiene activa
					navItems.forEach((item) => {
						if (hash === item.hash) {
							item.classList.add('active', 'inner-shadow');
							item.classList.remove('outer-shadow', 'hover-in-shadow');
						}
					});
					fadeOutEffect();
				}
				//agrega hash(#) a la URL
				window.location.hash;
			}
		}
	});
})();

/*--Ocultar Scroll--*/
function bodyScrollingToggle() {
	document.body.classList.toggle('stop-scrolling');
}

///////*---------------Pestañas de la sección nosotros------------------*///////
(() => {
	const aboutSection = document.querySelector('.about-section');
	const tabsContainer = document.querySelector('.about-tabs');

	tabsContainer.addEventListener('click', (event) => {
		//Si el evento enfocado contiene 'tab-item' y no contiene la clase 'active'
		if (
			event.target.classList.contains('tab-item') &&
			!event.target.classList.contains('active')
		) {
			const target = event.target.getAttribute('data-target');
			//desactiva la pestaña activa
			tabsContainer
				.querySelector('.active')
				.classList.remove('outer-shadow', 'active');
			//activa nueva pestaña
			event.target.classList.add('active', 'outer-shadow');
			//deshabilita el contenido de la pestaña
			aboutSection
				.querySelector('.tab-content.active')
				.classList.remove('active');
			//habilita el contenido de la pestaña
			aboutSection.querySelector(target).classList.add('active');
		}
	});
})();

///////*----------------Filtrado del portafolio y popup---------------------*///////
(() => {
	const filterContainer = document.querySelector('.portfolio-filter');
	const portfolioItemsContainer = document.querySelector('.portfolio-items');
	const portfolioItems = document.querySelectorAll('.portfolio-item');
	const popup = document.querySelector('.portfolio-popup');
	const previousBtn = popup.querySelector('.popup-previous');
	const nextBtn = popup.querySelector('.popup-next');
	const closeBtn = popup.querySelector('.popup-close');
	const projectDetailsBtn = popup.querySelector('.popup-project-details-btn');
	const projectDetailsContainer = popup.querySelector('.popup-details');
	let itemIndex, slideIndex, screenshots;

	/* -----filter portfolio items---- */
	filterContainer.addEventListener('click', (event) => {
		if (
			// Si el elemento cliqueado contiene la clase "filter-item"
			//y si no contiene la clase "active"
			event.target.classList.contains('filter-item') &&
			!event.target.classList.contains('active')
		) {
			//remueve la la sombra interna y la clase "active"
			filterContainer
				.querySelector('.active')
				.classList.remove('outer-shadow', 'active');
			//Agrega los estilos al objeto cliqueado
			event.target.classList.add('active', 'outer-shadow');
			//mostrar o ocultar elementos filtrados
			const target = event.target.getAttribute('data-target');
			portfolioItems.forEach((item) => {
				if (target === item.getAttribute('data-category') || target === 'all') {
					item.classList.remove('hide');
					item.classList.add('show');
				} else {
					item.classList.remove('show');
					item.classList.add('hide');
				}
			});
		}
	});

	portfolioItemsContainer.addEventListener('click', (event) => {
		//Encuentra la coincidencia con el elemento
		if (event.target.closest('.portfolio-item-inner')) {
			//Padre del elemento encontrado
			const portfolioItem = event.target.closest(
				'.portfolio-item-inner'
			).parentElement;
			//Obtiene el índice de los hijos, es decir los elementos filtrados.
			itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(
				portfolioItem
			);
			//obtener las imágenes del elemento ubicado en dicho índice.
			screenshots = portfolioItems[itemIndex]
				.querySelector('.portfolio-item-img img')
				//Obtener el atributo 'data-screenshots'
				.getAttribute('data-screenshots');
			//Convertir screenshots en un array
			screenshots = screenshots.split(',');
			// quitar los botones de avanzar y retroceder
			//si el numero total de imágenes es = '1'
			if (screenshots.length === 1) {
				previousBtn.style.display = 'none';
				nextBtn.style.display = 'none';
			} else {
				previousBtn.style.display = 'block';
				nextBtn.style.display = 'block';
			}
			slideIndex = 0;
			popupToggle();
			popupSlideShow();
			popupDetails();
		}
	});

	/*--Agregar la clase '.open'*/
	function popupToggle() {
		popup.classList.toggle('open');
		bodyScrollingToggle();
	}
	/*--cerrar el popup de la galería al cliquear el botón de cerrar */
	closeBtn.addEventListener('click', () => {
		popupToggle();
	});

	/*--Mostrar el popup de imágenes*/
	function popupSlideShow() {
		//Elemento ubicado en el índice '0'
		const imgSrc = screenshots[slideIndex];
		const popupImg = popup.querySelector('.popup-img');
		// Activar el loader hasta que se cargue el popup de la imagen
		popup.querySelector('.popup-loader').classList.add('active');
		popupImg.src = imgSrc;
		popupImg.onload = () => {
			// Desactivar el loader antes que la imagen del popup cargue
			popup.querySelector('.popup-loader').classList.remove('active');
		};
		//Insertar contador de imágenes de la galería
		popup.querySelector('.popup-counter').innerHTML = `${slideIndex + 1} 
		of ${screenshots.length}`;
	}

	/*--Botones de imagen siguiente y imagen anterior*/
	nextBtn.addEventListener('click', () => {
		//Si el índice es igual al numero total de imágenes, dejar índice en '0'
		//De lo contrario, sumar '+1' y mostrar la imágen
		if (slideIndex === screenshots.length - 1) {
			slideIndex = 0;
		} else {
			slideIndex++;
		}
		popupSlideShow();
	});

	previousBtn.addEventListener('click', () => {
		//Si el índice es distinto al numero total de imágenes, dejar índice en '0'
		//De lo contrario, restar '-1' y mostrar la imágen
		if (slideIndex !== screenshots.length - 1) {
			slideIndex = 0;
		} else {
			slideIndex--;
		}
		popupSlideShow();
	});

	/*--Reemplazar los detalles del HTML del popup por los detalles de cada
	elemento del portafolio */
	function popupDetails() {
		const details = portfolioItems[itemIndex].querySelector(
			'.portfolio-item-details'
		).innerHTML;
		popup.querySelector('.popup-project-details').innerHTML = details;

		const title = portfolioItems[itemIndex].querySelector(
			'.portfolio-item-title'
		).innerHTML;
		popup.querySelector('.popup-title h2').innerHTML = title;
	}

	projectDetailsBtn.addEventListener('click', () => {
		popupDetailsToggle();
	});

	function popupDetailsToggle() {
		if (projectDetailsContainer.classList.contains('active')) {
			//agregar el icono '+' si contiene la clase active
			projectDetailsBtn.querySelector('i').classList.add('fa-plus');
			projectDetailsBtn.querySelector('i').classList.remove('fa-minus');
			//remover la clase 'active' y estilos para ocultar el contenido
			projectDetailsContainer.classList.remove('active');
			projectDetailsContainer.style.maxHeight = 0 + 'rem';
		} else {
			//agregar el icono '-' si contiene la clase active
			projectDetailsBtn.querySelector('i').classList.remove('fa-plus');
			projectDetailsBtn.querySelector('i').classList.add('fa-minus');
			//agregar la clase 'active' y estilos para mostrar el contenido
			projectDetailsContainer.classList.add('active');
			projectDetailsContainer.style.maxHeight =
				projectDetailsContainer.scrollHeight + 'rem';
			popup.scrollTo(0, projectDetailsContainer.offsetTop);
		}
	}
})();

///////*----------------Oculta todas las secciones menos la activa-----------------*///////
(() => {
	const sections = document.querySelectorAll('.section');
	sections.forEach((section) => {
		//Si no contiene la clase '.active'
		if (!section.classList.contains('active')) {
			//agregar la clase '.hide'
			section.classList.add('hide');
		}
	});
})();
