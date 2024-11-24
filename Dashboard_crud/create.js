let questions = [];
let currentQuestionIndex = null;

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

function createQuestionButton(index) {
    return `
        <button class="question-button ${currentQuestionIndex === index ? 'active' : ''}" 
                onclick="selectQuestion(${index})"
                title="Editar Pergunta ${index + 1}">
            Pergunta ${index + 1}
            <button class="delete-question" 
                    onclick="deleteQuestion(${index})"
                    title="Excluir Pergunta ${index + 1}">×</button>
        </button>
    `;
}

function createOptionInput(questionIndex, optionIndex, value = '', isCorrect = false) {
    return `
        <div class="option-input" data-index="${optionIndex}">
            <input type="text" 
                   value="${value}" 
                   placeholder="Digite uma opção de resposta..."
                   onchange="updateOption(${questionIndex}, ${optionIndex}, this.value)"
                   aria-label="Opção de resposta ${optionIndex + 1}">
            <div class="option-actions">
                <button class="correct-option ${isCorrect ? 'selected' : ''}"
                        onclick="toggleCorrectOption(${questionIndex}, ${optionIndex})"
                        title="${isCorrect ? 'Resposta correta' : 'Marcar como correta'}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                </button>
                <button class="delete-option" 
                        onclick="deleteOption(${questionIndex}, ${optionIndex})"
                        title="Excluir opção">×</button>
            </div>
        </div>
    `;
}

function renderQuestions() {
    const questionsList = document.getElementById('questionsList');
    questionsList.innerHTML = questions.map((_, index) => createQuestionButton(index)).join('');
}

function renderCurrentQuestion() {
    const questionEditor = document.getElementById('questionEditor');
    const optionsContainer = document.getElementById('optionsContainer');
    
    if (currentQuestionIndex === null) {
        questionEditor.style.display = 'none';
        return;
    }
    
    questionEditor.style.display = 'block';
    const question = questions[currentQuestionIndex];
    
    document.getElementById('questionInput').value = question.text || '';
    optionsContainer.innerHTML = question.options.map((option, index) => 
        createOptionInput(currentQuestionIndex, index, option.text, option.isCorrect)
    ).join('');
}

function addQuestion() {
    questions.push({
        text: '',
        options: [{ text: '', isCorrect: false }]
    });
    currentQuestionIndex = questions.length - 1;
    renderQuestions();
    renderCurrentQuestion();
    showToast('Nova pergunta adicionada');
}

function deleteQuestion(index) {
    event.stopPropagation();
    if (confirm('Tem certeza que deseja excluir esta pergunta?')) {
        questions.splice(index, 1);
        if (currentQuestionIndex === index) {
            currentQuestionIndex = questions.length > 0 ? 0 : null;
        } else if (currentQuestionIndex > index) {
            currentQuestionIndex--;
        }
        renderQuestions();
        renderCurrentQuestion();
        showToast('Pergunta excluída', 'error');
    }
}

function selectQuestion(index) {
    currentQuestionIndex = index;
    renderQuestions();
    renderCurrentQuestion();
}

function updateQuestion(value) {
    if (currentQuestionIndex !== null) {
        questions[currentQuestionIndex].text = value;
    }
}

function addOption() {
    if (currentQuestionIndex !== null) {
        questions[currentQuestionIndex].options.push({ text: '', isCorrect: false });
        renderCurrentQuestion();
        showToast('Nova opção adicionada');
    }
}

function updateOption(questionIndex, optionIndex, value) {
    questions[questionIndex].options[optionIndex].text = value;
}

function toggleCorrectOption(questionIndex, optionIndex) {
    questions[questionIndex].options.forEach((option, index) => {
        option.isCorrect = index === optionIndex;
    });
    renderCurrentQuestion();
    showToast('Resposta correta atualizada');
}

function deleteOption(questionIndex, optionIndex) {
    if (questions[questionIndex].options.length > 1) {
        questions[questionIndex].options.splice(optionIndex, 1);
        renderCurrentQuestion();
        showToast('Opção excluída', 'error');
    } else {
        showToast('A pergunta deve ter pelo menos uma opção de resposta', 'error');
    }
}

function validateQuiz() {
    const errors = [];
    
    questions.forEach((question, index) => {
        if (!question.text.trim()) {
            errors.push(`Pergunta ${index + 1} está vazia`);
        }
        
        const emptyOptions = question.options.some(option => !option.text.trim());
        if (emptyOptions) {
            errors.push(`Pergunta ${index + 1} tem opções vazias`);
        }
        
        const hasCorrectOption = question.options.some(option => option.isCorrect);
        if (!hasCorrectOption) {
            errors.push(`Pergunta ${index + 1} não tem uma resposta correta marcada`);
        }
    });
    
    return errors;
}

function previewQuiz() {
    const errors = validateQuiz();
    if (errors.length > 0) {
        showToast(errors[0], 'error');
        return;
    }
    
    const modal = document.getElementById('previewModal');
    const preview = questions.map((question, qIndex) => `
        <div class="preview-question">
            <h3>Pergunta ${qIndex + 1}</h3>
            <p>${question.text}</p>
            <div class="preview-options">
                ${question.options.map((option, oIndex) => `
                    <div class="preview-option">
                        <input type="radio" 
                               name="question${qIndex}" 
                               id="q${qIndex}o${oIndex}"
                               ${option.isCorrect ? 'checked' : ''}>
                        <label for="q${qIndex}o${oIndex}">${option.text}</label>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Prévia do Quiz</h2>
            ${preview}
            <button onclick="closePreview()" class="preview-close">Fechar</button>
        </div>
    `;
    
    modal.className = 'modal show';
}

function closePreview() {
    const modal = document.getElementById('previewModal');
    modal.className = 'modal';
}

function saveQuiz() {
    const errors = validateQuiz();
    
    if (errors.length > 0) {
        showToast(errors[0], 'error');
        return;
    }
    
    // Here you would typically save to a backend
    showToast('Quiz salvo com sucesso!');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Initialize with one empty question
if (questions.length === 0) {
    addQuestion();
}

// Add input event listener
document.getElementById('questionInput').addEventListener('input', (e) => {
    updateQuestion(e.target.value);
});