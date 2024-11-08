//importar firebase
import './firebase.js';
import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

auth.onAuthStateChanged((user) => {
    if (user) {
        const profilePhotoURL = user.photoURL;

        // Actualizar la imagen en ambas secciones
        const profileImgElement1 = document.getElementById('profilePic');
        const profileImgElement2 = document.getElementById('profileImage'); // Nuevo id para la sección de la imagen grande

        if (profileImgElement1) {  // Verifica si el primer elemento existe
            profileImgElement1.src = profilePhotoURL ? profilePhotoURL : '/img/perfil/foto-perfil,jpg';
        } else {
            console.log("Elemento profilePic no encontrado en el DOM.");
        }

        if (profileImgElement2) {  // Verifica si el segundo elemento existe
            profileImgElement2.src = profilePhotoURL ? profilePhotoURL : '/img/perfil/foto-perfil,jpg';
        } else {
            console.log("Elemento profileImage no encontrado en el DOM.");
        }
    } else {
        console.log("Usuario no autenticado");
    }
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

// Elementos de la interfaz
const editProfileBtn = document.querySelector('.edit-profile');
const editModal = document.getElementById('editModal');
const saveChangesBtn = document.getElementById('saveChanges');
const bannerBorderInput = document.getElementById('banner-border-color');
const profileBorderInput = document.getElementById('profile-border-color');
const banner = document.querySelector('.banner');
const profilePicContainer = document.querySelector('.profile-pic-container');
const profilePicInput = document.getElementById('profile-pic-input'); // Input de imagen de perfil
const bannerPicInput = document.getElementById('banner-input'); // Input de imagen de banner
const nameInput = document.getElementById('username-input'); // Input de nombre
const descriptionInput = document.getElementById('description-input'); // Input de descripción

// Mostrar el modal al hacer clic en "Editar Perfil"
editProfileBtn.addEventListener('click', () => {
    editModal.classList.remove('hidden'); // Mostrar modal
    editModal.classList.add('active');
});

// Cerrar el modal si se hace clic fuera de él
window.addEventListener('click', (event) => {
    if (event.target === editModal) {
        editModal.classList.add('hidden'); // Ocultar modal
        editModal.classList.remove('active'); // Desactivar clase
    }
});

// Guardar cambios
saveChangesBtn.addEventListener('click', () => {
    // Cambiar el color del borde del banner
    if (bannerBorderInput.value) {
        banner.style.borderColor = bannerBorderInput.value;
        localStorage.setItem('bannerBorderColor', bannerBorderInput.value); // Guardar color en localStorage
    }

    // Cambiar el color del borde de la imagen de perfil
    if (profileBorderInput.value) {
        profilePicContainer.style.borderColor = profileBorderInput.value;
        localStorage.setItem('profileBorderColor', profileBorderInput.value); // Guardar color en localStorage
    }

    // Cambiar imagen de perfil si se ha seleccionado una nueva
    if (profilePicInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Cambiar la imagen de perfil en todas las secciones
            profilePicContainer.querySelector('img').src = e.target.result;
            document.getElementById('profilePic').src = e.target.result;  // Cambiar imagen en el menú de perfil
            localStorage.setItem('profilePic', e.target.result); // Guardar URL de imagen en localStorage
        };
        reader.readAsDataURL(profilePicInput.files[0]);
     }

    // Cambiar imagen de banner si se ha seleccionado una nueva
    if (bannerPicInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            banner.style.backgroundImage = `url(${e.target.result})`;
            localStorage.setItem('bannerPic', e.target.result); // Guardar URL de imagen en localStorage
        };
        reader.readAsDataURL(bannerPicInput.files[0]);
    }

    // Cambiar nombre y descripción
    if (nameInput.value) {
        document.getElementById('username').textContent = nameInput.value;
        localStorage.setItem('username', nameInput.value); // Guardar nombre en localStorage
    }

    if (descriptionInput.value) {
        document.getElementById('user-description').textContent = descriptionInput.value;
        localStorage.setItem('description', descriptionInput.value); // Guardar descripción en localStorage
    }
    
    // Cerrar el modal después de guardar los cambios
    editModal.classList.remove('active');
    editModal.classList.add('hidden');
});


// Cargar datos del perfil desde localStorage al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    
    // Cargar el nombre
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        document.getElementById('username').textContent = storedUsername;
    }

    // Cargar la descripción
    const storedDescription = localStorage.getItem('description');
    if (storedDescription) {
        document.getElementById('user-description').textContent = storedDescription;
    }
    
    // Cargar la imagen de perfil desde localStorage
    const storedProfilePic = localStorage.getItem('profilePic');
    if (storedProfilePic) {
        document.getElementById('profilePic').src = storedProfilePic; // Asegúrate de que el id es correcto
    } else {
        document.getElementById('profilePic').src = '/img/perfil/foto-perfil.jpg'; // Ruta por defecto si no hay imagen
    }

    // Cargar la imagen de banner
    const storedBannerPic = localStorage.getItem('bannerPic');
    if (storedBannerPic) {
        banner.style.backgroundImage = `url(${storedBannerPic})`;
    }

    // Cargar el color del borde del banner
    const storedBannerBorderColor = localStorage.getItem('bannerBorderColor');
    if (storedBannerBorderColor) {
        banner.style.borderColor = storedBannerBorderColor;
        bannerBorderInput.value = storedBannerBorderColor; // Actualizar el input del color
    }

    // Cargar el color del borde de la imagen de perfil
    const storedProfileBorderColor = localStorage.getItem('profileBorderColor');
    if (storedProfileBorderColor) {
        profilePicContainer.style.borderColor = storedProfileBorderColor;
        profileBorderInput.value = storedProfileBorderColor; // Actualizar el input del color
    }
});


// Borrar datos
const clearDataBtn = document.getElementById('clearData');
clearDataBtn.addEventListener('click', () => {
    // Confirmar si el usuario quiere borrar los datos
    const confirmation = confirm("¿Estás seguro de que deseas borrar todos los datos del perfil?");
    if (confirmation) {
        // Borrar los datos del localStorage
        localStorage.removeItem('username');
        localStorage.removeItem('description');
        localStorage.removeItem('profilePic');
        localStorage.removeItem('bannerPic');
        localStorage.removeItem('bannerBorderColor');
        localStorage.removeItem('profileBorderColor');

        // Restablecer los elementos de la interfaz
        document.getElementById('username').textContent = "Nombre del Usuario";
        document.getElementById('user-description').textContent = "Descripción del usuario";
        profilePicContainer.querySelector('img').src = "/img/perfil/foto-perfil.jpg"; // Ruta por defecto
        banner.style.backgroundImage = "none"; // Restablecer a la imagen por defecto

        // Opcional: Resetear los colores de los bordes
        banner.style.borderColor = "";
        profilePicContainer.style.borderColor = "";
    }
});

// Obtener el elemento del input para cambiar la foto de perfil
const profileImageElement = document.getElementById('profilePic');

// Verificar si hay una foto de perfil guardada en localStorage y cargarla al iniciar
window.addEventListener('load', function() {
    const savedProfilePic = localStorage.getItem('profilePic');
    if (savedProfilePic) {
        profileImageElement.src = savedProfilePic; // Establecer la imagen guardada como fuente
    } else {
        console.log("No se encontró imagen en localStorage");
    }
});


