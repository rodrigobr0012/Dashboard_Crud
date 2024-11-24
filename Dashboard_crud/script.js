const initialQuizzes = [
    {
        id: '1',
        title: 'Revolução francesa',
        author: {
            name: 'Elisa Silva',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
        },
        topic: 'História'
    },
    {
        id: '2',
        title: 'Equação de 2º grau',
        author: {
            name: 'Elisa Silva',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
        },
        topic: 'Matemática'
    }
];

let quizzes = [...initialQuizzes];

function createQuizCard(quiz) {
    return `
        <div class="quiz-card" data-id="${quiz.id}">
            <div class="quiz-header">
                <h3 class="quiz-title">${quiz.title}</h3>
                <div class="quiz-actions">
                    <button class="action-button edit-button" onclick="handleEdit('${quiz.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    </button>
                    <button class="action-button delete-button" onclick="handleDelete('${quiz.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="quiz-author">
                <img src="${quiz.author.avatar}" alt="${quiz.author.name}" class="author-avatar">
                <div class="author-info">
                    <p class="author-name">${quiz.author.name}</p>
                    <p class="quiz-topic">Tema: ${quiz.topic}</p>
                </div>
            </div>
        </div>
    `;
}

function renderQuizzes() {
    const quizGrid = document.getElementById('quizGrid');
    quizGrid.innerHTML = quizzes.map(quiz => createQuizCard(quiz)).join('');
}

function handleDelete(id) {
    if (confirm('Tem certeza que deseja excluir este quiz?')) {
        quizzes = quizzes.filter(quiz => quiz.id !== id);
        renderQuizzes();
    }
}

function handleEdit(id) {
    window.location.href = `create.html?id=${id}`;
}

function handleCreateNew() {
    window.location.href = 'create.html';
}

// Initial render
document.addEventListener('DOMContentLoaded', renderQuizzes);