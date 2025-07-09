// ===============================
// Configuração e Funções Firebase
// ===============================

// Configuração do Firebase (substitua pelos seus dados do projeto)
const firebaseConfig = {
    apiKey: "AIzaSyDGHe8kOl3B7HI5FnyQJlZdMc6gIQaNz1g",
    authDomain: "ingleisltda.firebaseapp.com",
    projectId: "ingleisltda",
    storageBucket: "ingleisltda.firebasestorage.app",
    messagingSenderId: "516740575846",
    appId: "1:516740575846:web:9c344b38d1899b50a8f3a7"
};

// Inicializa o Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

/**
 * Cria um novo usuário com e-mail e senha.
 * @param {string} email - O e-mail do usuário.
 * @param {string} senha - A senha do usuário.
 * @returns {Promise<firebase.auth.UserCredential>}
 */
function criarUsuarioComEmailSenha(email, senha) {
    return firebase.auth().createUserWithEmailAndPassword(email, senha);
}

/**
 * Autentica um usuário existente com e-mail e senha.
 * @param {string} email - O e-mail do usuário.
 * @param {string} senha - A senha do usuário.
 * @returns {Promise<firebase.auth.UserCredential>}
 */
function loginComEmailSenha(email, senha) {
    return firebase.auth().signInWithEmailAndPassword(email, senha);
}

/**
 * Atualiza o perfil do usuário atualmente logado (ex: nome).
 * @param {object} dadosParaAtualizar - Objeto com os dados, ex: { displayName: 'Novo Nome' }.
 * @returns {Promise<void>}
 */
function atualizarPerfilUsuario(dadosParaAtualizar) {
    const user = firebase.auth().currentUser;
    if (user) {
        return user.updateProfile(dadosParaAtualizar);
    }
    return Promise.reject(new Error('Nenhum usuário logado.'));
}


/**
 * Realiza login com o Google no Firebase Auth.
 * @returns {Promise<firebase.auth.UserCredential>}
 */
function loginGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
}

/**
 * Faz logout do usuário autenticado no Firebase Auth.
 * @returns {Promise<void>}
 */
function logout() {
    return firebase.auth().signOut();
}

/**
 * Salva/Atualiza dados do usuário no Firestore.
 * @param {string} uid - O ID do usuário.
 * @param {object} dados - Os dados a serem salvos.
 * @returns {Promise<void>}
 */
function salvarPerfil(uid, dados) {
    return firebase.firestore().collection('usuarios').doc(uid).set(dados, { merge: true });
}


// Exporta as funções para uso global no navegador
window.firebaseIngleis = {
    criarUsuarioComEmailSenha,
    loginComEmailSenha,
    atualizarPerfilUsuario,
    loginGoogle,
    logout,
    salvarPerfil,
};