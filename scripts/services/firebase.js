// ===============================
// SERVIÇO FIREBASE
// Centraliza toda a comunicação com o Firebase
// ===============================

const firebaseConfig = {
    apiKey: "AIzaSyDGHe8kOl3B7HI5FnyQJlZdMc6gIQaNz1g", // Substitua pela sua chave de API
    authDomain: "ingleisltda.firebaseapp.com",
    projectId: "ingleisltda",
    storageBucket: "ingleisltda.appspot.com", // Corrigido para .appspot.com
    messagingSenderId: "516740575846",
    appId: "1:516740575846:web:9c344b38d1899b50a8f3a7"
};

// Inicializa o Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Funções de Autenticação
const criarUsuarioComEmailSenha = (email, senha) => firebase.auth().createUserWithEmailAndPassword(email, senha);
const loginComEmailSenha = (email, senha) => firebase.auth().signInWithEmailAndPassword(email, senha);
const loginGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
};
const logout = () => firebase.auth().signOut();

// Funções de Perfil de Usuário
const atualizarPerfilUsuario = (dadosParaAtualizar) => {
    const user = firebase.auth().currentUser;
    if (user) {
        return user.updateProfile(dadosParaAtualizar);
    }
    return Promise.reject(new Error('Nenhum usuário logado.'));
};

// Funções do Firestore
const salvarPerfil = (uid, dados) => firebase.firestore().collection('usuarios').doc(uid).set(dados, { merge: true });
const obterPerfil = (uid) => firebase.firestore().collection('usuarios').doc(uid).get();

// Exporta as funções para uso global através de um único objeto
window.firebaseIngleis = {
    auth: {
        criarUsuarioComEmailSenha,
        loginComEmailSenha,
        loginGoogle,
        logout,
        atualizarPerfilUsuario,
    },
    db: {
        salvarPerfil,
        obterPerfil,
    }
};