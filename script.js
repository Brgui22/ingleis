// =============================================
//  SCRIPT GLOBAL
// =============================================

/**
 * Funções de controle do usuário no localStorage
 */
function removerUsuarioLocal() {
    localStorage.removeItem('usuarioIngleis');
}

function obterUsuarioLocal() {
    const data = localStorage.getItem('usuarioIngleis');
    return data ? JSON.parse(data) : null;
}

/**
 * **NOVA FUNÇÃO CENTRAL**
 * Gera o HTML do avatar para um usuário.
 * Retorna a tag <img> se houver photoURL, ou uma <div> com a inicial.
 * @param {object} user - O objeto do usuário (deve conter photoURL, displayName, email).
 * @param {string} customClass - Uma classe CSS customizada para adicionar ao elemento (ex: 'perfil-avatar').
 * @returns {string} - A string HTML do avatar.
 */
function gerarAvatarHtml(user, customClass = '') {
    // Caso base: se não houver usuário, retorna um placeholder padrão.
    if (!user) {
        return `<div class="avatar-placeholder ${customClass}">U</div>`;
    }

    if (user.photoURL) {
        // Se tem foto, usa a tag <img>
        return `<img src="${user.photoURL}" alt="Avatar de ${user.displayName}" class="user-avatar ${customClass}">`;
    } else {
        // Se não tem foto, cria o placeholder com a inicial
        const inicial = (user.displayName || user.email || 'U').charAt(0);
        return `<div class="avatar-placeholder ${customClass}">${inicial}</div>`;
    }
}

/**
 * Controla a exibição do menu do usuário no header.
 * **AGORA UTILIZA A FUNÇÃO CENTRAL gerarAvatarHtml**
 */
function exibirUsuarioHeader() {
    const userInfoDiv = document.getElementById('user-info');
    if (!userInfoDiv) return;

    const user = obterUsuarioLocal();

    if (user) {
        // Simplesmente chama a função para gerar o avatar.
        const avatarHtml = gerarAvatarHtml(user);

        userInfoDiv.innerHTML = `
            ${avatarHtml}
            <div class="dropdown" id="user-dropdown">
                <a href="perfil.html">
                    <i class="fas fa-user-circle"></i>
                    <span>Ver Perfil</span>
                </a>
                <a href="#" id="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Sair</span>
                </a>
            </div>
        `;

        // Lógica do Dropdown (sem alterações)
        const userAvatarContainer = userInfoDiv.querySelector('.user-avatar, .avatar-placeholder');
        const userDropdown = userInfoDiv.querySelector('#user-dropdown');
        const logoutBtn = userInfoDiv.querySelector('#logout-btn');

        userAvatarContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            if (userDropdown.classList.contains('show')) {
                userDropdown.classList.remove('show');
            }
        });
        
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await window.firebaseIngleis.logout();
                removerUsuarioLocal();
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Erro no logout:', error);
            }
        });

    } else {
        userInfoDiv.innerHTML = `<a href="login.html" class="header-login-button">Entrar</a>`;
    }
}

/**
 * Controla o efeito "sticky" do header ao rolar a página
 */
function controlarHeaderSticky() {
    const header = document.querySelector('header');
    if (!header) return;

    if (window.scrollY > 30) {
        header.classList.add('header-scrolled');
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
}


// --- INICIALIZAÇÃO ---
window.addEventListener('DOMContentLoaded', () => {
    exibirUsuarioHeader();
    controlarHeaderSticky();
});