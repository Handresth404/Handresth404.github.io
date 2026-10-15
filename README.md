# Portafolio de Christian Ayala

Esta es una versión organizada de mi portafolio para aprender y ampliarlo gradualmente. Está construida con **HTML, CSS y JavaScript puro**, sin frameworks ni servidor.

## Estructura

```text
ChristianAyala_portafolio/
├── ChristianAyala.html      # Estructura y contenido
├── css/
│   └── styles.css          # Diseño y tema oscuro
├── js/
│   └── main.js             # Menú, filtros, tema y ventanas
├── assets/
│   └── foto-christian.jpg  # Fotografía
└── README.md               # Esta guía
```

## Cómo abrirlo

1. Descomprime el ZIP **manteniendo la estructura de carpetas**.
2. Abre `ChristianAyala.html` en Chrome, Edge o Firefox.
3. Para editarlo, abre toda la carpeta con Visual Studio Code.

Los estilos y scripts son archivos locales, pero la tipografía de Google Fonts necesita conexión. Si no hay Internet, el navegador utiliza tipografías alternativas.

## ¿Qué edito y dónde?

- **Textos y enlaces:** `ChristianAyala.html`.
- **Colores:** variables `:root` (claro) y `html[data-theme=dark]` (oscuro) en `css/styles.css`.
- **Animaciones y apariencia:** `css/styles.css`; comportamiento del tema, buscador, menú y ventanas en `js/main.js`.
- **Fotografía:** reemplaza `assets/foto-christian.jpg` con el mismo nombre o actualiza su ruta en el HTML.
- **WhatsApp:** busca `wa.me/593995593657` en el HTML. El mensaje ya aparece redactado cuando la persona abre el enlace; no se envía automáticamente.

## Mejoras por etapas (sin inventar información)

**Ahora (realizado):** paleta oscura profesional, animaciones más discretas, contacto directo, estructura separada.

**Siguiente etapa:** agregar **un caso de estudio real** a la tarjeta de segmentación semántica: objetivo, tecnologías usadas, imágenes originales y máscaras de predicción (si puedes compartirlas), retos y resultados reales. Evita porcentajes de precisión no verificados.

**Después:** añadir, uno por uno, repositorios propios o demos públicas de tus trabajos de bases de datos y desarrollo, solo cuando los enlaces existan.

**Al final:** optimizar SEO, agregar favicon y preparar publicación en GitHub Pages. Antes de publicar, revisa qué datos de contacto deseas hacer públicos.

## Para publicar con GitHub Pages

Para usar la raíz de un repositorio: sube el contenido de esta carpeta, cambia `ChristianAyala.html` a `index.html` y habilita GitHub Pages en Settings → Pages. Conserva las carpetas `css`, `js` y `assets` junto al HTML.

## Nielsen

- Los filtros indican cuántos trabajos aparecen y pueden restablecerse.
- El menú móvil indica si está abierto y se puede cerrar.
- Los detalles de cada trabajo se abren en una ventana y pueden cerrarse con Escape.
- El contraste, la navegación por teclado y la preferencia de reducir animaciones se respetan.
- El enlace de WhatsApp abre un mensaje preparado, sin enviarlo por el usuario.
