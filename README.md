# 🛡️ Guardião Digital

> Tecnologia simples e acessível para proteger a terceira idade contra golpes digitais.

O **Guardião Digital** é uma plataforma web projetada para ajudar idosos e pessoas com pouca familiaridade tecnológica a identificar ameaças cibernéticas comuns, como phishing, fake news e golpes de engenharia social.

## 🎯 Funcionalidades

O sistema opera em um modelo híbrido (Validação Local + Inteligência Artificial), oferecendo ferramentas intuitivas:

*   **💬 Verificador de Mensagens:** Analisa textos suspeitos (WhatsApp/SMS) detectando pedidos de dinheiro, falsos familiares e urgência artificial.
*   **📰 Detetive de Fake News:** Identifica notícias falsas, sensacionalistas ou com "terror burocrático" (ex: confisco de poupança).
*   **🔍 Verificador de Links:** Checa se um endereço de site é seguro, oficial ou uma tentativa de phishing.
*   **📄 Scanner de Arquivos:** Alerta sobre extensões perigosas (executáveis, compactados) que podem conter vírus.
*   **🖼️ Leitor de Prints (OCR):** Extrai texto de imagens (comprovantes, mensagens) para análise de segurança.
*   **🔑 Teste de Senha:** Avalia a força de senhas e verifica se já vazaram na internet.
*   **🚨 Botão de Pânico:** Guia passo-a-passo do que fazer caso tenha caído em um golpe (bloqueio de cartões, BO, etc.).

## 🚀 Como Usar

### Acesso Online
Acesse diretamente pelo navegador (Desktop ou Mobile). Não requer instalação de aplicativos.

### Execução Local (Desenvolvimento)

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/reinaldogramachof-hash/Guardiao_Digital.git
    ```

2.  **Frontend (Interface):**
    *   Basta abrir o arquivo `index.html` em qualquer navegador moderno.

3.  **Backend (Opcional - Para recursos de IA):**
    *   Necessário Node.js instalado.
    *   Entre na pasta `backend`:
        ```bash
        cd backend
        npm install
        npm start
        ```
    *   O servidor rodará em `http://localhost:8080`.

## 🔒 Segurança e Privacidade

*   **Privacidade em Primeiro Lugar:** As análises preliminares são feitas no próprio dispositivo do usuário (navegador), sem enviar dados para servidores externos sempre que possível.
*   **Sem Armazenamento:** Não salvamos mensagens, senhas ou arquivos enviados para análise.
*   **Código Aberto:** Transparência total sobre como as ferramentas funcionam.

## 🛠️ Tecnologias

*   **Frontend:** HTML5, CSS3, JavaScript (Vanilla).
*   **Backend:** Node.js, Express.
*   **IA:** Integração com APIs de LLM para análise contextual avançada.

---

**Versão Atual:** 3.1 (Gold Master)
*Última atualização de segurança: Novembro/2025*
