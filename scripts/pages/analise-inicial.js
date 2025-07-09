// Aguarda o conteúdo da página carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos da página que vamos usar
    const textArea = document.getElementById('texto-historia');
    const analisarButton = document.getElementById('btn-analisar');

    // Verifica se os elementos existem antes de adicionar eventos
    if (analisarButton && textArea) {
        analisarButton.addEventListener('click', () => {
            const textoDoUsuario = textArea.value;

            // Validação simples para garantir que o texto não está vazio
            if (textoDoUsuario.trim() === '') {
                alert('Por favor, escreva sua história antes de analisar.');
                return;
            }

            console.log('Botão "Analisar" clicado.');
            console.log('Texto para análise:', textoDoUsuario);

            // --- LÓGICA FUTURA ---
            // Futuramente, aqui faremos os seguintes passos:
            // 1. Desabilitar o botão e exibir uma animação de "carregando".
            // 2. Chamar nossa Firebase Cloud Function, enviando o 'textoDoUsuario'.
            // 3. Receber o resultado da análise (o objeto JSON).
            // 4. Salvar as 'tags' de dificuldade no perfil do usuário no Firestore.
            // 5. Redirecionar o usuário para a dashboard.
            
            alert('Funcionalidade de análise em desenvolvimento! Por enquanto, seu texto foi registrado no console.');
        });
    }
});