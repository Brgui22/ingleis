// =============================================
//  SCRIPT DA PÁGINA DE LOGIN (login.js)
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    const loginTab = document.getElementById('login-tab');
    const cadastroTab = document.getElementById('cadastro-tab');
    const glider = document.querySelector('.auth-toggle .glider');
    const authContent = document.getElementById('auth-content');
    const authTitle = document.getElementById('auth-title');
    const nameGroup = document.getElementById('name-group');
    const submitBtn = document.getElementById('submit-btn');
    const emailForm = document.getElementById('email-form');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const authMsg = document.getElementById('auth-msg');
    let modo = 'login';

    function moveGlider(target) {
        if (!target || !glider) return;
        glider.style.width = `${target.offsetWidth}px`;
        glider.style.transform = `translateX(${target.offsetLeft}px)`;
    }

    moveGlider(document.querySelector('.auth-toggle .active'));

    function alternarModo(novoModo, targetButton) {
        if (modo === novoModo) return;
        modo = novoModo;
        moveGlider(targetButton);
        loginTab.classList.toggle('active', modo === 'login');
        cadastroTab.classList.toggle('active', modo === 'cadastro');

        authContent.classList.add('fading-out');
        setTimeout(() => {
            authTitle.textContent = modo === 'login' ? 'Acesse sua conta' : 'Crie sua conta grátis';
            nameGroup.style.display = modo === 'cadastro' ? 'block' : 'none';
            submitBtn.textContent = modo === 'login' ? 'Entrar' : 'Criar conta';
            authMsg.textContent = '';
            authMsg.classList.remove('visible');
            authContent.classList.remove('fading-out');
        }, 200);
    }

    async function handleRedirect(user) {
        try {
            const userDoc = await window.firebaseIngleis.db.obterPerfil(user.uid);
            if (!userDoc.exists || !userDoc.data().idioma) {
                authMsg.textContent = `Bem-vindo(a), ${user.displayName || user.email}! Vamos configurar seu perfil.`;
                setTimeout(() => { window.location.href = 'completar-perfil.html'; }, 1500);
            } else {
                authMsg.textContent = `Que bom te ver de novo, ${user.displayName || user.email}!`;
                setTimeout(() => { window.location.href = 'index.html'; }, 1500);
            }
        } catch (error) {
            console.error("Erro ao verificar perfil, redirecionando para a home:", error);
            window.location.href = 'index.html';
        }
    }

    function exibirMensagemErro(err) {
        console.error("Erro de autenticação:", err.code);
        authMsg.style.color = '#e53e3e';
        let mensagemErro;
        switch (err.code) {
            case 'auth/missing-name': mensagemErro = 'Por favor, informe seu nome para o cadastro.'; break;
            case 'auth/weak-password': mensagemErro = 'Sua senha deve ter no mínimo 6 caracteres.'; break;
            case 'auth/email-already-in-use': mensagemErro = 'Este e-mail já foi cadastrado. Tente fazer login.'; break;
            case 'auth/invalid-email': mensagemErro = 'O formato do e-mail é inválido.'; break;
            case 'auth/user-not-found': mensagemErro = 'Nenhuma conta encontrada com este e-mail.'; break;
            case 'auth/wrong-password': mensagemErro = 'Senha incorreta. Tente novamente.'; break;
            case 'auth/too-many-requests': mensagemErro = 'Muitas tentativas de login. Tente novamente mais tarde.'; break;
            default: mensagemErro = 'Ocorreu um erro. Verifique seus dados e tente novamente.'; break;
        }
        authMsg.textContent = mensagemErro;
    }

    loginTab.addEventListener('click', (e) => alternarModo('login', e.currentTarget));
    cadastroTab.addEventListener('click', (e) => alternarModo('cadastro', e.currentTarget));
    
    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('name-input').value;
        const email = document.getElementById('email-input').value;
        const senha = document.getElementById('password-input').value;

        authMsg.textContent = 'Processando...';
        authMsg.classList.add('visible');
        authMsg.style.color = 'var(--cor-texto-secundario)';

        try {
            let userCredential;
            if (modo === 'cadastro') {
                if (!nome) throw { code: 'auth/missing-name' };
                userCredential = await window.firebaseIngleis.auth.criarUsuarioComEmailSenha(email, senha);
                const user = userCredential.user;
                await window.firebaseIngleis.auth.atualizarPerfilUsuario({ displayName: nome });
                await window.firebaseIngleis.db.salvarPerfil(user.uid, { displayName: nome, email: email });
            } else {
                userCredential = await window.firebaseIngleis.auth.loginComEmailSenha(email, senha);
            }
            
            salvarUsuarioLocal(userCredential.user);
            authMsg.style.color = 'var(--cor-destaque)';
            await handleRedirect(userCredential.user);

        } catch (err) {
            exibirMensagemErro(err);
        }
    });

    googleLoginBtn.addEventListener('click', async () => {
        authMsg.textContent = 'Aguarde...';
        authMsg.classList.add('visible');
        authMsg.style.color = 'var(--cor-texto-secundario)';
        try {
           const result = await window.firebaseIngleis.auth.loginGoogle();
           salvarUsuarioLocal(result.user);
           authMsg.style.color = 'var(--cor-destaque)';
           await handleRedirect(result.user);
        } catch(err) {
           exibirMensagemErro(err);
        }
   });
});