// ====================================================================================
// BLOQUE: DOM READY (DOMContentLoaded)
// ------------------------------------------------------------------------------------
// Escucha el evento 'DOMContentLoaded' que se dispara cuando el HTML terminó de
// cargarse completamente (pero sin esperar imágenes u otros recursos).
// Todo el código JS está dentro de este bloque para asegurarnos de que los elementos
// HTML existen antes de intentar manipularlos.
// ====================================================================================
document.addEventListener('DOMContentLoaded', () => {
    // addEventListener: Método que registra un "escuchador de eventos".
    // 'DOMContentLoaded': Evento que ocurre cuando el documento HTML está listo.
    // () => { ... }: Función flecha (arrow function) de JavaScript que se ejecuta
    // cuando el evento ocurre. Es equivalente a function() { ... } pero más moderna.

    // ==================================================================================
    // BLOQUE: NAVBAR SCROLL EFFECT (Efecto de Scroll en la Barra de Navegación)
    // ----------------------------------------------------------------------------------
    // Cuando el usuario scrollea más de 50px, se agrega la clase "scrolled" a la navbar.
    // Esto activa estilos CSS que hacen la navbar: con fondo blanco semitransparente,
    // efecto blur (desenfoque), sombra y menos padding.
    // Cuando el scroll vuelve arriba de 50px, se remueve la clase y vuelve a ser
    // transparente como al inicio.
    // ==================================================================================

    // document.querySelector('.navbar'): Selecciona el PRIMER elemento HTML que tenga
    // la clase CSS "navbar". Devuelve el elemento del DOM (o null si no existe).
    const navbar = document.querySelector('.navbar');
    // const: Declara una constante (no se puede reasignar).
    // navbar: Variable que guarda la referencia al elemento <nav class="navbar">.

    // window.addEventListener: Escucha el evento 'scroll' en toda la ventana del navegador.
    window.addEventListener('scroll', () => {
        // window.scrollY: Propiedad que indica cuántos píxeles se ha scrolleado
        // verticalmente desde el tope de la página. Empieza en 0.
        if (window.scrollY > 50) {
            // Si el usuario scrolleó más de 50 píxeles...
            navbar.classList.add('scrolled');
            // classList.add('scrolled'): Agrega la clase CSS "scrolled" al elemento navbar.
            // Esto activa los estilos CSS de .navbar.scrolled (fondo blanco, blur, sombra).
        } else {
            navbar.classList.remove('scrolled');
            // classList.remove('scrolled'): Remueve la clase "scrolled" del elemento.
            // La navbar vuelve a su estado inicial (transparente).
        }
    }); // Fin del event listener de scroll

    // ==================================================================================
    // BLOQUE: MOBILE MENU (Menú Hamburguesa para Móviles)
    // ----------------------------------------------------------------------------------
    // En pantallas pequeñas (<=768px), la navbar se oculta y aparece un botón
    // hamburguesa (tres rayitas). Al hacer clic, el menú se desliza desde la derecha
    // y aparece un overlay (fondo oscuro semitransparente).
    // - Se crea el overlay dinámicamente con createElement()
    // - toggleMenu(): Función que alterna las clases 'active' y bloquea el scroll del body
    // - Al hacer clic en un enlace, se cierra el menú automáticamente
    // - El overlay también cierra el menú al hacer clic fuera
    // ==================================================================================

    // Selecciona el botón hamburguesa (el <button class="menu-toggle"> del HTML).
    const menuToggle = document.querySelector('.menu-toggle');
    // Selecciona la lista de enlaces de navegación (el <ul class="nav-links">).
    const navLinks = document.querySelector('.nav-links');

    // Crear overlay para el menú móvil (fondo oscuro detrás del menú)
    // document.createElement('div'): Crea un nuevo elemento <div> en memoria (no en la página aún).
    const overlay = document.createElement('div');
    // .className: Asigna la clase CSS 'nav-overlay' al nuevo div.
    overlay.className = 'nav-overlay';
    // document.body.appendChild(overlay): Agrega el overlay al final del <body> en el DOM.
    // Ahora el overlay existe y se ve en la página (aunque transparente por defecto).
    document.body.appendChild(overlay);

    // Función que alterna (toggle) la apertura/cierre del menú móvil
    function toggleMenu() {
        // menuToggle.classList.toggle('active'):
        // Alterna la clase 'active': si no la tiene, la agrega; si la tiene, la remueve.
        // Cuando 'active' está presente, las tres rayitas se transforman en una X (en CSS).
        menuToggle.classList.toggle('active');

        // Alterna la clase 'active' en el menú de navegación.
        // En CSS, .nav-links.active hace que right: -100% cambie a right: 0,
        // deslizando el menó desde la derecha.
        navLinks.classList.toggle('active');

        // Alterna la clase 'active' en el overlay.
        // En CSS, .nav-overlay.active cambia opacity de 0 a 1 y activa pointer-events.
        overlay.classList.toggle('active');

        // document.body.style.overflow:
        // Si el menú está activo, bloquea el scroll del body (overflow: 'hidden')
        // para que no se pueda scrollear la página detrás del menú.
        // Si no está activo, restaura el scroll (overflow: '' -> vuelve al CSS por defecto).
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        // Operador ternario: condición ? valor_si_true : valor_si_false
        // .contains('active'): Verifica si la clase existe en el elemento.
    }

    // Al hacer clic en el botón hamburguesa, se ejecuta toggleMenu.
    menuToggle.addEventListener('click', toggleMenu);

    // Al hacer clic en el overlay (fondo oscuro), también se cierra el menú.
    overlay.addEventListener('click', toggleMenu);

    // Cerrar el menú automáticamente cuando se hace clic en cualquier enlace
    // document.querySelectorAll('.nav-links a'): Selecciona TODOS los <a> dentro de .nav-links.
    // Devuelve una NodeList (similar a un array).
    document.querySelectorAll('.nav-links a').forEach(link => {
        // .forEach(): Itera sobre cada enlace (link) de la lista.
        link.addEventListener('click', () => {
            // Si el menú está actualmente abierto (tiene la clase 'active')...
            if (navLinks.classList.contains('active')) {
                toggleMenu(); // ...lo cerramos llamando a toggleMenu().
            }
        });
    });

    // ==================================================================================
    // BLOQUE: SCROLL ANIMATIONS (Animaciones al Hacer Scroll - Intersection Observer)
    // ----------------------------------------------------------------------------------
    // Usa la API IntersectionObserver para detectar cuándo los elementos entran en
    // la ventana visible (viewport). Cuando un elemento es visible, se le agrega
    // la clase 'visible', activando las transiciones CSS de opacidad y transformación.
    // - Los elementos con clase 'fade-in' aparecen desvaneciéndose y subiendo
    // - Los elementos con 'fade-in-left' vienen desde la izquierda
    // - Los elementos con 'fade-in-right' vienen desde la derecha
    // - Tiene un efecto escalonado (stagger): cada elemento hermano se anima
    //   con 100ms de retraso respecto al anterior (máximo 400ms).
    // ==================================================================================

    // Selecciona TODOS los elementos que tengan alguna de estas clases de animación.
    const animateElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

    // Opciones de configuración del IntersectionObserver
    const observerOptions = {
        root: null,
        // root: null significa que el "viewport" de referencia es la ventana del navegador.
        rootMargin: '0px 0px -80px 0px',
        // rootMargin: Margen alrededor del viewport. '0px 0px -80px 0px' significa
        // que el elemento se considera visible cuando está al menos 80px antes de llegar
        // al borde inferior de la pantalla. Así la animación arranca un poco antes.
        threshold: 0.1
        // threshold: 0.1 significa que se dispara cuando al menos el 10% del elemento
        // es visible en el viewport.
    };

    // Crear el IntersectionObserver
    // new IntersectionObserver((entries) => { ... }, observerOptions):
    // El primer parámetro es un callback que recibe un array de "entries" (elementos observados).
    // El segundo parámetro son las opciones definidas arriba.
    const observer = new IntersectionObserver((entries) => {
        // entries: Array de objetos IntersectionObserverEntry, uno por cada elemento observado.
        entries.forEach(entry => {
            // entry.isIntersecting: Booleano que indica si el elemento está intersectando
            // (visible en) el viewport.
            if (entry.isIntersecting) {
                // Add a staggered delay based on index
                // entry.target: El elemento HTML que está siendo observado.
                // .parentElement: El elemento padre en el DOM.
                // ?.: Optional chaining - si parentElement es null, no explota.
                const siblings = entry.target.parentElement?.children;
                // siblings: Los elementos "hermanos" (hijos del mismo padre).
                // Puede ser undefined si no hay parentElement.
                let delay = 0; // Variable para el retraso en milisegundos.

                if (siblings) {
                    // Si hay hermanos, calculamos la posición (índice) de este elemento
                    // entre sus hermanos.
                    // Array.from(siblings): Convierte la HTMLCollection a un array.
                    // .indexOf(entry.target): Encuentra en qué posición está este elemento.
                    const index = Array.from(siblings).indexOf(entry.target);
                    // delay = índice * 100ms, pero máximo 400ms.
                    // Así, si hay 3 tarjetas en fila, la 1ra aparece sin delay,
                    // la 2da con 100ms, la 3ra con 200ms, etc.
                    delay = Math.min(index * 100, 400);
                }

                // setTimeout: Ejecuta una función después de un retraso (delay en ms).
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    // Agrega la clase 'visible' al elemento, activando la transición CSS
                    // que cambia opacity de 0 a 1 y transform de translate a 0.
                }, delay);

                // observer.unobserve(entry.target): Deja de observar este elemento.
                // La animación solo se ejecuta UNA vez. Si el usuario vuelve a scrollear
                // hacia arriba, no se repite.
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions); // Fin del callback, pasamos las opciones como segundo argumento.

    // Comenzar a observar CADA elemento de la lista animateElements
    animateElements.forEach(el => observer.observe(el));
    // observer.observe(el): Registra el elemento para ser observado.
    // Cuando entre en el viewport, el callback de arriba se ejecutará.

    // ==================================================================================
    // BLOQUE: WHATSAPP CLICK TRACKING (Seguimiento de Clics en WhatsApp)
    // ----------------------------------------------------------------------------------
    // Selecciona todos los botones/enlaces de WhatsApp y agrega un listener de clic.
    // Actualmente solo registra en consola (placeholder), pero podría integrarse
    // con Google Analytics o similar para trackear cuántos clics recibe cada botón.
    // ==================================================================================

    // Selecciona elementos con cualquiera de las tres clases de WhatsApp.
    document.querySelectorAll('.btn-whatsapp, .nav-whatsapp, .whatsapp-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // e: El objeto Event, contiene información sobre el clic.
            // Just a placeholder action - the href handles the actual navigation
            // El atributo href del <a> ya maneja la navegación a WhatsApp.
            // Este listener es un placeholder para futura integración (ej: analytics).
            console.log('WhatsApp button clicked');
            // console.log(): Imprime un mensaje en la consola del navegador (F12).
        });
    });

    // ==================================================================================
    // BLOQUE: CONTACT FORM (Formulario de Contacto)
    // ----------------------------------------------------------------------------------
    // Maneja el envío del formulario de contacto. Actualmente es una SIMULACIÓN:
    // - Previene el envío real del formulario (e.preventDefault())
    // - Captura los datos del formulario con FormData
    // - Muestra estados: "Enviando..." -> "✅ Mensaje enviado"
    // - Restaura el formulario después de 3 segundos
    // - En un entorno real, aquí se haría un fetch() a una API o backend
    // ==================================================================================

    // document.getElementById('contactForm'): Selecciona el elemento por su ID.
    // Es más rápido que querySelector para IDs.
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        // Verificación: si el formulario existe en la página (por si acaso no está),
        // recién entonces agregamos el event listener. Esto evita errores.

        // Escucha el evento 'submit' que ocurre al hacer clic en el botón "Enviar"
        // o al presionar Enter dentro del formulario.
        contactForm.addEventListener('submit', (e) => {
            // e.preventDefault(): Previene el comportamiento POR DEFECTO del formulario,
            // que es recargar la página y enviar los datos al servidor.
            // Como no tenemos backend, queremos evitar esa recarga.
            e.preventDefault();

            // Busca el botón de envío dentro del formulario para poder cambiar su texto.
            const submitBtn = contactForm.querySelector('.btn-submit');
            // Guarda el HTML ORIGINAL del botón (incluyendo el ícono <i>) para restaurarlo después.
            const originalHTML = submitBtn.innerHTML;
            // innerHTML: Contiene el HTML interno del elemento, incluyendo etiquetas.
            // A diferencia de textContent que solo devuelve texto sin etiquetas.

            // Get form data (Obtener datos del formulario)
            // new FormData(contactForm): Crea un objeto FormData a partir del formulario.
            // Automáticamente captura todos los campos que tengan atributo 'name'.
            const formData = new FormData(contactForm);
            const data = {}; // Objeto vacío para almacenar los datos como clave:valor.

            // formData.forEach((value, key) => { ... }): Itera sobre cada campo del formulario.
            // value: El valor ingresado por el usuario.
            // key: El atributo 'name' del campo (ej: "name", "email", "level", etc.).
            formData.forEach((value, key) => {
                data[key] = value; // Asigna cada valor a su clave en el objeto data.
            });

            // Simulate sending (you can replace this with actual form submission)
            // Cambiamos el HTML del botón para mostrar "Enviando..." con un reloj.
            submitBtn.innerHTML = '⏳ Enviando...';
            submitBtn.disabled = true;
            // .disabled = true: Deshabilita el botón para evitar múltiples envíos.

            // setTimeout: Simula una demora de 1.5 segundos (como si enviara a un servidor).
            setTimeout(() => {
                // Show success message (Mostrar mensaje de éxito)
                submitBtn.innerHTML = '✅ Mensaje enviado';
                // Cambiamos el color de fondo a verde (éxito) usando estilo inline.
                submitBtn.style.background = 'linear-gradient(135deg, #16a34a, #22c55e)';

                // Reset form after 3 seconds (Restaurar formulario después de 3 segundos)
                setTimeout(() => {
                    contactForm.reset();
                    // .reset(): Restablece todos los campos del formulario a sus valores iniciales.

                    submitBtn.innerHTML = originalHTML;
                    // Restauramos el HTML original del botón (con el ícono de avión y el texto).

                    submitBtn.style.background = '';
                    // Limpiamos el estilo inline de background, volviendo al CSS original.

                    submitBtn.disabled = false;
                    // Rehabilitamos el botón para que se pueda usar de nuevo.
                }, 3000); // 3000ms = 3 segundos

                // Here you would normally send the data to your backend
                // En un entorno real, aquí iría algo como:
                // fetch('/api/contact', { method: 'POST', body: formData })
                console.log('Form data:', data);
                // console.log: Muestra los datos capturados en la consola del navegador.
                // Útil para depuración.

            }, 1500); // 1500ms = 1.5 segundos de espera simulada.
        });
    } // Fin del if (contactForm)

    // ==================================================================================
    // BLOQUE: SMOOTH SCROLL FOR ANCHOR LINKS (Scroll Suave para Anclas)
    // ----------------------------------------------------------------------------------
    // Selecciona todos los enlaces que empiezan con "#" (anclas internas).
    -/ Previene el salto instantáneo y lo reemplaza con un scroll suave animado.
    // - Calcula la posición del destino restando 80px (offset para que no quede
    //   tapado por la navbar fija).
    // - Usa window.scrollTo() con behavior: 'smooth' para la animación.
    // ==================================================================================

    // 'a[href^="#"]': Selector CSS que significa:
    //   a = elemento <a>
    //   [href^="#"] = que su atributo href EMPIECE (^) con "#"
    // Esto selecciona <a href="#inicio">, <a href="#contacto">, etc.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Usamos function() en lugar de () => para poder usar 'this' referenciando
            // al elemento <a> que fue clicado.

            // this.getAttribute('href'): Obtiene el valor del atributo href del enlace.
            // Ej: "#inicio", "#contacto", etc. Si es solo "#", lo ignoramos.
            const href = this.getAttribute('href');
            if (href === '#') return;
            // return: Sale de la función sin hacer nada si el href es "#".

            e.preventDefault();
            // Previene el comportamiento por defecto del enlace (salto instantáneo).

            // document.querySelector(href): Busca un elemento con ese ID.
            // Ej: document.querySelector('#inicio') encuentra <section id="inicio">.
            const target = document.querySelector(href);

            if (target) {
                // Si el elemento destino existe...
                const offset = 80;
                // Offset de 80px para compensar la altura de la navbar fija.
                // Así el título de la sección no queda tapado por la navbar.

                // target.getBoundingClientRect().top:
                // Distancia desde el borde superior del viewport hasta el elemento.
                // window.pageYOffset: Cuánto se ha scrolleado la página actualmente.
                // Fórmula: posición absoluta del elemento - offset de la navbar.
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                // window.scrollTo(): Desplaza la página a una posición específica.
                window.scrollTo({
                    top: targetPosition, // Posición vertical destino.
                    behavior: 'smooth'  // 'smooth' = animación suave.
                });
            }
        });
    });

    // ==================================================================================
    // BLOQUE: COUNTER ANIMATION FOR STATS (Animación de Contadores en Estadísticas)
    // ----------------------------------------------------------------------------------
    // Cuando las tarjetas de estadísticas (alumnos, clases, calificación) entran en
    // el viewport, los números se animan desde 0 hasta su valor final.
    // - Usa IntersectionObserver para detectar cuándo son visibles
    // - Usa requestAnimationFrame para la animación fluida
    // - Tiene easing cubic (aceleración/desaceleración suave)
    // - Solo se anima UNA vez (data-animated previene repetición)
    // ==================================================================================

    // Función que anima un contador desde 0 hasta un valor target
    // Parámetros:
    //   element: El elemento HTML que contiene el número (ej: <span class="stat-number">)
    //   target: El número final al que queremos llegar (ej: 50, 500, 5)
    //   duration: Duración en milisegundos (default 2000 = 2 segundos)
    function animateCounter(element, target, duration = 2000) {
        const start = 0; // Valor inicial del contador.
        const startTime = performance.now();
        // performance.now(): Tiempo actual de alta precisión (en milisegundos).
        // Sirve para calcular cuánto tiempo ha pasado desde que empezó la animación.

        // Función interna que se llama en cada frame de la animación
        // currentTime: Tiempo actual proporcionado por requestAnimationFrame.
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            // elapsed: Milisegundos transcurridos desde que empezó la animación.

            const progress = Math.min(elapsed / duration, 1);
            // progress: Progreso de 0 a 1. Si elapsed > duration, se limita a 1.
            // Math.min(): Asegura que no pase de 1.

            // Ease out cubic (desaceleración cúbica)
            // Fórmula: 1 - (1 - t)^3
            // Hace que el contador empiece rápido y desacelere al final.
            // Se ve más natural que una animación lineal.
            const eased = 1 - Math.pow(1 - progress, 3);
            // Math.pow(base, exponente): Potencia. (1 - progress)^3

            // Valor actual: eased * target, redondeado hacia abajo.
            const current = Math.floor(eased * (target - start) + start);
            // Math.floor(): Redondea al entero inferior.

            // Actualiza el texto del elemento con el valor actual + "+".
            element.textContent = current + (target >= 1000 ? '+' : '+');
            // Si target >= 1000, igual agrega "+" (aunque ambas opciones son iguales aquí,
            // podría personalizarse para targets grandes).

            if (progress < 1) {
                // Si la animación no ha terminado (progress < 1)...
                requestAnimationFrame(update);
                // requestAnimationFrame(): Le pide al navegador que ejecute update()
                // en el próximo frame (aproximadamente 60 veces por segundo).
                // Es más eficiente que setInterval para animaciones.
            } else {
                // Si la animación terminó, aseguramos que muestre el valor final exacto.
                element.textContent = target + (target >= 1000 ? '+' : '+');
            }
        }

        // Inicia la animación llamando a update() por primera vez.
        requestAnimationFrame(update);
    }

    // Observar las tarjetas de estadísticas para disparar la animación
    // Creamos un nuevo IntersectionObserver específico para las stats.
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // entry.isIntersecting: true si la tarjeta es visible.
            if (entry.isIntersecting) {
                // Dentro de la tarjeta, busca el elemento con clase 'stat-number'.
                const numberEl = entry.target.querySelector('.stat-number');

                // Si existe y NO tiene el atributo data-animated (para animar solo una vez)...
                if (numberEl && !numberEl.dataset.animated) {
                    // numberEl.textContent: El texto actual del número (ej: "50+" o "5.0").
                    const text = numberEl.textContent;

                    // Extract number from text like "50+" or "500+"
                    // text.match(/(\d+)/): Busca el primer grupo de dígitos en el texto.
                    // \d+ = uno o más dígitos. Devuelve un array con el match, o null.
                    const match = text.match(/(\d+)/);
                    if (match) {
                        // match[1]: El primer grupo capturado por los paréntesis.
                        // parseInt(): Convierte el string a número entero.
                        const target = parseInt(match[1]);

                        // Marcamos que ya se animó para que no se repita.
                        numberEl.dataset.animated = 'true';

                        // Iniciamos la animación del contador.
                        animateCounter(numberEl, target);
                    }
                }
                // Deja de observar esta tarjeta (animación única).
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    // threshold: 0.5: La animación se dispara cuando al menos el 50% de la tarjeta
    // es visible en la pantalla.

    // Selecciona todas las tarjetas de estadísticas y las empieza a observar.
    document.querySelectorAll('.stat-card').forEach(card => {
        statObserver.observe(card); // Registrar cada tarjeta para ser observada.
    });

    // ==================================================================================
    // BLOQUE: MENSAJE DE CONSOLA (Opcional)
    // ----------------------------------------------------------------------------------
    // Simplemente un mensaje informativo en consola que indica que la página cargó bien.
    // Completamente opcional y removible. No afecta la funcionalidad.
    // Podría extenderse para agregar un efecto de tipeo en el bloque de código del Hero.
    // ==================================================================================
    console.log('🍃 Landing page cargada correctamente');

}); // Fin del DOMContentLoaded
// Todo lo que está arriba se ejecuta cuando el HTML está listo.
