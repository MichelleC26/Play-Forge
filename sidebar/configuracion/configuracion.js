//importar firebase
import './firebase.js';
import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

auth.onAuthStateChanged((user) => {
    if (user) {
        const profilePhotoURL = user.photoURL;
        const profileImgElement = document.getElementById('profilePic'); // Cambié 'profile-photo' por 'profilePic'

        if (profileImgElement) {  // Verifica si el elemento existe
            profileImgElement.src = profilePhotoURL ? profilePhotoURL : 'ruta/a/imagen-predeterminada.png';
        } else {
            console.log("Elemento profilePic no encontrado en el DOM."); // Cambié 'profile-photo' por 'profilePic'
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

