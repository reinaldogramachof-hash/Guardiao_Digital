// Guardião Digital - Main Logic 3.0
// Com novas ferramentas e funcionalidades

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('ferramentas.html')) {
        initTools();
    } else if (path.includes('aprendizado.html')) {
        initLearning();
    }
});

// --- Tools Page Logic ---
function initTools() {
    const toolButtons = document.querySelectorAll('.tool-btn');
    const toolDisplay = document.getElementById('tool-display');
    const toolContent = document.getElementById('tool-content');
    const closeToolBtn = document.getElementById('close-tool');
    const toolsGrid = document.getElementById('tools-grid');

    // Tool Data
    const tools = {
        link: {
            title: 'Verificador de Links',
            html: `
                <div class="tool-inner">
                    <p>Cole o link (endereço) que você recebeu para verificar se é seguro.</p>
                    <div class="input-group">
                        <input type="text" id="tool-input" placeholder="Ex: www.oferta-gratis.com" />
                        <button id="tool-action" class="btn btn-primary">Verificar</button>
                    </div>
                    <div id="tool-result" class="result-box hidden"></div>
                </div>
            `
        },
        password: {
            title: 'Testar Força da Senha',
            html: `
                <div class="tool-inner">
                    <p>Digite uma senha para ver se ela é forte. Não salvamos nada.</p>
                    <div class="input-group">
                        <input type="password" id="tool-input" placeholder="Digite sua senha aqui..." />
                        <button id="tool-action" class="btn btn-primary">Analisar</button>
                    </div>
                    <div id="tool-result" class="result-box hidden"></div>
                </div>
            `
        },
        print: {
            title: 'Analisar Print/Imagem',
            html: `
                <div class="tool-inner text-center">
                    <div id="drop-zone" class="drop-zone">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📸</div>
                        <p style="font-weight: bold; font-size: 1.2rem;">Toque aqui para enviar o Print/Foto</p>
                        <small style="color: var(--color-text-light);">Simulação de análise inteligente</small>
                    </div>
                    <div id="tool-result" class="result-box hidden"></div>
                </div>
            `
        },
        voice: {
            title: 'Auditor de Mensagem (Voz)',
            html: `
                <div class="tool-inner text-center">
                    <p>Clique no microfone e conte o que pediram para você.</p>
                    <button id="mic-btn" class="mic-btn">
                        🎤
                    </button>
                    <p id="mic-status" style="font-weight: bold; margin-top: 1rem;">Toque para falar</p>
                    <div id="tool-result" class="result-box hidden"></div>
                </div>
            `
        },
        news: {
            title: 'Detetive de Fake News',
            html: `
                <div class="tool-inner">
                    <p>Cole o título da notícia suspeita aqui:</p>
                    <div class="input-group">
                        <input type="text" id="tool-input" placeholder="Ex: URGENTE: Governo vai confiscar poupança..." />
                        <button id="tool-action" class="btn btn-primary">Verificar</button>
                    </div>
                    <div id="tool-result" class="result-box hidden"></div>
                </div>
            `
        },
        emergency: {
            title: 'Botão do Pânico - Emergência',
            html: `
                <div class="tool-inner">
                    <div style="background: #fef2f2; padding: 2rem; border-radius: 12px; border-left: 6px solid var(--color-danger);">
                        <h3 style="color: var(--color-danger); margin-bottom: 1rem;">🚨 FOI VÍTIMA DE GOLPE?</h3>
                        <div style="display: grid; gap: 1rem;">
                            <div class="emergency-step">
                                <strong>1. BLOQUEIE cartões:</strong>
                                <p>Ligue imediatamente para seu banco</p>
                            </div>
                            <div class="emergency-step">
                                <strong>2. REGISTRE BO:</strong>
                                <p>Delegacia Virtual ou presencial</p>
                            </div>
                            <div class="emergency-step">
                                <strong>3. CONTATOS ÚTEIS:</strong>
                                <p>📞 Polícia: 190<br>
                                   📞 Banco Central: 145<br>
                                   📞 Delegacia Idoso: (12) 3941-1400</p>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-primary" style="margin-top: 2rem; width: 100%;" onclick="window.location.href='tel:190'">
                        📞 Ligar para Polícia (190)
                    </button>
                </div>
            `
        },
        checklist: {
            title: 'Checklist de Segurança Digital',
            html: `
                <div class="tool-inner">
                    <p>Marque cada item que você já faz:</p>
                    <div id="checklist-items" style="display: grid; gap: 1rem; margin: 2rem 0;">
                        <label class="checklist-item">
                            <input type="checkbox"> Uso senhas diferentes em cada app
                        </label>
                        <label class="checklist-item">
                            <input type="checkbox"> Nunca compartilho senhas por telefone
                        </label>
                        <label class="checklist-item">
                            <input type="checkbox"> Desconfio de ofertas muito boas
                        </label>
                        <label class="checklist-item">
                            <input type="checkbox"> Sempre confirmo com familiares
                        </label>
                        <label class="checklist-item">
                            <input type="checkbox"> Mantenho apps atualizados
                        </label>
                    </div>
                    <div id="tool-result" class="result-box hidden"></div>
                    <button class="btn btn-primary" onclick="calculateChecklist()">Ver Meu Resultado</button>
                </div>
            `
        },
        contacts: {
            title: 'Contatos Seguros',
            html: `
                <div class="tool-inner">
                    <p>Cadastre números de pessoas confiáveis para emergências:</p>
                    <div style="background: #f0f9ff; padding: 2rem; border-radius: 12px; margin: 2rem 0;">
                        <h4 style="color: var(--color-primary); margin-bottom: 1rem;">📞 Contatos de Confiança</h4>
                        <div style="display: grid; gap: 1rem;">
                            <div class="input-group">
                                <input type="text" placeholder="Nome do familiar" style="flex: 2;">
                                <input type="text" placeholder="Telefone" style="flex: 1;">
                            </div>
                            <div class="input-group">
                                <input type="text" placeholder="Nome do familiar" style="flex: 2;">
                                <input type="text" placeholder="Telefone" style="flex: 1;">
                            </div>
                            <div class="input-group">
                                <input type="text" placeholder="Nome do familiar" style="flex: 2;">
                                <input type="text" placeholder="Telefone" style="flex: 1;">
                            </div>
                        </div>
                        <button class="btn btn-primary" style="margin-top: 1rem; width: 100%;">Salvar Contatos</button>
                    </div>
                    <div class="result-box safe">
                        <h4>💡 Dica Importante</h4>
                        <p>Compartilhe estes contatos com seus familiares. Em caso de dúvida sobre mensagens suspeitas, ligue para estas pessoas primeiro.</p>
                    </div>
                </div>
            `
        }
    };

    toolButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const toolId = btn.dataset.tool;
            openTool(toolId, tools[toolId]);
        });
    });

    if (closeToolBtn) {
        closeToolBtn.addEventListener('click', closeTool);
    }

    function openTool(id, data) {
        toolsGrid.classList.add('hidden');
        toolDisplay.classList.remove('hidden');
        document.getElementById('tool-title').textContent = data.title;
        toolContent.innerHTML = data.html;

        // Attach specific listeners
        if (id === 'link' || id === 'news' || id === 'password') {
            document.getElementById('tool-action').addEventListener('click', () => analyzeText(id));
        } else if (id === 'voice') {
            document.getElementById('mic-btn').addEventListener('click', simulateVoice);
        } else if (id === 'print') {
            document.getElementById('drop-zone').addEventListener('click', simulatePrint);
        }
    }

    function closeTool() {
        toolDisplay.classList.add('hidden');
        toolsGrid.classList.remove('hidden');
        toolContent.innerHTML = '';
    }

    // Simulation Logic
    function analyzeText(type) {
        const input = document.getElementById('tool-input').value;
        const resultBox = document.getElementById('tool-result');

        if (!input) return;

        resultBox.innerHTML = '<p>Analisando...</p>';
        resultBox.className = 'result-box';
        resultBox.classList.remove('hidden');

        setTimeout(() => {
            let safe = true;
            let msg = "Parece seguro. Mas sempre confirme a fonte oficial.";
            let statusClass = 'safe';

            if (type === 'link') {
                const lower = input.toLowerCase();
                if (lower.includes('gratis') || lower.includes('promo') || !lower.includes('https')) {
                    safe = false;
                    statusClass = 'danger';
                    msg = "CUIDADO: Link suspeito! Não possui cadeado (HTTPS) ou usa palavras de isca.";
                }
            } else if (type === 'news') {
                const lower = input.toLowerCase();
                if (lower.includes('urgente') || lower.includes('compartilhe') || lower.includes('segredo')) {
                    safe = false;
                    statusClass = 'danger';
                    msg = "ALERTA: Títulos sensacionalistas geralmente são Fake News. Verifique em portais oficiais.";
                }
            } else if (type === 'password') {
                if (input.length < 8) {
                    safe = false;
                    statusClass = 'danger';
                    msg = "FRACA: Muito curta. Use pelo menos 8 caracteres.";
                } else if (!/[A-Z]/.test(input) || !/[0-9]/.test(input)) {
                    safe = false;
                    statusClass = 'warning';
                    msg = "MÉDIA: Adicione letras maiúsculas e números para ficar mais forte.";
                } else {
                    safe = true;
                    statusClass = 'safe';
                    msg = "FORTE: Ótima senha! Lembre-se de não usar a mesma em tudo.";
                }
            }

            showResult(resultBox, statusClass, msg);
        }, 1000);
    }

    function simulateVoice() {
        const btn = document.getElementById('mic-btn');
        const status = document.getElementById('mic-status');
        const resultBox = document.getElementById('tool-result');

        btn.classList.add('listening');
        status.textContent = "Ouvindo...";

        setTimeout(() => {
            btn.classList.remove('listening');
            status.textContent = "Processando...";

            setTimeout(() => {
                status.textContent = "Toque para falar";
                resultBox.classList.remove('hidden');
                showResult(resultBox, 'danger', "ALERTA: O pedido de dinheiro urgente via WhatsApp é um golpe comum ('Falso Parente'). Ligue para o número antigo da pessoa.");
            }, 1000);
        }, 2000);
    }

    function simulatePrint() {
        const resultBox = document.getElementById('tool-result');
        resultBox.classList.remove('hidden');
        resultBox.innerHTML = '<p>Analisando imagem...</p>';

        setTimeout(() => {
            showResult(resultBox, 'danger', "ALERTA DE GOLPE: A fonte e o alinhamento deste comprovante não correspondem aos padrões bancários oficiais.");
        }, 2000);
    }

    function showResult(element, type, message) {
        element.className = `result-box ${type} animate-fade-in`;
        const icon = type === 'safe' ? '✅' : (type === 'warning' ? '⚠️' : '🚨');
        const title = type === 'safe' ? 'Parece Seguro' : (type === 'warning' ? 'Atenção' : 'Risco Detectado');

        element.innerHTML = `
            <h4>${icon} ${title}</h4>
            <p>${message}</p>
        `;
    }
}

