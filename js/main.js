// Guardião Digital - Main Logic 3.0
// Com novas ferramentas e funcionalidades

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    initGlobal();

    if (path.includes('ferramentas.html')) {
        initTools();
    } else if (path.includes('aprendizado.html')) {
        initLearning();
    } else {
        initIndex();
    }
});

function showResult(element, type, message) {
    element.className = `result-box ${type} animate-fade-in`;
    const icon = type === 'safe' ? '✅' : (type === 'warning' ? '⚠️' : '🚨');
    const title = type === 'safe' ? 'Parece Seguro' : (type === 'warning' ? 'Atenção' : 'Risco Detectado');
    element.setAttribute('role', 'status');
    element.setAttribute('aria-live', 'polite');
    element.innerHTML = `
            <h4>${icon} ${title}</h4>
            <p>${message}</p>
        `;
    const firstFocusable = element.querySelector('h4');
    if (firstFocusable) firstFocusable.tabIndex = -1;
    if (firstFocusable) firstFocusable.focus();
}

function initGlobal() {
    const links = document.querySelectorAll('.legal-link');
    links.forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = a.dataset.target;
            const overlay = document.getElementById(target);
            if (!overlay) return;
            overlay.classList.remove('hidden');
            overlay.setAttribute('aria-hidden', 'false');
            const title = overlay.querySelector('h3');
            if (title) {
                title.tabIndex = -1;
                title.focus();
            }
        });
    });

    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.close;
            const overlay = document.getElementById(id);
            if (!overlay) return;
            overlay.classList.add('hidden');
            overlay.setAttribute('aria-hidden', 'true');
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(m => {
                if (!m.classList.contains('hidden')) {
                    m.classList.add('hidden');
                    m.setAttribute('aria-hidden', 'true');
                }
            });
        }
    });

    const emergencyTabs = document.querySelectorAll('#emergency-tabs .tab-btn');
    const panels = document.querySelectorAll('.emergency-panel');
    if (emergencyTabs.length) {
        emergencyTabs.forEach(btn => {
            btn.addEventListener('click', () => {
                emergencyTabs.forEach(b => b.classList.remove('active'));
                emergencyTabs.forEach(b => b.setAttribute('aria-selected', 'false'));
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                const target = btn.dataset.target;
                panels.forEach(p => p.classList.add('hidden'));
                panels.forEach(p => p.setAttribute('aria-hidden', 'true'));
                const panel = document.getElementById(target);
                if (panel) {
                    panel.classList.remove('hidden');
                    panel.setAttribute('aria-hidden', 'false');
                }
            });
        });
    }

    const copyBtns = document.querySelectorAll('.copy-instructions-btn');
    if (copyBtns.length) {
        copyBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.panel;
                const panel = document.getElementById(id);
                if (!panel) return;
                const steps = panel.querySelectorAll('.emergency-step');
                const text = Array.from(steps).map(s => s.innerText.trim()).join('\n\n');
                let ok = false;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    try { await navigator.clipboard.writeText(text); ok = true; } catch {}
                }
                if (!ok) {
                    const ta = document.createElement('textarea');
                    ta.value = text;
                    document.body.appendChild(ta);
                    ta.select();
                    try { ok = document.execCommand('copy'); } catch { ok = false; }
                    document.body.removeChild(ta);
                }
                const original = btn.textContent;
                btn.textContent = ok ? 'Copiado!' : 'Falha ao copiar';
                setTimeout(() => { btn.textContent = original; }, 2000);
            });
        });
    }
}

