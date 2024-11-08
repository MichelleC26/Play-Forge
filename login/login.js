//importar firebase
import './firebase.js';
import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


// Selector para el botón de alternar tema
const themeToggleBtn = document.getElementById('toggleTheme');
const themeIcon = document.getElementById('themeIcon');

// Función para alternar entre modo claro y oscuro
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    themeIcon.classList.toggle('dark-mode'); // Cambiar el icono según el tema
}

// Agregar evento de clic al botón
themeToggleBtn.addEventListener('click', toggleTheme);


formulario_login.addEventListener("submit", function (e) {
    e.preventDefault();

    let email = document.getElementById("email_login").value;
    let password = document.getElementById("password_login").value;

    // INICIAR SESION CON CORREO Y PASSWORD

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Colocar que es lo que quieres que haga cuando inicias sesion
            console.log("iniciaste sesion con email y password");
            window.location.href = "index.html";
            
        })
        .catch((error) => {
            // En caso haya error, se muestra por la consola
            console.log(error.message);
        })


})
// INICIAR SESION CON GOOGLE 

let google = document.getElementById("google");
google.addEventListener("click", function () {
    
    const provier = new GoogleAuthProvider();
    
    signInWithPopup(auth, provier)
        .then((result) => {
            // Colocar que es lo que quieres que haga cuando inicias sesion
            console.log("iniciaste con Google");
            window.location.href = "../index.html";
        })
        .catch((error) => {
            // En caso haya error, se muestra por la consola
            console.log(error);
        })
})