// Nova função para o checklist
function calculateChecklist() {
    const checkboxes = document.querySelectorAll('#checklist-items input[type="checkbox"]');
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const total = checkboxes.length;
    const percentage = (checked / total) * 100;

    const resultBox = document.getElementById('tool-result');
    resultBox.classList.remove('hidden');

    let message, type;

    if (percentage >= 80) {
        type = 'safe';
        message = '🎉 Excelente! Você está muito bem protegido contra golpes.';
    } else if (percentage >= 50) {
        type = 'warning';
        message = '⚠️ Bom, mas pode melhorar. Revise os itens não marcados.';
    } else {
        type = 'danger';
        message = '🚨 Atenção! Sua segurança precisa de melhorias. Converse com um familiar.';
    }

    showResult(resultBox, type, `
        <h4>${message}</h4>
        <p>Você marcou ${checked} de ${total} itens de segurança.</p>
        ${percentage < 100 ? '<p><strong>Dica:</strong> Mostre este resultado para um familiar e peça ajuda nos itens faltantes.</p>' : ''}
    `);
}

// --- Learning Page Logic ---
function initLearning() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.learning-section');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.add('hidden'));

            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.remove('hidden');
        });
    });

    // Quiz Logic
    let currentQuestion = 0;
    let score = 0;
    const questions = [
        {
            q: "Um 'funcionário do banco' ligou pedindo sua senha. O que você faz?",
            opts: ["Passo a senha", "Desligo e ligo para o gerente", "Confirmo o CPF"],
            ans: 1
        },
        {
            q: "Mensagem: 'Você ganhou R$ 6.000 da prefeitura'. O que fazer?",
            opts: ["Clico no link", "Ignoro, é golpe", "Repasso para amigos"],
            ans: 1
        },
        {
            q: "O que é Engenharia Social?",
            opts: ["Curso superior", "Conserto de PC", "Arte de enganar para obter dados"],
            ans: 2
        },
        {
            q: "Recebi áudio de 'neto' pedindo dinheiro. O que faço?",
            opts: ["Transfiro rápido", "Ligo para o número antigo dele", "Pergunto no grupo da família"],
            ans: 1
        },
        {
            q: "Site pede CPF para dar prêmio. É seguro?",
            opts: ["Sim, todos pedem", "Não, é golpe", "Só se for site conhecido"],
            ans: 1
        }
    ];

    const quizContainer = document.getElementById('quiz-container');

    function renderQuiz() {
        if (currentQuestion >= questions.length) {
            let message, icon;
            if (score >= 4) {
                message = "Excelente! Você está muito bem informado sobre golpes digitais.";
                icon = "🏆";
            } else if (score >= 3) {
                message = "Bom! Você conhece os principais golpes, mas pode aprender mais.";
                icon = "👍";
            } else {
                message = "Atenção! É importante aprender mais sobre segurança digital.";
                icon = "📚";
            }

            quizContainer.innerHTML = `
                <div class="text-center animate-fade-in" style="padding: 3rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">${icon}</div>
                    <h3>${score >= 4 ? 'Parabéns!' : 'Quiz Concluído!'}</h3>
                    <p style="font-size: 1.2rem;">${message}</p>
                    <p style="font-size: 1.2rem;">Você acertou <strong style="color: var(--color-success)">${score}</strong> de ${questions.length} questões.</p>
                    <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 1rem;">Tentar Novamente</button>
                </div>
            `;
            return;
        }

        const q = questions[currentQuestion];
        let html = `
            <div class="quiz-card animate-fade-in">
                <div class="quiz-progress">
                    <span style="background: var(--color-accent-light); color: var(--color-accent-hover); padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.9rem;">Questão ${currentQuestion + 1} de ${questions.length}</span>
                </div>
                <h3 class="quiz-question">${q.q}</h3>
                <div class="quiz-options">
        `;

        q.opts.forEach((opt, idx) => {
            html += `<button class="btn quiz-opt" data-idx="${idx}">${opt}</button>`;
        });

        html += `</div></div>`;
        quizContainer.innerHTML = html;

        document.querySelectorAll('.quiz-opt').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selected = parseInt(e.target.dataset.idx);
                const isCorrect = selected === q.ans;

                if (isCorrect) {
                    score++;
                    e.target.style.background = '#dcfce7';
                    e.target.style.borderColor = '#16a34a';
                    e.target.innerHTML += ' ✅';
                } else {
                    e.target.style.background = '#fee2e2';
                    e.target.style.borderColor = '#dc2626';
                    e.target.innerHTML += ' ❌';

                    // Show correct answer
                    document.querySelectorAll('.quiz-opt')[q.ans].style.background = '#dcfce7';
                    document.querySelectorAll('.quiz-opt')[q.ans].style.borderColor = '#16a34a';
                    document.querySelectorAll('.quiz-opt')[q.ans].innerHTML += ' ✅';
                }

                // Disable all buttons
                document.querySelectorAll('.quiz-opt').forEach(b => {
                    b.disabled = true;
                    b.style.cursor = 'not-allowed';
                });

                setTimeout(() => {
                    currentQuestion++;
                    renderQuiz();
                }, 2500);
            });
        });
    }

    renderQuiz();
}