// --- Tools Page Logic ---
function initTools() {
    const toolButtons = document.querySelectorAll('.tool-btn');
    const toolDisplay = document.getElementById('tool-display');
    const toolContent = document.getElementById('tool-content');
    const closeToolBtn = document.getElementById('close-tool');
    const toolsGrid = document.getElementById('tools-grid');

    // Tool Data
    const tools = {
        message: {
            title: 'Verificar Mensagem',
            html: `
                <div class="tool-inner">
                    <p>Escreva a mensagem que você recebeu para verificar se pode ser golpe.</p>
                    <div class="input-group">
                        <input type="text" id="tool-input" placeholder="Ex: Oi vó, faz um PIX urgente pra mim" />
                        <button id="tool-action" class="btn btn-primary">Verificar</button>
                    </div>
                    <div id="tool-result" class="result-box hidden"></div>
                </div>
            `
        },
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
                        <small style="color: var(--color-text-light);">Como enviar: toque para selecionar a imagem do seu aparelho e aguarde a análise.</small>
                    </div>
                    <div id="tool-result" class="result-box hidden"></div>
                </div>
            `
        },
        file: {
            title: 'Verificador de Arquivos',
            html: `
                <div class="tool-inner">
                    <p>Envie um arquivo para checar se é seguro (simulação).</p>
                    <div class="input-group">
                        <input type="file" id="file-input" />
                        <button id="file-action" class="btn btn-primary">Analisar</button>
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
        if (id === 'link' || id === 'news' || id === 'password' || id === 'message') {
            document.getElementById('tool-action').addEventListener('click', () => analyzeText(id));
        } else if (id === 'voice') {
            document.getElementById('mic-btn').addEventListener('click', simulateVoice);
        } else if (id === 'print') {
            const dz = document.getElementById('drop-zone');
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.id = 'print-file-input';
            fileInput.style.display = 'none';
            dz.parentElement.appendChild(fileInput);
            dz.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', processPrintFile);
            dz.addEventListener('dragenter', (e) => { e.preventDefault(); dz.classList.add('drag'); });
            dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('drag'); });
            dz.addEventListener('dragleave', (e) => { e.preventDefault(); dz.classList.remove('drag'); });
            dz.addEventListener('drop', (e) => { e.preventDefault(); dz.classList.remove('drag'); const files = e.dataTransfer?.files; if (files && files.length) processPrintFiles(files); });
        } else if (id === 'file') {
            document.getElementById('file-action').addEventListener('click', simulateFile);
        } else if (id === 'checklist') {
            setupChecklistPersistence();
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

        if (type === 'password') {
            passwordFlow(input, resultBox);
            return;
        }

        setTimeout(() => {
            let safe = true;
            let msg = "Parece seguro. Mas sempre confirme a fonte oficial.";
            let statusClass = 'safe';

            if (type === 'link') {
                const r = analyzeLinkAdvanced(input);
                statusClass = r.status;
                msg = [r.summary, r.reasons.length ? 'Motivos: ' + r.reasons.map(x => '• ' + x).join(' | ') : '', r.tips.length ? 'Dicas: ' + r.tips.map(x => '• ' + x).join(' | ') : ''].filter(Boolean).join('<br><br>');
                safe = r.status === 'safe';
                enhanceLinkWithOptionalApi(input, resultBox);
            } else if (type === 'news') {
                const r = analyzeNewsAdvanced(input);
                statusClass = r.status;
                msg = [r.summary, r.reasons.length ? 'Motivos: ' + r.reasons.map(x => '• ' + x).join(' | ') : '', r.tips.length ? 'Dicas: ' + r.tips.map(x => '• ' + x).join(' | ') : ''].filter(Boolean).join('<br><br>');
                safe = r.status === 'safe';
                enhanceNewsWithOptionalApi(input, resultBox);
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
            } else if (type === 'message') {
                const res = analyzeMessageAdvanced(input);
                statusClass = res.status;
                msg = [res.summary, res.reasons.length ? 'Motivos: ' + res.reasons.map(r => '• ' + r).join(' | ') : '', res.tips.length ? 'Dicas: ' + res.tips.map(t => '• ' + t).join(' | ') : '', res.actions.length ? 'Ações: ' + res.actions.map(a => '• ' + a).join(' | ') : ''].filter(Boolean).join('<br><br>');
                safe = res.status === 'safe';
            }

            showResult(resultBox, statusClass, msg);
            if (statusClass === 'danger' && (type === 'message' || type === 'link' || type === 'news')) {
                appendReportCTA(resultBox);
            }
            if (type === 'message') {
                const url = extractFirstUrl(input);
                if (url) {
                    const cta = document.createElement('button');
                    cta.className = 'btn btn-secondary';
                    cta.textContent = 'Abrir Verificador de Link';
                    cta.style.marginTop = '0.75rem';
                    cta.addEventListener('click', () => { openTool('link', tools['link']); setTimeout(() => { const ti = document.getElementById('tool-input'); if (ti) ti.value = url; }, 120); });
                    resultBox.appendChild(cta);
                }
                appendShareButtons(resultBox, stripHtml(msg));
                enhanceMessageWithAI(input, resultBox, statusClass);
            }
            if (type === 'news') {
                const url = extractFirstUrl(input);
                if (url) {
                    const cta = document.createElement('button');
                    cta.className = 'btn btn-secondary';
                    cta.textContent = 'Abrir Verificador de Link';
                    cta.style.marginTop = '0.75rem';
                    cta.addEventListener('click', () => { openTool('link', tools['link']); setTimeout(() => { const ti = document.getElementById('tool-input'); if (ti) ti.value = url; }, 120); });
                    resultBox.appendChild(cta);
                }
                appendShareButtons(resultBox, stripHtml(msg));
            }
        }, 800);
    }

    function simulateVoice() {
        const btn = document.getElementById('mic-btn');
        const status = document.getElementById('mic-status');
        const resultBox = document.getElementById('tool-result');
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SR) {
            const rec = new SR();
            rec.lang = 'pt-BR';
            rec.interimResults = false;
            rec.maxAlternatives = 1;
            rec.onstart = () => { btn.classList.add('listening'); status.textContent = 'Ouvindo...'; };
            rec.onerror = () => { btn.classList.remove('listening'); status.textContent = 'Erro de microfone'; };
            rec.onend = () => { btn.classList.remove('listening'); };
            rec.onresult = (e) => {
                status.textContent = 'Processando...';
                const transcript = e.results[0][0].transcript || '';
                const res = analyzeMessageAdvanced(transcript);
                resultBox.classList.remove('hidden');
                const msg = [res.summary, res.reasons.length ? 'Motivos: ' + res.reasons.map(r => '• ' + r).join(' | ') : '', res.tips.length ? 'Dicas: ' + res.tips.map(t => '• ' + t).join(' | ') : ''].filter(Boolean).join('<br><br>');
                showResult(resultBox, res.status, msg);
                if (res.status === 'danger') appendReportCTA(resultBox);
                enhanceMessageWithAI(transcript, resultBox, res.status);
                status.textContent = 'Toque para falar';
            };
            rec.start();
            return;
        }
        const fallback = "Pedido de dinheiro urgente via mensagem de voz. Ligue para o número antigo da pessoa.";
        const res = analyzeMessageAdvanced(fallback);
        resultBox.classList.remove('hidden');
        const msg = [res.summary, res.reasons.length ? 'Motivos: ' + res.reasons.map(r => '• ' + r).join(' | ') : '', res.tips.length ? 'Dicas: ' + res.tips.map(t => '• ' + t).join(' | ') : ''].filter(Boolean).join('<br><br>');
        showResult(resultBox, res.status, msg);
        if (res.status === 'danger') appendReportCTA(resultBox);
        enhanceMessageWithAI(fallback, resultBox, res.status);
        status.textContent = 'Toque para falar';
    }

    async function processPrintFile(e) {
        const resultBox = document.getElementById('tool-result');
        resultBox.classList.remove('hidden');
        const files = e.target.files;
        if (!files || files.length === 0) {
            showResult(resultBox, 'warning', 'Selecione uma imagem (print/comprovante) para análise.');
            return;
        }
        const file = files[0];
        showResult(resultBox, 'warning', 'Extraindo texto da imagem (OCR)...');

        const ok = await loadTesseract();
        if (!ok || !window.Tesseract) {
            showResult(resultBox, 'warning', 'Falha ao carregar OCR. Tente novamente ou envie imagem mais nítida.');
            return;
        }

        try {
            const { data } = await Tesseract.recognize(file, 'por+eng', { logger: () => {} });
            const text = (data && data.text) ? data.text : '';
            if (!text.trim()) {
                showResult(resultBox, 'warning', 'Não foi possível ler o texto do print. Verifique foco/iluminação e tente novamente.');
                return;
            }
            const analysis = analyzeOcrText(text);
            const message = [
                analysis.summary,
                analysis.reasons.length ? 'Motivos: ' + analysis.reasons.map(r => '• ' + r).join(' | ') : '',
                analysis.tips.length ? 'Dicas: ' + analysis.tips.map(t => '• ' + t).join(' | ') : ''
            ].filter(Boolean).join('<br><br>');
            showResult(resultBox, analysis.status, message);
            appendShareButtons(resultBox, stripHtml(message));
            appendOcrHighlights(resultBox, text);
            if (analysis.status === 'danger') appendReportCTA(resultBox);
        } catch (err) {
            showResult(resultBox, 'warning', 'Erro ao analisar a imagem. Tente novamente com outro print.');
        }
    }

    async function processPrintFiles(files) {
        const fakeEvent = { target: { files } };
        await processPrintFile(fakeEvent);
    }

    function loadTesseract() {
        return new Promise((resolve) => {
            if (window.Tesseract) return resolve(true);
            const s = document.createElement('script');
            s.src = 'https://unpkg.com/tesseract.js@v2.1.5/dist/tesseract.min.js';
            s.onload = () => resolve(true);
            s.onerror = () => resolve(false);
            document.body.appendChild(s);
        });
    }

    function analyzeOcrText(text) {
        const raw = text || '';
        const lower = raw.toLowerCase();
        const norm = lower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const reasons = [];
        const tips = [];
        let score = 0;

        const hasPix = norm.includes('pix') || norm.includes('copia e cola');
        const hasBenef = norm.includes('beneficiario') || norm.includes('favorecido');
        const hasCnpj = norm.includes('cnpj') || /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/.test(raw);
        const hasCpf = norm.includes('cpf') || /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/.test(raw);
        const hasBanco = norm.includes('banco') || norm.includes('agencia') || norm.includes('conta');
        const hasVenc = norm.includes('vencimento') || norm.includes('data');
        const hasValor = norm.includes('valor') || /r\$\s?\d+[\.,]?\d*/i.test(raw);

        if (!hasBenef) { score += 2; reasons.push('Beneficiário/Favorecido não identificado'); }
        if (!hasCnpj && !hasCpf) { score += 2; reasons.push('CNPJ/CPF ausente'); }
        if (!hasBanco) { score += 1; reasons.push('Dados bancários pouco claros'); }
        if (!hasVenc) { score += 1; reasons.push('Vencimento/Data não visível'); }
        if (!hasValor) { score += 1; reasons.push('Valor não identificado'); }
        if (hasPix) { score += 1; reasons.push('Pagamento por PIX identificado'); }

        tips.push('Compare beneficiário e CNPJ/CPF com dados oficiais');
        tips.push('Gere boletos apenas pelo app/site oficial');
        if (hasPix) tips.push('Confirme a chave e o recebedor no app oficial antes de pagar');

        let status = 'warning';
        let summary = 'Análise preliminar: verifique os dados do comprovante antes de pagar.';
        if (score >= 5) { status = 'danger'; summary = 'Risco de golpe: dados incompletos/inconsistentes no print.'; }
        if (score <= 2) { status = 'safe'; summary = 'Não encontramos sinais fortes de risco, confirme mesmo assim.'; }

        return { status, summary, reasons, tips };
    }

    function extractFirstUrl(text) {
        const m = (text || '').match(/https?:\/\/\S+|www\.\S+/i);
        return m ? m[0] : '';
    }

    function stripHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    function appendShareButtons(resultBox, plain) {
        if (!plain) return;
        const wrap = document.createElement('div');
        wrap.style.marginTop = '0.75rem';
        wrap.style.display = 'flex';
        wrap.style.gap = '0.5rem';
        const wa = document.createElement('a');
        wa.className = 'btn btn-outline';
        wa.href = 'https://wa.me/?text=' + encodeURIComponent(plain);
        wa.target = '_blank';
        wa.rel = 'noopener';
        wa.textContent = 'Compartilhar no WhatsApp';
        const email = document.createElement('a');
        email.className = 'btn btn-outline';
        email.href = 'mailto:?subject=Alerta de segurança&body=' + encodeURIComponent(plain);
        email.textContent = 'Enviar por Email';
        wrap.appendChild(wa);
        wrap.appendChild(email);
        resultBox.appendChild(wrap);
    }

    function appendOcrHighlights(resultBox, text) {
        if (!text) return;
        const wrap = document.createElement('div');
        wrap.style.marginTop = '0.5rem';
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline';
        btn.textContent = 'Ver trechos detectados';
        const box = document.createElement('div');
        box.style.marginTop = '0.5rem';
        box.style.background = '#f8fafc';
        box.style.border = '1px solid #dbe3ef';
        box.style.borderRadius = '12px';
        box.style.padding = '0.75rem';
        box.style.display = 'none';
        const items = [];
        const sn = (rgx) => {
            const m = text.match(rgx);
            if (!m) return '';
            const idx = m.index || 0;
            const start = Math.max(0, idx - 30);
            const end = Math.min(text.length, idx + 60);
            return text.slice(start, end).replace(/\n+/g, ' ');
        };
        const map = [
            { label: 'PIX/Chave', rx: /(pix|copia e cola)/i },
            { label: 'Beneficiário', rx: /(beneficiário|favorecido)\s*[:\-]?\s*\S+/i },
            { label: 'CNPJ', rx: /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/ },
            { label: 'CPF', rx: /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/ },
            { label: 'Banco/Agência/Conta', rx: /(banco|ag[eê]ncia|conta)\s*\S+/i },
            { label: 'Vencimento/Data', rx: /(vencimento|data)\s*\S+/i },
            { label: 'Valor', rx: /(valor)\s*[:\-]?\s*r\$\s?\d+[\.,]?\d*/i }
        ];
        map.forEach(m => {
            const snippet = sn(m.rx);
            if (snippet) items.push(m.label + ': ' + snippet);
        });
        if (items.length) {
            const ul = document.createElement('ul');
            ul.style.margin = 0;
            ul.style.paddingLeft = '1rem';
            items.forEach(t => { const li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
            box.appendChild(ul);
            btn.addEventListener('click', () => { box.style.display = box.style.display === 'none' ? 'block' : 'none'; });
            wrap.appendChild(btn);
            wrap.appendChild(box);
            resultBox.appendChild(wrap);
        }
    }

    function appendReportCTA(resultBox) {
        const a = document.createElement('a');
        a.className = 'btn btn-danger';
        a.href = 'https://delegaciavirtual.sinesp.gov.br/';
        a.target = '_blank';
        a.rel = 'noopener';
        a.style.marginTop = '0.75rem';
        a.textContent = 'Registrar BO na Delegacia Virtual';
        resultBox.appendChild(a);
    }

    function simulateFile() {
        const input = document.getElementById('file-input');
        const resultBox = document.getElementById('tool-result');
        resultBox.classList.remove('hidden');
        if (!input || !input.files || input.files.length === 0) {
            showResult(resultBox, 'warning', 'Selecione um arquivo para análise.');
            return;
        }
        const file = input.files[0];
        const name = file.name.toLowerCase();
        setTimeout(() => {
            if (name.endsWith('.exe') || name.endsWith('.apk') || name.includes('nota_fiscal.zip')) {
                showResult(resultBox, 'danger', 'Risco detectado: tipo de arquivo potencialmente perigoso ou nome suspeito.');
                appendReportCTA(resultBox);
            } else {
                showResult(resultBox, 'safe', 'Não encontramos sinais suspeitos. Ainda assim, abra apenas arquivos de fontes confiáveis.');
            }
        }, 1200);
    }

    function setupChecklistPersistence() {
        const container = document.getElementById('checklist-items');
        if (!container) return;
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        const key = 'gd_checklist_state';
        const saved = localStorage.getItem(key);
        if (saved) {
            const state = JSON.parse(saved);
            checkboxes.forEach((cb, idx) => { cb.checked = !!state[idx]; });
        }
        checkboxes.forEach((cb, idx) => {
            cb.addEventListener('change', () => {
                const state = Array.from(checkboxes).map(c => c.checked);
                localStorage.setItem(key, JSON.stringify(state));
            });
        });
    }

    function analyzeMessageAdvanced(text) {
        const raw = text || '';
        const lower = raw.toLowerCase();
        const norm = lower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const reasons = [];
        const tips = [];
        const actions = [];
        let score = 0;

        const kw = ['pix','premio','taxa','senha','codigo','token','brinde','gratis','urgente','agora','imediato','confidencial','sigilo','novo numero','link','clique','motoboy','moto boy','cartao','cartão','trocar cartao','trocar cartão','recolher','coletar','bloqueado','cancelado','funcionario','funcionário','gerente do banco','falsa central'];
        kw.forEach(k => { if (norm.includes(k)) score += 2; });

        const impersonationWords = ['mae','pai','avo','avo','neto','filho','familia'];
        const hasImpersonation = impersonationWords.some(w => norm.includes(w)) && norm.includes('novo numero');
        if (hasImpersonation) { score += 4; reasons.push('Possível falso parente com número novo'); }

        const moneyPattern = /(r\$\s?\d+[\.,]?\d*|\d+\s?reais|\d+\s?mil)/i;
        if (moneyPattern.test(lower)) { score += 2; reasons.push('Pedido envolvendo valores'); }

        const linkPattern = /(https?:\/\/|www\.|[a-z0-9.-]+\.[a-z]{2,})(\/\S*)?/i;
        const hasLink = linkPattern.test(raw);
        if (hasLink) { score += 2; reasons.push('Mensagem contém link'); actions.push('Abrir Verificador de Link e conferir o endereço'); }

        if (norm.includes('nao ligue') || norm.includes('nao conte')) { score += 3; reasons.push('Solicitação de sigilo'); }
        if (norm.includes('banco') || norm.includes('gerente')) { score += 2; reasons.push('Cita banco ou gerente'); }
        const motoboyFlow = (norm.includes('motoboy') || norm.includes('moto boy')) && (norm.includes('cartao')) && (norm.includes('trocar') || norm.includes('recolher') || norm.includes('coletar'));
        if (motoboyFlow) {
            score += 6;
            reasons.push('Golpe do motoboy para recolher/trocar cartão');
            actions.push('Não entregue seu cartão');
            actions.push('Desligue e ligue para o banco oficial');
        }
        if (norm.includes('premio') || norm.includes('ganhou')) { tips.push('Desconfie de prêmios e sorteios sem inscrição'); }

        if (!raw.trim()) return { status: 'warning', summary: 'Digite a mensagem para analisarmos.', reasons: [], tips: [], actions: [] };

        let status = 'safe';
        let summary = 'Parece seguro, mas confirme a identidade e a fonte.';
        if (score >= 7) { status = 'danger'; summary = 'Risco alto de golpe. Confirme em canais oficiais e com familiares.'; }
        else if (score >= 4) { status = 'warning'; summary = 'Sinais de alerta. Verifique antes de agir.'; }

        tips.push('Sempre confirme pelo número antigo da pessoa');
        tips.push('Nunca compartilhe senhas ou códigos');
        if (norm.includes('pix')) tips.push('Evite transferências sob pressão; ligue para um familiar');

        return { status, summary, reasons, tips, actions };
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

    const extra = `Você marcou ${checked} de ${total} itens de segurança.`;
    const tip = percentage < 100 ? 'Dica: Mostre este resultado para um familiar e peça ajuda nos itens faltantes.' : '';
    const fullMessage = [message, extra, tip].filter(Boolean).join('<br><br>');
    showResult(resultBox, type, fullMessage);
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
function initIndex() {
    document.querySelectorAll('.stat-card[role="button"]').forEach(card => {
        const info = card.querySelector('.stat-info');
        const toggle = () => {
            if (!info) return;
            const isHidden = info.classList.contains('hidden');
            if (isHidden) {
                info.classList.remove('hidden');
                card.setAttribute('aria-expanded', 'true');
            } else {
                info.classList.add('hidden');
                card.setAttribute('aria-expanded', 'false');
            }
        };
        card.addEventListener('click', toggle);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
    });

}
    async function passwordFlow(pwd, resultBox) {
        await loadZxcvbn();
        let status = 'safe';
        let reasons = [];
        let tips = [];
        let summary = 'Senha parece adequada.';
        if (window.zxcvbn) {
            const r = zxcvbn(pwd);
            if (r.score <= 2) { status = 'warning'; summary = 'Senha mediana.'; }
            if (r.score <= 1) { status = 'danger'; summary = 'Senha fraca.'; }
            if (r.feedback && r.feedback.suggestions) tips = tips.concat(r.feedback.suggestions);
            reasons.push('Força estimada: ' + r.score + '/4');
        }
        const leakedCount = await checkPwnedPassword(pwd);
        if (leakedCount > 0) { status = 'danger'; reasons.push('Aparece em vazamentos (' + leakedCount + ' vezes)'); tips.push('Troque imediatamente e ative verificação em duas etapas'); }
        const msg = [summary, reasons.length ? 'Motivos: ' + reasons.map(x => '• ' + x).join(' | ') : '', tips.length ? 'Dicas: ' + tips.map(x => '• ' + x).join(' | ') : ''].filter(Boolean).join('<br><br>');
        showResult(resultBox, status, msg);
    }

    function loadZxcvbn() {
        return new Promise((resolve) => {
            if (window.zxcvbn) return resolve(true);
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/zxcvbn@4.4.2/dist/zxcvbn.js';
            s.onload = () => resolve(true);
            s.onerror = () => resolve(false);
            document.body.appendChild(s);
        });
    }

    async function checkPwnedPassword(pwd) {
        try {
            const enc = new TextEncoder();
            const buf = await crypto.subtle.digest('SHA-1', enc.encode(pwd));
            const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
            const prefix = hex.slice(0, 5);
            const suffix = hex.slice(5);
            const res = await fetch('https://api.pwnedpasswords.com/range/' + prefix);
            const txt = await res.text();
            const lines = txt.split('\n');
            for (const line of lines) {
                const [suf, count] = line.split(':');
                if (suf === suffix) return parseInt(count, 10) || 0;
            }
            return 0;
        } catch { return 0; }
    }

    function analyzeLinkAdvanced(url) {
        const u = (url || '').trim();
        const lower = u.toLowerCase();
        const reasons = [];
        const tips = [];
        let score = 0;
        if (!lower.startsWith('https://')) { score += 3; reasons.push('Sem HTTPS (cadeado)'); tips.push('Prefira sites com HTTPS'); }
        if (lower.includes('@')) { score += 2; reasons.push('Uso de @ na URL'); }
        if (/^https?:\/\/[0-9.]+/.test(lower)) { score += 2; reasons.push('URL com IP em vez de domínio'); }
        if (/(bit\.ly|tinyurl\.com|goo\.gl|t\.co|ow\.ly)/.test(lower)) { score += 2; reasons.push('Link encurtado'); tips.push('Expanda o link antes de abrir'); }
        const domainMatch = lower.match(/^https?:\/\/([^\/?#]+)/);
        const domain = domainMatch ? domainMatch[1] : '';
        if (domain.split('.').length > 3) { score += 1; reasons.push('Muitos subdomínios'); }
        if (/(ru|cn|tk|ml|ga|cf)$/i.test(domain)) { score += 1; reasons.push('TLD incomum'); }
        if (/(promo|gratis|ganhe|premio)/.test(lower)) { score += 2; reasons.push('Palavras de isca'); }
        tips.push('Verifique o endereço no navegador antes de digitar dados');
        let status = 'safe';
        let summary = 'Endereço parece adequado. Confirme a origem.';
        if (score >= 6) { status = 'danger'; summary = 'Risco alto: sinais de phishing/malware.'; }
        else if (score >= 3) { status = 'warning'; summary = 'Sinais de alerta: verifique com calma.'; }
        return { status, summary, reasons, tips };
    }

    async function enhanceLinkWithOptionalApi(url, resultBox) {
        try {
            const cfg = window.guardianConfig && window.guardianConfig.linkApi;
            if (!cfg) return;
            const res = await fetch(cfg, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
            if (!res.ok) return;
            const data = await res.json();
            if (!data || !data.status) return;
            const extra = data.source ? 'Fonte: ' + data.source : '';
            const msg = [data.summary || '', data.reasons ? 'Motivos: ' + data.reasons.map(x => '• ' + x).join(' | ') : '', data.tips ? 'Dicas: ' + data.tips.map(x => '• ' + x).join(' | ') : '', extra].filter(Boolean).join('<br><br>');
            showResult(resultBox, data.status, msg);
        } catch {}
    }

    function analyzeNewsAdvanced(title) {
        const t = (title || '').toLowerCase();
        const reasons = [];
        const tips = [];
        let score = 0;
        if (/(urgente|choque|escandalo|surpreendente|imperdivel)/.test(t)) { score += 2; reasons.push('Sensacionalismo'); }
        if (/(compartilhe|repasse|agora)/.test(t)) { score += 2; reasons.push('Chamado para compartilhar'); }
        if (!/(fonte|portal|jornal|site)/.test(t)) { score += 1; reasons.push('Sem fonte clara'); }
        tips.push('Busque a notícia em portais confiáveis');
        let status = 'safe';
        let summary = 'Título parece adequado. Verifique a fonte.';
        if (score >= 4) { status = 'danger'; summary = 'Alto risco de fake news.'; }
        else if (score >= 2) { status = 'warning'; summary = 'Possível fake news. Verifique com cuidado.'; }
        return { status, summary, reasons, tips };
    }

    async function enhanceNewsWithOptionalApi(title, resultBox) {
        try {
            const cfg = window.guardianConfig && window.guardianConfig.factCheckApi;
            if (!cfg) return;
            const res = await fetch(cfg + '?q=' + encodeURIComponent(title));
            if (!res.ok) return;
            const data = await res.json();
            if (!data || !data.status) return;
            const refs = data.references ? 'Referências: ' + data.references.join(' | ') : '';
            const msg = [data.summary || '', data.reasons ? 'Motivos: ' + data.reasons.map(x => '• ' + x).join(' | ') : '', refs].filter(Boolean).join('<br><br>');
            showResult(resultBox, data.status, msg);
        } catch {}
    }

    async function enhanceMessageWithAI(text, resultBox, previousStatus) {
        try {
            const cfg = window.guardianConfig && window.guardianConfig.aiMessageApi;
            if (!cfg) return;
            const res = await fetch(cfg, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
            if (!res.ok) return;
            const data = await res.json();
            if (!data || !data.status) return;
            if (previousStatus !== 'danger' && data.status === 'danger') {
                const msg = [data.summary || 'Risco alto identificado pela análise avançada.', data.reasons ? 'Motivos: ' + data.reasons.map(r => '• ' + r).join(' | ') : '', data.tips ? 'Dicas: ' + data.tips.map(t => '• ' + t).join(' | ') : ''].filter(Boolean).join('<br><br>');
                showResult(resultBox, 'danger', msg);
                appendReportCTA(resultBox);
            }
        } catch {}
    }
