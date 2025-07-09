firebase.auth().onAuthStateChanged(user => {
    
    // Se o Firebase confirmar que NÃO HÁ usuário, redireciona para o login.
    if (!user) {
        console.log("Observador do Firebase: Nenhum usuário encontrado, redirecionando...");
        window.location.href = 'login.html';
        return;
    }
    
    // Se chegou aqui, o usuário está 100% confirmado e o objeto 'user' está fresco.
    console.log("Observador do Firebase: Usuário confirmado.", user.uid);

    // Salva a informação mais recente no localStorage para outras páginas usarem
    salvarUsuarioLocal(user);
    
    // Referências de Elementos do DOM
    const avatarContainer = document.getElementById('avatar-container-perfil');
    const perfilNome = document.getElementById('perfil-nome');
    const perfilEmail = document.getElementById('perfil-email');
    const modal = document.getElementById('modal-editar');
    const btnEditar = document.getElementById('btn-editar-perfil');
    const closeModal = document.getElementById('close-modal');
    const btnCancelar = document.getElementById('btn-cancelar');
    const formEditar = document.getElementById('form-editar-perfil');
    const nomeInput = document.getElementById('nome-input');
    const emailInput = document.getElementById('email-input');
    const avatarModalContainer = document.getElementById('avatar-container-modal');
    const btnSalvar = document.getElementById('btn-salvar');

    // Preenche a página com os dados do usuário GARANTIDO
    avatarContainer.innerHTML = gerarAvatarHtml(user); // Função do main.js
    perfilNome.textContent = user.displayName || 'Usuário sem nome';
    perfilEmail.textContent = user.email || 'E-mail não informado';
    
    // Lógica para abrir e fechar o modal
    btnEditar.addEventListener('click', () => {
        nomeInput.value = user.displayName || '';
        emailInput.value = user.email || '';
        avatarModalContainer.innerHTML = gerarAvatarHtml(user); // Função do main.js
        modal.style.display = 'block';
    });
    
    const fecharModal = () => modal.style.display = 'none';
    closeModal.addEventListener('click', fecharModal);
    btnCancelar.addEventListener('click', fecharModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) fecharModal();
    });
    
    // Lógica para salvar o formulário de edição
    formEditar.addEventListener('submit', async (e) => {
        e.preventDefault();
        btnSalvar.disabled = true;
        btnSalvar.textContent = 'Salvando...';
        
        try {
            const novoNome = nomeInput.value.trim();
            if (!novoNome) {
                alert('Por favor, insira um nome válido.');
                return;
            }

            // ATENÇÃO: A função no firebase.js continua usando firebase.auth().currentUser,
            // mas agora temos a GARANTIA de que ele não será nulo, pois este código
            // só é executado após a confirmação do login.
            await window.firebaseIngleis.auth.atualizarPerfilUsuario({ displayName: novoNome });
            await window.firebaseIngleis.db.salvarPerfil(user.uid, { displayName: novoNome });
            
            // Atualiza os dados no localStorage com o usuário mais recente
            const usuarioAtualizado = firebase.auth().currentUser;
            salvarUsuarioLocal(usuarioAtualizado); // Função do main.js
            
            // Atualiza a interface da página
            perfilNome.textContent = novoNome;
            avatarContainer.innerHTML = gerarAvatarHtml(usuarioAtualizado);
            
            fecharModal();
            // Recarrega o header para atualizar o avatar pequeno
            exibirUsuarioHeader(); 

        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            alert('Erro ao salvar perfil. Tente novamente.');
        } finally {
            btnSalvar.disabled = false;
            btnSalvar.textContent = 'Salvar Alterações';
        }
    });
});