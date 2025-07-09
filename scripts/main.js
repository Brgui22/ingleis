// =============================================
//  SCRIPT GLOBAL (main.js)
//  Contém lógica reutilizável em todo o site.
// =============================================

/**
 * Funções de controle do usuário no localStorage
 */
function salvarUsuarioLocal(user) {
    if (!user) return;
    const data = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid
    };
    localStorage.setItem('usuarioIngleis', JSON.stringify(data));
}

function removerUsuarioLocal() {
    localStorage.removeItem('usuarioIngleis');
}

function obterUsuarioLocal() {
    const data = localStorage.getItem('usuarioIngleis');
    return data ? JSON.parse(data) : null;
}

/**
 * Função Central que Gera o HTML do avatar para um usuário.
 * @param {object} user - O objeto do usuário.
 * @returns {string} - A string HTML do avatar.
 */
function gerarAvatarHtml(user) {
    if (!user) {
        return `<div class="avatar-placeholder">U</div>`;
    }

    if (user.photoURL) {
        return `<img src="${user.photoURL}" alt="Avatar de ${user.displayName}" class="user-avatar">`;
    } else {
        const inicial = (user.displayName || user.email || 'U').charAt(0);
        return `<div class="avatar-placeholder">${inicial}</div>`;
    }
}

/**
 * Controla a exibição do menu do usuário no header.
 */
function exibirUsuarioHeader() {
    const userInfoDiv = document.getElementById('user-info');
    if (!userInfoDiv) return;

    const user = obterUsuarioLocal();

    if (user) {
        const avatarHtml = gerarAvatarHtml(user);
        userInfoDiv.innerHTML = `
            ${avatarHtml}
            <div class="dropdown" id="user-dropdown">
                <a href="perfil.html"><i class="fas fa-user-circle"></i><span>Ver Perfil</span></a>
                <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i><span>Sair</span></a>
            </div>
        `;

        const userAvatarContainer = userInfoDiv.querySelector('.user-avatar, .avatar-placeholder');
        const userDropdown = userInfoDiv.querySelector('#user-dropdown');
        const logoutBtn = userInfoDiv.querySelector('#logout-btn');

        userAvatarContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await window.firebaseIngleis.auth.logout();
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

function controlarPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    const chatBubble = preloader.querySelector('.chat-bubble');

    // Inicia a animação de "correção" após um pequeno delay
    setTimeout(() => {
        if (chatBubble) {
            chatBubble.classList.add('correcting');
        }
    }, 800); // 0.8 segundos

    // Esconde o preloader quando a página inteira (incluindo imagens) carregar
    window.addEventListener('load', () => {
        preloader.classList.add('hidden');
    });
}

/**
 * Controla o efeito "sticky" do header ao rolar a página
 */
function controlarHeaderSticky() {
    const header = document.querySelector('header');
    if (!header) return;

    const APLICAR_SCROLL_EM = 30; // pixels

    const onScroll = () => {
        if (window.scrollY > APLICAR_SCROLL_EM) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Executa uma vez no carregamento
}

/**
 * Fecha dropdowns abertos ao clicar fora deles.
 */
function fecharDropdownsAoClicarFora() {
     document.addEventListener('click', () => {
        const dropdownAberto = document.querySelector('.dropdown.show');
        if (dropdownAberto) {
            dropdownAberto.classList.remove('show');
        }
    });
}

// --- INICIALIZAÇÃO GLOBAL ---
document.addEventListener('DOMContentLoaded', () => {
    controlarPreloader(); // <-- ADICIONE ESTA LINHA
    exibirUsuarioHeader();
    controlarHeaderSticky();
    fecharDropdownsAoClicarFora();
});