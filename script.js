import './firebase.js';
import { auth, db, storage } from './firebase.js';
import { onAuthStateChanged, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { query, orderBy, collection, addDoc, getDocs, onSnapshot, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {
    const feed = document.getElementById('feed');
    const botonPublicar = document.getElementById("postButton");
    const nuevaPublicacion = document.getElementById("postInput");
    const fotoPublicacion = document.getElementById("foto_publicacion");

    // Publicar con imagen
    botonPublicar?.addEventListener("click", async () => {
        if (nuevaPublicacion.value.trim() || fotoPublicacion.files.length) {
            try {
                let urlFoto = null;

                // Subir foto si existe
                if (fotoPublicacion.files.length > 0) {
                    const archivoFoto = fotoPublicacion.files[0];
                    const fotoRef = ref(storage, 'fotos_publicaciones/' + archivoFoto.name);
                    await uploadBytes(fotoRef, archivoFoto);
                    urlFoto = await getDownloadURL(fotoRef);
                }

                // Crear nueva publicación
                const nuevaPublicacionData = {
                    texto: nuevaPublicacion.value,
                    imagenPublicacion: urlFoto || null,
                    userName: auth.currentUser.displayName,
                    photoURL: auth.currentUser.photoURL,
                    timestamp: new Date(),
                    likes: 0 // Agregar campo de "likes"
                };

                // Agregar la publicación a Firestore
                await addDoc(collection(db, "publicaciones"), nuevaPublicacionData);

                nuevaPublicacion.value = "";
                fotoPublicacion.value = "";
                cargarPublicaciones(); // Recargar publicaciones después de publicar
            } catch (error) {
                console.log("Error al publicar: ", error);
            }
        } else {
            console.log("El campo de publicación está vacío.");
        }
    });

// Cargar publicaciones
async function cargarPublicaciones() {
    if (feed) {
        const publicacionesSnapshot = await getDocs(query(collection(db, "publicaciones"), orderBy("timestamp", "desc")));
        feed.innerHTML = '';

        publicacionesSnapshot.forEach(async (publicacionDoc) => {
            const data = publicacionDoc.data();
            const publicacionID = publicacionDoc.id;
            const nuevaPublicacion = document.createElement('div');
            nuevaPublicacion.classList.add('publicacion');

            // Crear el contenido de la publicación
            nuevaPublicacion.innerHTML = `
                <div class="publicacion-header">
                    <img src="${data.photoURL || './img/perfil/foto-perfil.jpg'}" alt="Perfil" class="perfil-img">
                    <span class="nombre-usuario">${data.userName}</span>
                </div>
                <div class="publicacion-contenido">
                    <p>${data.texto}</p>
                    ${data.imagenPublicacion ? `<img src="${data.imagenPublicacion}" alt="Imagen de publicación" class="contenido-img">` : ''}
                </div>
                <div class="formulario-comentarios">
                    <form class="form-comentario" data-publicacion-id="${publicacionID}">
                        <input type="text" class="comentario-input" placeholder="Escribe un comentario..." required />
                        <button type="submit" class="comentario-boton">Comentar</button>
                    </form>
                    <div class="comentarios-lista" id="comentarios-${publicacionID}"></div>
                </div>
            `;

            feed.appendChild(nuevaPublicacion);

            cargarComentarios(publicacionID);
        });
    }
}


    // Cargar comentarios asociados a una publicación
    function cargarComentarios(publicacionID) {
        const comentariosQuery = query(collection(db, `publicaciones/${publicacionID}/comentarios`), orderBy("timestamp", "asc"));
        const comentariosLista = document.getElementById(`comentarios-${publicacionID}`);
        onSnapshot(comentariosQuery, (snapshot) => {
            comentariosLista.innerHTML = '';
            snapshot.forEach((doc) => {
                const comentario = doc.data();
                const comentarioElement = document.createElement('div');
                comentarioElement.classList.add('comentario');
                comentarioElement.innerHTML = `
                    <div class="comentario-usuario">
                        <img src="${comentario.fotoPerfil}" alt="Foto de ${comentario.nombre}" class="comentario-img">
                        <span class="comentario-nombre">${comentario.nombre}</span>
                    </div>
                    <p>${comentario.texto}</p>
                `;
                comentariosLista.appendChild(comentarioElement);
            });
        });
    }

    // Guardar comentarios en Firestore en la subcolección de cada publicación
    document.addEventListener('submit', async (e) => {
        if (e.target.classList.contains('form-comentario')) {
            e.preventDefault();

            const comentarioInput = e.target.querySelector('.comentario-input');
            const publicacionID = e.target.getAttribute('data-publicacion-id');

            if (auth.currentUser && comentarioInput.value.trim()) {
                await addDoc(collection(db, `publicaciones/${publicacionID}/comentarios`), {
                    texto: comentarioInput.value,
                    nombre: auth.currentUser.displayName,
                    fotoPerfil: auth.currentUser.photoURL,
                    timestamp: new Date()
                });

                comentarioInput.value = '';
            }
        }
    });


    cargarPublicaciones(); // Cargar publicaciones al iniciar
});



document.addEventListener('DOMContentLoaded', () => {
    const profilePic = document.getElementById('profilePic');
    const profileMenu = document.getElementById('profileMenu');
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const toggleThemeBtn = document.getElementById('toggleTheme');
    const themeIcon = document.getElementById('themeIcon');

    // Menú desplegable del perfil
    if (profilePic && profileMenu) {
        profilePic.addEventListener('click', (event) => {
            event.stopPropagation();
            profileMenu.classList.toggle('active');
        });
    }

    // Menú lateral
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            sidebar.classList.toggle('active');
        });
    }

    // Cerrar menúes cuando se hace clic fuera
    document.addEventListener('click', (event) => {
        if (profileMenu && !profileMenu.contains(event.target) && !profilePic.contains(event.target)) {
            profileMenu.classList.remove('active');
        }

        if (sidebar && !sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    });

    // Cambiar tema y almacenar en localStorage
    if (toggleThemeBtn && themeIcon) {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark');
            themeIcon.src = '/img/pagina/moon-icon.png';
        } else {
            document.body.classList.add('light');
            themeIcon.src = '/img/pagina/sun-icon.png';
        }

        toggleThemeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            document.body.classList.toggle('light');
            
            if (document.body.classList.contains('dark')) {
                themeIcon.src = '/img/pagina/moon-icon.png';
                localStorage.setItem('theme', 'dark');
            } else {
                themeIcon.src = '/img/pagina/sun-icon.png';
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Manejo de eventos para los botones de inicio de sesión y registro
    document.getElementById('loginBtn').addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = '/login/login.html';
    });

});


auth.onAuthStateChanged((user) => {
    if (user) {
        const profilePhotoURL = user.photoURL;
        const profileImgElement = document.getElementById('profilePic'); // Cambié 'profile-photo' por 'profilePic'

        if (profileImgElement) {  // Verifica si el elemento existe
            profileImgElement.src = profilePhotoURL ? profilePhotoURL : '/imf/perfil/foto-perfil';
        } else {
            console.log("Elemento profilePic no encontrado en el DOM."); // Cambié 'profile-photo' por 'profilePic'
        }
    } else {
        console.log("Usuario no autenticado");
    }
});