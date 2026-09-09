// ==========================================
// MARGEMLAB CORE & UTILS
// ==========================================
const AppState = { currentRoute: '' };

const ThemeManager = {
    init() {
        const isDark = localStorage.getItem('margemlab_theme') !== 'light';
        this.setTheme(isDark);
        document.querySelectorAll('.theme-toggle').forEach(btn => btn.addEventListener('click', () => this.toggle()));
    },
    toggle() { this.setTheme(!document.documentElement.classList.contains('dark')); },
    setTheme(isDark) {
        if(isDark) { document.documentElement.classList.add('dark'); localStorage.setItem('margemlab_theme', 'dark'); } 
        else { document.documentElement.classList.remove('dark'); localStorage.setItem('margemlab_theme', 'light'); }
    }
};

const ToastManager = {
    show(msg, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        const colors = {
            success: 'bg-base-900 dark:bg-base-100 text-base-50 dark:text-base-900',
            error: 'bg-red-500 text-white',
            info: 'bg-base-800 text-white'
        };
        toast.className = `flex items-center px-4 py-3 rounded-xl shadow-lg transition-all duration-300 translate-y-10 opacity-0 pointer-events-auto ${colors[type]}`;
        toast.innerHTML = `<span class="text-sm font-medium">${msg}</span>`;
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.remove('translate-y-10', 'opacity-0'));
        setTimeout(() => { toast.classList.add('translate-y-10', 'opacity-0'); setTimeout(() => toast.remove(), 300); }, 3000);
    }
};

const SharedUI = {
    layout(id, title, desc, mainContent, sideContent = null) {
        return `
            <div class="max-w-6xl mx-auto px-6 py-12 animate-fade-in" id="${id}">
                <div class="mb-10">
                    <a href="#home" class="inline-flex items-center text-sm font-medium text-base-500 hover:text-base-900 dark:hover:text-base-50 mb-6 transition-colors">
                        <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i> Explorar Ferramentas
                    </a>
                    <h1 class="text-3xl font-bold mb-2">${title}</h1>
                    <p class="text-base-500 text-sm max-w-xl">${desc}</p>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <div class="lg:col-span-${sideContent ? '7' : '12'} space-y-6">${mainContent}</div>
                    ${sideContent ? `<div class="lg:col-span-5 flex flex-col gap-6">${sideContent}</div>` : ''}
                </div>
            </div>
        `;
    }
};

const toolsData = [
    { id: "qrstudio", name: "QR Studio", description: "QR Codes premium vetoriais com controle de cores, logos e exportação avançada.", category: "Design", icon: "qr-code", hash: "#qrstudio", featured: true },
    { id: "margemzine", name: "Margem Zine", description: "Editor rápido de livretos e manifestos artísticos dobráveis (Formato 8 páginas).", category: "Publicação", icon: "book-open", hash: "#margemzine" },
    { id: "certifica", name: "Certifica", description: "Gerador profissional de certificados com suporte a lote (CSV), QR Code e assinaturas.", category: "Documentos", icon: "award", hash: "#certifica", featured: true },
    { id: "documenta", name: "Documenta", description: "Criação rápida de contratos, recibos e termos com smart fields automáticos.", category: "Documentos", icon: "file-text", hash: "#documenta" },
    { id: "texto", name: "Texto", description: "Ferramentas essenciais: contadores, formatadores, extratores e limpadores.", category: "Produtividade", icon: "type", hash: "#texto" },
    { id: "pdf", name: "Margem PDF", description: "Motor de processamento PDF local. Junte múltiplos arquivos instantaneamente.", category: "Documentos", icon: "file", hash: "#pdf" },
    { id: "imagem", name: "Imagem Lab", description: "Conversor e compressor rápido de imagens direto no navegador.", category: "Design", icon: "image", hash: "#imagem" },
    { id: "sorteador", name: "Sorteador", description: "Motor justo para decisões aleatórias, nomes, números e grupos.", category: "Produtividade", icon: "dices", hash: "#sorteador" }
];


// ==========================================
// 1. QR STUDIO (Preservado)
// ==========================================
const QRStudio = {
    render(container) {
        const main = `
            <div class="form-section space-y-6">
                <div>
                    <label class="block text-xs font-bold text-base-500 uppercase tracking-wider mb-2">Presets Rápidos</label>
                    <div class="flex flex-wrap gap-2">
                        <button class="qr-preset px-3 py-1.5 rounded-lg text-xs font-medium border border-base-200 dark:border-base-800 hover:bg-base-100 dark:hover:bg-base-800 transition-colors" data-preset="minimal">Minimal</button>
                        <button class="qr-preset px-3 py-1.5 rounded-lg text-xs font-medium border border-base-200 dark:border-base-800 hover:bg-base-100 dark:hover:bg-base-800 transition-colors" data-preset="brand">Brand Soft</button>
                        <button class="qr-preset px-3 py-1.5 rounded-lg text-xs font-medium border border-base-200 dark:border-base-800 hover:bg-base-100 dark:hover:bg-base-800 transition-colors" data-preset="neon">Neon</button>
                        <button class="qr-preset px-3 py-1.5 rounded-lg text-xs font-medium border border-base-200 dark:border-base-800 hover:bg-base-100 dark:hover:bg-base-800 transition-colors" data-preset="dark">Dark Tech</button>
                    </div>
                </div>
                <hr class="border-base-200 dark:border-base-800">
                <div>
                    <label class="block text-xs font-bold text-base-500 uppercase tracking-wider mb-2">Conteúdo</label>
                    <select id="qr-type" class="input-premium mb-3">
                        <option value="url">URL / Site</option>
                        <option value="text">Texto Livre</option>
                        <option value="wifi">Rede Wi-Fi</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="email">E-mail</option>
                        <option value="phone">Telefone</option>
                    </select>
                    <div id="qr-inputs-container" class="space-y-3"></div>
                </div>
                <hr class="border-base-200 dark:border-base-800">
                <div>
                    <label class="block text-xs font-bold text-base-500 uppercase tracking-wider mb-2">Estética e Cores</label>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label class="block text-[10px] font-semibold text-base-500 mb-1">Cor Primária</label>
                            <input type="color" id="qr-color-main" value="#000000" class="h-10 w-full rounded-lg cursor-pointer bg-transparent border border-base-200 dark:border-base-800 p-0.5">
                        </div>
                        <div>
                            <label class="block text-[10px] font-semibold text-base-500 mb-1">Cor do Fundo</label>
                            <input type="color" id="qr-color-bg" value="#ffffff" class="h-10 w-full rounded-lg cursor-pointer bg-transparent border border-base-200 dark:border-base-800 p-0.5">
                        </div>
                        <div class="col-span-2 md:col-span-1 flex items-center gap-2 mt-4 md:mt-0">
                            <input type="checkbox" id="qr-use-gradient" class="w-4 h-4 rounded border-base-300">
                            <label for="qr-use-gradient" class="text-xs font-medium">Usar Gradiente</label>
                        </div>
                    </div>
                    <div id="qr-gradient-panel" class="hidden grid grid-cols-2 gap-4 mb-4 p-4 bg-base-50 dark:bg-base-900/50 rounded-xl border border-base-200 dark:border-base-800">
                        <div>
                            <label class="block text-[10px] font-semibold text-base-500 mb-1">Cor Secundária</label>
                            <input type="color" id="qr-color-sec" value="#4f46e5" class="h-10 w-full rounded-lg cursor-pointer bg-transparent border border-base-200 dark:border-base-800 p-0.5">
                        </div>
                        <div>
                            <label class="block text-[10px] font-semibold text-base-500 mb-1">Tipo Gradiente</label>
                            <select id="qr-gradient-type" class="input-premium py-2">
                                <option value="linear">Linear</option>
                                <option value="radial">Radial</option>
                            </select>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-semibold text-base-500 mb-1">Padrão dos Pontos</label>
                            <select id="qr-dots" class="input-premium py-2">
                                <option value="square">Quadrados</option>
                                <option value="dots" selected>Arredondados</option>
                                <option value="rounded">Suave</option>
                                <option value="classy">Elegante</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] font-semibold text-base-500 mb-1">Cantos (Olhos)</label>
                            <select id="qr-corners" class="input-premium py-2">
                                <option value="square">Quadrado</option>
                                <option value="dot">Ponto</option>
                                <option value="extra-rounded" selected>Arredondado</option>
                            </select>
                        </div>
                    </div>
                </div>
                <hr class="border-base-200 dark:border-base-800">
                <div>
                    <label class="block text-xs font-bold text-base-500 uppercase tracking-wider mb-2">Logo & Margem</label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="flex flex-col items-center justify-center h-20 w-full bg-base-50 dark:bg-base-900/50 border border-dashed border-base-300 dark:border-base-700 rounded-xl cursor-pointer hover:bg-base-100 dark:hover:bg-base-800 transition-colors">
                                <i data-lucide="image-plus" class="w-5 h-5 mb-1 text-base-400"></i>
                                <span class="text-[10px] font-medium text-base-500">Enviar Logo</span>
                                <input type="file" id="qr-logo-input" accept="image/*" class="hidden">
                            </label>
                            <button id="qr-logo-remove" class="text-[10px] text-red-500 mt-1 hidden w-full text-center">Remover Logo</button>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <label class="flex justify-between text-[10px] font-semibold text-base-500 mb-1"><span>Tamanho da Logo</span><span id="lbl-logo-size">0.4</span></label>
                                <input type="range" id="qr-logo-size" min="0.1" max="0.6" step="0.1" value="0.4" class="w-full">
                            </div>
                            <div>
                                <label class="flex justify-between text-[10px] font-semibold text-base-500 mb-1"><span>Margem Externa</span><span id="lbl-margin">10px</span></label>
                                <input type="range" id="qr-margin" min="0" max="40" step="5" value="10" class="w-full">
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        const side = `<div class="form-section flex flex-col items-center justify-center py-10 min-h-[380px] bg-white rounded-2xl relative border-2 border-transparent transition-colors" id="qr-canvas-wrapper"><div id="qr-canvas-container" class="transition-transform duration-300 hover:scale-105 origin-center"></div></div><div><label class="block text-[10px] font-semibold text-base-500 mb-1 text-center">Correção de Erros</label><select id="qr-error" class="input-premium py-2 text-center"><option value="L">Baixa (7%)</option><option value="M">Média (15%)</option><option value="Q" selected>Alta (25%)</option><option value="H">Máxima (30%)</option></select></div><div class="grid grid-cols-2 gap-3 mt-2"><button id="qr-copy" class="btn-secondary"><i data-lucide="copy"></i> Copiar Imagem</button><button id="qr-download-png" class="btn-primary"><i data-lucide="download"></i> Baixar PNG</button></div>`;
        container.innerHTML = SharedUI.layout('qrstudio', 'QR Studio', 'Gerador offline premium.', main, side);
    },
    init() {
        let qrCode = new QRCodeStyling({ width: 300, height: 300, margin: 10, type: "canvas" });
        let currentLogoBase64 = null; let qrPayload = "https://margemlab.com";
        const el = (id) => document.getElementById(id);
        const typeSelect = el('qr-type'); const inputsContainer = el('qr-inputs-container');
        const renderInputs = () => {
            const type = typeSelect.value; let html = '';
            if(type === 'url') html = `<input type="url" id="qri-1" class="input-premium dynamic-qr-trigger" placeholder="https://seudominio.com" value="https://margemlab.com">`;
            else if(type === 'text') html = `<textarea id="qri-1" class="input-premium h-20 resize-none dynamic-qr-trigger" placeholder="Digite seu texto..."></textarea>`;
            else if(type === 'wifi') html = `<input type="text" id="qri-1" class="input-premium mb-2 dynamic-qr-trigger" placeholder="SSID"><input type="password" id="qri-2" class="input-premium mb-2 dynamic-qr-trigger" placeholder="Senha"><select id="qri-3" class="input-premium dynamic-qr-trigger"><option value="WPA">WPA/WPA2</option></select>`;
            else if(type === 'whatsapp') html = `<input type="tel" id="qri-1" class="input-premium mb-2 dynamic-qr-trigger" placeholder="DDI + Número"><input type="text" id="qri-2" class="input-premium dynamic-qr-trigger" placeholder="Mensagem">`;
            inputsContainer.innerHTML = html; document.querySelectorAll('.dynamic-qr-trigger').forEach(inp => inp.addEventListener('input', triggerUpdate)); triggerUpdate();
        };
        const triggerUpdate = () => {
            const type = typeSelect.value; const v1 = el('qri-1')?.value || ''; const v2 = el('qri-2')?.value || ''; const v3 = el('qri-3')?.value || '';
            qrPayload = (type === 'url' || type === 'text') ? (v1 || ' ') : (type === 'whatsapp' ? `https://wa.me/${v1.replace(/\D/g,'')}` : ' ');
            const mainColor = el('qr-color-main').value; const bgColor = el('qr-color-bg').value; const useGradient = el('qr-use-gradient').checked;
            el('qr-gradient-panel').style.display = useGradient ? 'grid' : 'none';
            const options = { data: qrPayload, margin: parseInt(el('qr-margin').value), qrOptions: { errorCorrectionLevel: el('qr-error').value }, backgroundOptions: { color: bgColor }, dotsOptions: { type: el('qr-dots').value, color: mainColor }, cornersSquareOptions: { type: el('qr-corners').value, color: mainColor }, cornersDotOptions: { type: 'dot', color: mainColor }, imageOptions: { crossOrigin: "anonymous", margin: 5, imageSize: parseFloat(el('qr-logo-size').value) } };
            if(useGradient) options.dotsOptions.gradient = { type: el('qr-gradient-type').value, colorStops: [{ offset: 0, color: mainColor }, { offset: 1, color: el('qr-color-sec').value }] };
            options.image = currentLogoBase64 ? currentLogoBase64 : null;
            qrCode.update(options); el('qr-canvas-container').innerHTML = ''; qrCode.append(el('qr-canvas-container'));
        };
        typeSelect.addEventListener('change', renderInputs); ['qr-color-main', 'qr-color-bg', 'qr-use-gradient', 'qr-color-sec', 'qr-gradient-type', 'qr-dots', 'qr-corners', 'qr-logo-size', 'qr-margin', 'qr-error'].forEach(id => el(id).addEventListener('input', triggerUpdate));
        el('qr-logo-input').addEventListener('change', (e) => { const reader = new FileReader(); reader.onload = (ev) => { currentLogoBase64 = ev.target.result; el('qr-logo-remove').classList.remove('hidden'); triggerUpdate(); }; if(e.target.files[0]) reader.readAsDataURL(e.target.files[0]); });
        el('qr-logo-remove').addEventListener('click', () => { currentLogoBase64 = null; el('qr-logo-input').value = ''; el('qr-logo-remove').classList.add('hidden'); triggerUpdate(); });
        document.querySelectorAll('.qr-preset').forEach(btn => btn.addEventListener('click', (e) => { const p = e.target.dataset.preset; if(p==='minimal') { el('qr-color-main').value='#000000'; el('qr-color-bg').value='#ffffff'; el('qr-use-gradient').checked=false; } if(p==='neon') { el('qr-color-main').value='#18181b'; el('qr-color-bg').value='#ecfeff'; el('qr-use-gradient').checked=true; el('qr-color-sec').value='#06b6d4'; el('qr-gradient-type').value='linear'; el('qr-dots').value='classy'; } triggerUpdate(); }));
        el('qr-download-png').addEventListener('click', () => { qrCode.download({ extension: "png", name: "margemlab-qr" }); });
        renderInputs();
    }
};

// ==========================================
// 2. MARGEM ZINE (Preservado)
// ==========================================
const MargemZine = {
    state: {
        title: 'Manifesto Independente',
        font: 'font-sans',
        palette: 'pb',
        pages: [],
        activePageId: null
    },

    palettes: {
        'pb': { name: 'P&B Clássico', bg: 'bg-white', text: 'text-black', border: 'border-0', filter: 'grayscale(1)' },
        'invertido': { name: 'Noturno (Invertido)', bg: 'bg-black', text: 'text-white', border: 'border-0', filter: 'grayscale(1) invert(1)' },
        'brutal': { name: 'Brutalista (Amarelo)', bg: 'bg-[#ffcc00]', text: 'text-black', border: 'border-[8px] border-black', filter: 'grayscale(1) contrast(1.5)' },
        'punk': { name: 'Punk Rosa', bg: 'bg-[#ff00ff]', text: 'text-black', border: 'border-4 border-black border-dashed', filter: 'grayscale(1) contrast(2)' },
        'jornal': { name: 'Jornal Antigo', bg: 'bg-[#f4f0e6]', text: 'text-[#333333]', border: 'border-0', filter: 'sepia(0.6) grayscale(0.5)' }
    },

    fonts: {
        'sans': { name: 'Moderno (Inter)', class: 'font-sans' },
        'serif': { name: 'Editorial (Playfair)', class: 'font-serif' },
        'mono': { name: 'Máquina (Courier)', class: 'font-mono tracking-tighter' }
    },

    createPage(layout = 'texto', text = '') {
        return { id: 'p_' + Date.now() + Math.random().toString(36).substr(2, 5), layout, text, image: null, align: 'left' };
    },

    getActivePage() { return this.state.pages.find(p => p.id === this.state.activePageId); },
    getActiveIndex() { return this.state.pages.findIndex(p => p.id === this.state.activePageId); },

    render(container) {
        // Init State if empty
        if(this.state.pages.length === 0) {
            this.state.pages.push(this.createPage('capa', 'TÍTULO\nSubtítulo ou Autor'));
            for(let i=0; i<7; i++) this.state.pages.push(this.createPage('texto', `Conteúdo da página ${i+2}...`));
            this.state.activePageId = this.state.pages[0].id;
        }

        container.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
                .zine-preview-box { aspect-ratio: 1 / 1.414; }
                .zine-export-grid { width: 2246px; height: 1588px; background: white; display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: 50% 50%; box-sizing: border-box; }
                .zine-export-cell { box-sizing: border-box; overflow: hidden; display: flex; flex-direction: column; border: 1px dashed #ccc; }
                .zine-export-page { width: 100%; height: 100%; box-sizing: border-box; overflow: hidden; }
                .zine-flip { transform: rotate(180deg); }
            </style>

            <div class="max-w-[1400px] mx-auto px-4 py-8 animate-fade-in" id="margem-zine">
                
                <!-- TOP BAR -->
                <div class="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 p-4 rounded-2xl shadow-sm mb-6 gap-4">
                    <div class="flex items-center gap-4 w-full md:w-auto">
                        <a href="#home" class="p-2 hover:bg-base-100 dark:hover:bg-base-800 rounded-lg"><i data-lucide="arrow-left"></i></a>
                        <input type="text" id="zine-title" class="bg-transparent text-xl font-bold border-b border-transparent hover:border-base-300 focus:border-base-900 dark:focus:border-white outline-none w-full md:w-64 transition-colors" value="${this.state.title}">
                    </div>
                    <div class="flex flex-wrap gap-2 w-full md:w-auto">
                        <label class="btn-secondary text-xs py-2 px-3 cursor-pointer">
                            <i data-lucide="upload" class="w-4 h-4"></i> Importar .zine
                            <input type="file" id="zine-import-file" accept=".zine" class="hidden">
                        </label>
                        <button id="zine-export-json" class="btn-secondary text-xs py-2 px-3"><i data-lucide="save" class="w-4 h-4"></i> Salvar Projeto</button>
                    </div>
                </div>

                <!-- 3 COLUMNS WORKSPACE -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    <!-- LEFT: Pages Manager -->
                    <div class="lg:col-span-3 form-section flex flex-col h-[700px] !p-4">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xs font-bold uppercase tracking-wider text-base-500">Páginas (<span id="zine-pg-count">0</span>)</h3>
                            <button id="zine-quick-btn" class="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded hover:opacity-80"><i data-lucide="zap" class="w-3 h-3 inline"></i> Rápido</button>
                        </div>
                        
                        <div id="zine-quick-panel" class="hidden mb-4 p-3 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 rounded-lg">
                            <textarea id="zine-quick-txt" class="input-premium h-24 text-[10px]" placeholder="Cole o texto. Quebras duplas dividem páginas."></textarea>
                            <div class="flex gap-2 mt-2">
                                <button id="zine-quick-apply" class="btn-primary flex-1 text-[10px] py-1">Gerar Zine</button>
                                <button id="zine-quick-cancel" class="btn-secondary flex-1 text-[10px] py-1">Cancelar</button>
                            </div>
                        </div>

                        <div id="zine-page-list" class="flex-1 overflow-y-auto space-y-2 pr-2"></div>
                        
                        <button id="zine-add-page" class="mt-4 border-2 border-dashed border-base-300 dark:border-base-700 text-base-500 text-xs font-bold py-3 rounded-xl hover:bg-base-50 dark:hover:bg-base-800 transition-colors w-full"><i data-lucide="plus" class="w-4 h-4 inline"></i> Nova Página</button>
                    </div>

                    <!-- CENTER: Editor -->
                    <div class="lg:col-span-5 form-section flex flex-col h-[700px] !p-5 relative">
                        <div class="absolute top-4 right-4 text-[10px] font-bold bg-base-100 dark:bg-base-800 px-2 py-1 rounded">Editando Pág <span id="zine-lbl-curr"></span></div>
                        <h3 class="text-xs font-bold uppercase tracking-wider text-base-500 mb-6">Composição</h3>
                        
                        <div class="space-y-5 flex-1 overflow-y-auto pr-2">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-[10px] font-semibold mb-1 text-base-500">Layout da Página</label>
                                    <select id="zine-page-layout" class="input-premium py-2 text-xs">
                                        <option value="capa">Capa (Título Grande)</option>
                                        <option value="texto">Página de Texto</option>
                                        <option value="imagem">Imagem Total</option>
                                        <option value="misto">Misto (Img Topo, Txt Fundo)</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-semibold mb-1 text-base-500">Alinhamento do Texto</label>
                                    <select id="zine-page-align" class="input-premium py-2 text-xs">
                                        <option value="left">Esquerda</option>
                                        <option value="center">Centro</option>
                                        <option value="right">Direita</option>
                                        <option value="justify">Justificado</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-[10px] font-semibold mb-1 text-base-500">Conteúdo Textual</label>
                                <textarea id="zine-page-text" class="input-premium h-40 resize-y text-sm"></textarea>
                            </div>

                            <div>
                                <label class="block text-[10px] font-semibold mb-1 text-base-500">Mídia / Imagem</label>
                                <label class="flex flex-col items-center justify-center h-12 w-full bg-base-50 dark:bg-base-900/50 border border-dashed border-base-300 dark:border-base-700 rounded-xl cursor-pointer hover:bg-base-100 transition-colors">
                                    <span class="text-xs font-medium text-base-500" id="zine-lbl-img">Upload de Imagem Local</span>
                                    <input type="file" id="zine-page-img" accept="image/*" class="hidden">
                                </label>
                                <button id="zine-remove-img" class="text-[10px] text-red-500 mt-2 hidden hover:underline"><i data-lucide="trash" class="w-3 h-3 inline"></i> Remover Imagem</button>
                            </div>
                        </div>
                        
                        <div class="pt-4 border-t border-base-200 dark:border-base-800 mt-auto">
                            <button id="zine-remix-btn" class="btn-secondary w-full py-2 text-xs"><i data-lucide="shuffle" class="w-4 h-4"></i> Remixar Layout da Página</button>
                        </div>
                    </div>

                    <!-- RIGHT: Global & Preview -->
                    <div class="lg:col-span-4 form-section flex flex-col h-[700px] !p-4 bg-base-100 dark:bg-base-950">
                        <div class="grid grid-cols-2 gap-2 mb-4">
                            <div>
                                <label class="block text-[10px] font-bold uppercase text-base-500 mb-1">Paleta (Zine)</label>
                                <select id="zine-global-palette" class="input-premium py-1.5 text-[11px]"></select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold uppercase text-base-500 mb-1">Fonte (Zine)</label>
                                <select id="zine-global-font" class="input-premium py-1.5 text-[11px]"></select>
                            </div>
                        </div>

                        <div class="flex-1 flex items-center justify-center relative overflow-hidden bg-base-200 dark:bg-base-900 rounded-xl p-4 shadow-inner mb-4">
                            <div id="zine-live-preview" class="zine-preview-box w-full max-w-[280px] shadow-premium relative bg-white"></div>
                        </div>

                        <div class="space-y-2 mt-auto">
                            <button id="zine-export-pdf-folha" class="btn-primary w-full py-2.5 text-xs"><i data-lucide="file-symlink" class="w-4 h-4"></i> PDF 1-Folha (8 Págs Dobrável)</button>
                            <button id="zine-export-pdf-seq" class="btn-secondary w-full py-2.5 text-xs"><i data-lucide="files" class="w-4 h-4"></i> PDF Sequencial (A5 Digital)</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Area de renderizacao offscreen -->
            <div id="zine-offscreen" class="hidden absolute top-[-9999px] left-[-9999px]"></div>
        `;
    },

    init() {
        const el = id => document.getElementById(id);
        
        // Populate Globals
        el('zine-global-palette').innerHTML = Object.entries(this.palettes).map(([k,v]) => `<option value="${k}">${v.name}</option>`).join('');
        el('zine-global-font').innerHTML = Object.entries(this.fonts).map(([k,v]) => `<option value="${k}">${v.name}</option>`).join('');
        
        el('zine-title').addEventListener('input', e => this.state.title = e.target.value);
        el('zine-global-palette').value = this.state.palette;
        el('zine-global-font').value = this.state.font;
        
        el('zine-global-palette').addEventListener('change', e => { this.state.palette = e.target.value; this.renderPreview(); });
        el('zine-global-font').addEventListener('change', e => { this.state.font = e.target.value; this.renderPreview(); });

        // Add Page
        el('zine-add-page').addEventListener('click', () => {
            const p = this.createPage();
            this.state.pages.push(p);
            this.state.activePageId = p.id;
            this.renderPageList();
            this.loadEditor();
        });

        // Editor Bindings (Input Event -> Direct Preview Render)
        el('zine-page-text').addEventListener('input', e => { const p = this.getActivePage(); if(p){ p.text = e.target.value; this.renderPreview(); } });
        el('zine-page-layout').addEventListener('change', e => { const p = this.getActivePage(); if(p){ p.layout = e.target.value; this.renderPreview(); } });
        el('zine-page-align').addEventListener('change', e => { const p = this.getActivePage(); if(p){ p.align = e.target.value; this.renderPreview(); } });
        
        el('zine-page-img').addEventListener('change', e => {
            const f = e.target.files[0]; if(!f) return;
            const r = new FileReader();
            r.onload = ev => { 
                const p = this.getActivePage(); 
                if(p) { p.image = ev.target.result; this.loadEditor(); }
            };
            r.readAsDataURL(f);
            el('zine-page-img').value = '';
        });

        el('zine-remove-img').addEventListener('click', () => { const p = this.getActivePage(); if(p) { p.image = null; this.loadEditor(); } });

        el('zine-remix-btn').addEventListener('click', () => {
            const p = this.getActivePage();
            if(p) {
                const layouts = ['capa', 'texto', 'imagem', 'misto'];
                const aligns = ['left', 'center', 'right', 'justify'];
                p.layout = layouts[Math.floor(Math.random() * layouts.length)];
                p.align = aligns[Math.floor(Math.random() * aligns.length)];
                this.loadEditor();
            }
        });

        // Zine Rápido
        el('zine-quick-btn').addEventListener('click', () => el('zine-quick-panel').classList.toggle('hidden'));
        el('zine-quick-cancel').addEventListener('click', () => el('zine-quick-panel').classList.add('hidden'));
        el('zine-quick-apply').addEventListener('click', () => {
            const txt = el('zine-quick-txt').value.trim();
            if(!txt) return;
            const blocks = txt.split(/\n\s*\n/).filter(b => b.trim()); // Split by double enter
            this.state.pages = blocks.map((b, i) => this.createPage(i === 0 ? 'capa' : 'texto', b));
            if(this.state.pages.length > 0) {
                this.state.pages[0].align = 'center';
                this.state.activePageId = this.state.pages[0].id;
            }
            el('zine-quick-panel').classList.add('hidden');
            el('zine-quick-txt').value = '';
            this.renderPageList();
            this.loadEditor();
            ToastManager.show('Zine Rápido gerado!', 'success');
        });

        // Export/Import JSON
        el('zine-export-json').addEventListener('click', () => {
            const data = JSON.stringify(this.state);
            const blob = new Blob([data], {type: 'application/json'});
            const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
            link.download = `${this.state.title.replace(/\s+/g,'-')}.zine`;
            link.click(); ToastManager.show('Projeto .zine exportado.', 'success');
        });
        
        el('zine-import-file').addEventListener('change', e => {
            const f = e.target.files[0]; if(!f) return;
            const r = new FileReader();
            r.onload = ev => {
                try {
                    this.state = JSON.parse(ev.target.result);
                    if(!this.state.pages || this.state.pages.length === 0) throw new Error();
                    el('zine-title').value = this.state.title || 'Zine';
                    el('zine-global-palette').value = this.state.palette;
                    el('zine-global-font').value = this.state.font;
                    this.state.activePageId = this.state.pages[0].id;
                    this.renderPageList(); this.loadEditor();
                    ToastManager.show('Projeto carregado.', 'success');
                } catch(err) { ToastManager.show('Arquivo inválido ou corrompido.', 'error'); }
            };
            r.readAsText(f);
            el('zine-import-file').value = '';
        });

        // Exports PDF
        el('zine-export-pdf-folha').addEventListener('click', () => this.exportPDF(true));
        el('zine-export-pdf-seq').addEventListener('click', () => this.exportPDF(false));

        // Initial Renders
        this.renderPageList();
        this.loadEditor();
        lucide.createIcons();
    },

    // --- RENDER UPDATERS ---
    
    renderPageList() {
        const el = document.getElementById('zine-page-list');
        document.getElementById('zine-pg-count').innerText = this.state.pages.length;
        
        el.innerHTML = this.state.pages.map((p, i) => `
            <div class="flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${p.id === this.state.activePageId ? 'border-base-900 bg-base-100 dark:border-white dark:bg-base-800' : 'border-base-200 dark:border-base-800 hover:border-base-400'}" onclick="window.margemZineSetPage('${p.id}')">
                <div class="flex items-center gap-2 overflow-hidden">
                    <span class="text-[10px] font-bold w-4 text-base-400">${i+1}</span>
                    <span class="text-xs truncate max-w-[80px] font-medium">${p.layout.toUpperCase()}</span>
                </div>
                <div class="flex gap-1" onclick="event.stopPropagation()">
                    <button class="p-1 hover:text-blue-500" onclick="window.margemZineMove(${i}, -1)"><i data-lucide="arrow-up" class="w-3 h-3"></i></button>
                    <button class="p-1 hover:text-blue-500" onclick="window.margemZineMove(${i}, 1)"><i data-lucide="arrow-down" class="w-3 h-3"></i></button>
                    <button class="p-1 hover:text-green-500" onclick="window.margemZineDup('${p.id}')"><i data-lucide="copy" class="w-3 h-3"></i></button>
                    <button class="p-1 hover:text-red-500" onclick="window.margemZineDel('${p.id}')"><i data-lucide="trash" class="w-3 h-3"></i></button>
                </div>
            </div>
        `).join('');
        lucide.createIcons();

        // Window Helpers
        window.margemZineSetPage = (id) => { this.state.activePageId = id; this.renderPageList(); this.loadEditor(); };
        window.margemZineMove = (index, dir) => {
            if(index + dir < 0 || index + dir >= this.state.pages.length) return;
            const temp = this.state.pages[index];
            this.state.pages[index] = this.state.pages[index + dir];
            this.state.pages[index + dir] = temp;
            this.renderPageList(); this.renderPreview();
        };
        window.margemZineDup = (id) => {
            const p = this.state.pages.find(x => x.id === id);
            const np = JSON.parse(JSON.stringify(p)); np.id = 'p_' + Date.now();
            this.state.pages.push(np); this.state.activePageId = np.id;
            this.renderPageList(); this.loadEditor();
        };
        window.margemZineDel = (id) => {
            if(this.state.pages.length === 1) return ToastManager.show('O zine deve ter pelo menos 1 página.', 'error');
            this.state.pages = this.state.pages.filter(x => x.id !== id);
            if(this.state.activePageId === id) this.state.activePageId = this.state.pages[0].id;
            this.renderPageList(); this.loadEditor();
        };
    },

    loadEditor() {
        const p = this.getActivePage();
        if(!p) return;
        
        document.getElementById('zine-lbl-curr').innerText = this.getActiveIndex() + 1;
        document.getElementById('zine-page-text').value = p.text;
        document.getElementById('zine-page-layout').value = p.layout;
        document.getElementById('zine-page-align').value = p.align;
        
        if(p.image) {
            document.getElementById('zine-lbl-img').innerText = "Imagem Adicionada (Toque para trocar)";
            document.getElementById('zine-remove-img').classList.remove('hidden');
        } else {
            document.getElementById('zine-lbl-img').innerText = "Upload de Imagem Local";
            document.getElementById('zine-remove-img').classList.add('hidden');
        }
        this.renderPreview();
    },

    generatePageHTML(page) {
        const pal = this.palettes[this.state.palette];
        const fontClass = this.fonts[this.state.font].class;
        
        let content = '';
        const txt = page.text.replace(/\n/g, '<br>');

        if (page.layout === 'capa') {
            content = `<div class="flex flex-col items-center justify-center h-full text-center p-6 box-border">
                <h1 class="text-3xl font-black uppercase leading-tight">${page.text.split('\n')[0] || 'TÍTULO'}</h1>
                <p class="mt-4 text-sm font-medium opacity-80">${page.text.split('\n').slice(1).join('<br>')}</p>
            </div>`;
        } else if (page.layout === 'texto') {
            content = `<div class="p-6 text-${page.align} text-[10px] leading-relaxed box-border h-full overflow-hidden" style="white-space:pre-wrap;">${txt}</div>`;
        } else if (page.layout === 'imagem') {
            const imgHtml = page.image ? `<img src="${page.image}" class="w-full h-full object-cover" style="filter: ${pal.filter};">` : `<div class="flex items-center justify-center h-full opacity-20"><p>Sem Imagem</p></div>`;
            content = `<div class="w-full h-full">${imgHtml}</div>`;
        } else if (page.layout === 'misto') {
            const imgHtml = page.image ? `<img src="${page.image}" class="w-full h-full object-cover" style="filter: ${pal.filter};">` : `<div class="flex items-center justify-center h-full opacity-20 border-b border-inherit"><p>Sem Imagem</p></div>`;
            content = `<div class="flex flex-col h-full box-border">
                <div class="h-[45%] w-full flex-shrink-0">${imgHtml}</div>
                <div class="h-[55%] p-4 text-${page.align} text-[10px] leading-relaxed overflow-hidden" style="white-space:pre-wrap;">${txt}</div>
            </div>`;
        }
        
        return `<div class="w-full h-full ${pal.bg} ${pal.text} ${fontClass} border box-border ${pal.border} relative overflow-hidden">${content}</div>`;
    },

    renderPreview() {
        const p = this.getActivePage();
        if(!p) return;
        document.getElementById('zine-live-preview').innerHTML = this.generatePageHTML(p);
    },

    // --- PDF EXPORT ENGINE ---
    async exportPDF(isBooklet) {
        if(isBooklet && this.state.pages.length !== 8) {
            return ToastManager.show(`O modo 1-Folha Dobrável requer exatamente 8 páginas. O seu tem ${this.state.pages.length}.`, 'error');
        }

        const btnId = isBooklet ? 'zine-export-pdf-folha' : 'zine-export-pdf-seq';
        const btn = document.getElementById(btnId);
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Gerando Alta Resolução...`; btn.disabled = true; lucide.createIcons();

        try {
            const offscreen = document.getElementById('zine-offscreen');
            const { PDFDocument } = PDFLib;
            const pdfDoc = await PDFDocument.create();

            if (isBooklet) {
                // Modo 8-Pages A4 Imposition (2246x1588 high res grid)
                const gridHtml = `
                    <div class="zine-export-grid">
                        <div class="zine-export-cell zine-flip">${this.generatePageHTML(this.state.pages[4])}</div> <!-- Pág 5 invertida -->
                        <div class="zine-export-cell zine-flip">${this.generatePageHTML(this.state.pages[3])}</div> <!-- Pág 4 invertida -->
                        <div class="zine-export-cell zine-flip">${this.generatePageHTML(this.state.pages[2])}</div> <!-- Pág 3 invertida -->
                        <div class="zine-export-cell zine-flip">${this.generatePageHTML(this.state.pages[1])}</div> <!-- Pág 2 invertida -->
                        <div class="zine-export-cell">${this.generatePageHTML(this.state.pages[5])}</div> <!-- Pág 6 -->
                        <div class="zine-export-cell">${this.generatePageHTML(this.state.pages[6])}</div> <!-- Pág 7 -->
                        <div class="zine-export-cell">${this.generatePageHTML(this.state.pages[7])}</div> <!-- Pág 8 -->
                        <div class="zine-export-cell">${this.generatePageHTML(this.state.pages[0])}</div> <!-- Pág 1 -->
                    </div>
                `;
                offscreen.innerHTML = gridHtml; offscreen.classList.remove('hidden');
                await new Promise(r => setTimeout(r, 300)); // wait dom
                
                const canvas = await html2canvas(offscreen.firstElementChild, { scale: 1, useCORS: true, backgroundColor: '#ffffff' });
                const imgData = canvas.toDataURL('image/jpeg', 0.95);
                
                const page = pdfDoc.addPage([841.89, 595.28]); // A4 Landscape Pts
                const image = await pdfDoc.embedJpg(imgData);
                page.drawImage(image, { x: 0, y: 0, width: 841.89, height: 595.28 });
                
            } else {
                // Modo Sequencial (A5)
                for(const p of this.state.pages) {
                    offscreen.innerHTML = `<div style="width: 561px; height: 794px; background: white;">${this.generatePageHTML(p)}</div>`;
                    offscreen.classList.remove('hidden');
                    await new Promise(r => setTimeout(r, 100)); // micro pause to ensure paint
                    
                    const canvas = await html2canvas(offscreen.firstElementChild, { scale: 1.5, useCORS: true, backgroundColor: '#ffffff' });
                    const imgData = canvas.toDataURL('image/jpeg', 0.95);
                    
                    const page = pdfDoc.addPage([419.53, 595.28]); // A5 Portrait Pts
                    const image = await pdfDoc.embedJpg(imgData);
                    page.drawImage(image, { x: 0, y: 0, width: 419.53, height: 595.28 });
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
            link.download = `${this.state.title.replace(/\s+/g,'-')}-${isBooklet?'1Folha':'Digital'}.pdf`; link.click();
            ToastManager.show('Publicação exportada!', 'success');

        } catch (err) {
            console.error(err); ToastManager.show('Erro ao processar as páginas.', 'error');
        } finally {
            document.getElementById('zine-offscreen').innerHTML = '';
            document.getElementById('zine-offscreen').classList.add('hidden');
            btn.innerHTML = originalHtml; btn.disabled = false; lucide.createIcons();
        }
    }
};

// ==========================================
// 2, 3, 4, 5, 6, 7 e 8 (Documenta, PDF, Certifica, Imagem, Texto, QR e Sorteador MANTIDOS IDÊNTICOS da Iteração Anterior)
// ==========================================

const PDFToolLegacy = {
    state: { view: 'menu', files: [], pages: [], imgFiles: [] },
    render(container) { container.innerHTML = `<div class="max-w-6xl mx-auto px-6 py-12" id="pdf-toolkit"><div class="mb-10"><a href="#home" class="inline-flex items-center text-sm font-medium text-base-500 hover:text-base-900 dark:hover:text-base-50 mb-6"><i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i> Explorar Ferramentas</a><h1 class="text-3xl font-bold mb-2">PDF Toolkit</h1><p class="text-base-500 text-sm max-w-xl">Edite estruturalmente, junte, divida, organize páginas ou converta imagens localmente.</p></div><div id="pdf-dynamic-view"></div></div>`; },
    init() { this.state = { view: 'menu', files: [], pages: [], imgFiles: [] }; this.renderView(); },
    renderView() { const v = document.getElementById('pdf-dynamic-view'); if (this.state.view === 'menu') { v.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="form-section cursor-pointer hover:border-base-900" id="btn-goto-lab"><h3 class="text-lg font-bold"><i data-lucide="layout-grid" class="inline"></i> PDF Lab (Organizador)</h3><p class="text-xs text-base-500 mt-2">Área de Trabalho. Arraste páginas, junte arquivos, exclua, duplique e gire páginas individualmente.</p></div><div class="form-section cursor-pointer hover:border-base-900" id="btn-goto-img"><h3 class="text-lg font-bold"><i data-lucide="image" class="inline"></i> Imagens → PDF</h3><p class="text-xs text-base-500 mt-2">Selecione imagens (JPG, PNG) e crie um arquivo PDF.</p></div></div>`; document.getElementById('btn-goto-lab').addEventListener('click', () => { this.state.view = 'lab'; this.renderView(); }); document.getElementById('btn-goto-img').addEventListener('click', () => { this.state.view = 'img2pdf'; this.renderView(); }); } else if (this.state.view === 'lab') { v.innerHTML = `<div class="flex flex-col gap-6"><div class="flex justify-between items-center bg-base-50 p-4 rounded-xl border border-base-200"><button id="lab-btn-back" class="p-2 hover:bg-base-200 rounded-lg"><i data-lucide="arrow-left"></i></button><div class="flex gap-2"><label class="btn-secondary !py-2 cursor-pointer text-xs"><i data-lucide="file-plus"></i> Adicionar PDF<input type="file" id="lab-input-pdf" accept="application/pdf" multiple class="hidden"></label><button id="lab-btn-export" class="btn-primary !py-2 text-xs disabled:opacity-50"><i data-lucide="download"></i> Exportar</button><button id="lab-btn-export-sel" class="btn-primary !py-2 text-xs !bg-blue-600 hidden"><i data-lucide="scissors"></i> Extrair Sel</button></div></div><div class="grid grid-cols-1 lg:grid-cols-4 gap-6"><div class="lg:col-span-1 form-section !p-4"><h3 class="text-xs font-bold uppercase mb-4">Arquivos</h3><div id="lab-files-list" class="space-y-2"></div></div><div class="lg:col-span-3 form-section !p-4 flex flex-col min-h-[500px]"><div class="flex justify-between mb-4 pb-2 border-b"><div class="flex gap-2 items-center"><button id="lab-act-selectall" class="text-[10px] font-semibold">Sel Tudo</button><span id="lab-sel-count" class="text-[10px] font-bold text-blue-500">0 sel</span></div><div class="flex gap-2"><button id="lab-act-rotate" class="p-1.5 border rounded" disabled><i data-lucide="rotate-cw"></i></button><button id="lab-act-dup" class="p-1.5 border rounded" disabled><i data-lucide="copy"></i></button><button id="lab-act-del" class="p-1.5 border rounded text-red-500" disabled><i data-lucide="trash-2"></i></button></div></div><div id="lab-pages-grid" class="flex-1 flex flex-wrap content-start gap-4 overflow-y-auto p-2"></div></div></div></div>`; this.bindLab(); this.updateLabUI(); } else if (this.state.view === 'img2pdf') { v.innerHTML = `<div class="form-section max-w-3xl mx-auto"><div class="flex items-center gap-2 mb-4 border-b pb-4"><button id="img-btn-back"><i data-lucide="arrow-left"></i></button><h2 class="font-bold text-sm">Imagens para PDF</h2></div><label class="flex flex-col items-center justify-center h-32 w-full bg-base-50 border-2 border-dashed rounded-xl cursor-pointer hover:bg-base-100"><i data-lucide="image-plus" class="mb-2"></i><span class="text-sm font-medium">Selecionar Imagens</span><input type="file" id="img-input-files" accept="image/png, image/jpeg" multiple class="hidden"></label><div id="img-list" class="grid grid-cols-6 gap-3 mt-4"></div><div class="grid grid-cols-2 gap-4 pt-4 mt-4 border-t"><button id="img-btn-clear" class="btn-secondary w-full">Limpar</button><button id="img-btn-export" class="btn-primary w-full disabled:opacity-50" disabled>Gerar PDF</button></div></div>`; this.bindImg2Pdf(); } lucide.createIcons(); },
    bindLab() { const el = id => document.getElementById(id); el('lab-btn-back').addEventListener('click', () => { this.state.view = 'menu'; this.renderView(); }); el('lab-input-pdf').addEventListener('change', async (e) => { const files = Array.from(e.target.files); if(files.length === 0) return; const btn = el('lab-btn-export'); btn.innerHTML = `<i data-lucide="loader" class="animate-spin"></i> Processando...`; btn.disabled = true; lucide.createIcons(); try { const { PDFDocument } = PDFLib; for (const file of files) { const arrayBuffer = await file.arrayBuffer(); const pdfDoc = await PDFDocument.load(arrayBuffer); const pageCount = pdfDoc.getPageCount(); const fileId = 'file_' + Date.now(); this.state.files.push({ id: fileId, name: file.name, doc: pdfDoc }); for(let i = 0; i < pageCount; i++) { this.state.pages.push({ id: 'pg_' + Date.now() + i, fileId: fileId, originalIndex: i, rotation: 0, selected: false }); } } } catch (err) { ToastManager.show('Erro ao ler PDF.', 'error'); } el('lab-input-pdf').value = ''; this.updateLabUI(); }); el('lab-act-selectall').addEventListener('click', () => { const allSelected = this.state.pages.every(p => p.selected); this.state.pages.forEach(p => p.selected = !allSelected); this.updateLabUI(); }); el('lab-act-del').addEventListener('click', () => { this.state.pages = this.state.pages.filter(p => !p.selected); this.updateLabUI(); }); el('lab-act-rotate').addEventListener('click', () => { this.state.pages.forEach(p => { if(p.selected) p.rotation = (p.rotation + 90) % 360; }); this.updateLabUI(); }); el('lab-act-dup').addEventListener('click', () => { const newPages = []; this.state.pages.forEach(p => { newPages.push(p); if(p.selected) newPages.push({ ...p, id: 'pg_' + Date.now() + Math.random(), selected: false }); }); this.state.pages = newPages; this.updateLabUI(); }); el('lab-btn-export').addEventListener('click', () => this.exportLabPDF(this.state.pages)); el('lab-btn-export-sel').addEventListener('click', () => this.exportLabPDF(this.state.pages.filter(p => p.selected))); },
    updateLabUI() { const el = id => document.getElementById(id); el('lab-files-list').innerHTML = this.state.files.map((f, i) => `<div class="text-xs truncate font-medium border p-2 rounded">${i+1}. ${f.name}</div>`).join(''); const grid = el('lab-pages-grid'); grid.innerHTML = this.state.pages.map((p, i) => `<div class="relative w-[100px] h-[141px] flex-shrink-0 cursor-pointer group" onclick="window.margemPdfTogglePage('${p.id}')"><div class="absolute inset-0 bg-white border-2 rounded-lg flex flex-col items-center justify-center p-2 text-center transition-all ${p.selected ? 'border-blue-500' : 'border-base-200'}" style="transform: rotate(${p.rotation}deg);"><i data-lucide="file" class="w-6 h-6 mb-1"></i><span class="text-[9px] font-bold truncate w-full">${this.state.files.find(f => f.id === p.fileId).name}</span><span class="text-[9px]">Pág ${p.originalIndex + 1}</span></div>${p.selected ? `<div class="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-0.5"><i data-lucide="check" class="w-3 h-3"></i></div>` : ''}<div class="absolute bottom-1 right-1 bg-black/50 text-white text-[8px] px-1 rounded">${i + 1}</div></div>`).join(''); window.margemPdfTogglePage = (id) => { const p = this.state.pages.find(pg => pg.id === id); if(p) { p.selected = !p.selected; this.updateLabUI(); } }; const selCount = this.state.pages.filter(p => p.selected).length; el('lab-sel-count').innerText = `${selCount} sel`; ['lab-act-rotate', 'lab-act-dup', 'lab-act-del'].forEach(id => el(id).disabled = selCount === 0); el('lab-btn-export').innerHTML = `Exportar Tudo (${this.state.pages.length})`; el('lab-btn-export').disabled = this.state.pages.length === 0; if (selCount > 0) { el('lab-btn-export-sel').classList.remove('hidden'); el('lab-btn-export-sel').innerHTML = `Extrair (${selCount})`; el('lab-btn-export').classList.add('hidden'); } else { el('lab-btn-export-sel').classList.add('hidden'); el('lab-btn-export').classList.remove('hidden'); } lucide.createIcons(); },
    async exportLabPDF(pagesArray) { if(pagesArray.length === 0) return; const btnId = pagesArray.length === this.state.pages.length ? 'lab-btn-export' : 'lab-btn-export-sel'; const btn = document.getElementById(btnId); const origHtml = btn.innerHTML; btn.innerHTML = `<i data-lucide="loader" class="animate-spin"></i> Gerando...`; btn.disabled = true; lucide.createIcons(); try { const { PDFDocument, degrees } = PDFLib; const newPdf = await PDFDocument.create(); for (const p of pagesArray) { const sourcePdf = this.state.files.find(f => f.id === p.fileId).doc; const [copiedPage] = await newPdf.copyPages(sourcePdf, [p.originalIndex]); if (p.rotation !== 0) { const currentRot = copiedPage.getRotation().angle; copiedPage.setRotation(degrees(currentRot + p.rotation)); } newPdf.addPage(copiedPage); } const pdfBytes = await newPdf.save(); const blob = new Blob([pdfBytes], { type: 'application/pdf' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `Workspace-${Date.now()}.pdf`; link.click(); ToastManager.show('PDF gerado!', 'success'); } catch(err) { ToastManager.show('Erro ao exportar PDF.', 'error'); } finally { btn.innerHTML = origHtml; btn.disabled = false; lucide.createIcons(); } },
    bindImg2Pdf() { const el = id => document.getElementById(id); el('img-btn-back').addEventListener('click', () => { this.state.view = 'menu'; this.renderView(); }); el('img-input-files').addEventListener('change', (e) => { Array.from(e.target.files).forEach(f => { this.state.imgFiles.push({ id: Date.now()+Math.random(), file: f, url: URL.createObjectURL(f) }); }); this.updateImgUI(); el('img-input-files').value = ''; }); el('img-btn-clear').addEventListener('click', () => { this.state.imgFiles = []; this.updateImgUI(); }); el('img-btn-export').addEventListener('click', async () => { if(this.state.imgFiles.length === 0) return; const btn = el('img-btn-export'); btn.disabled = true; try { const { PDFDocument } = PDFLib; const pdfDoc = await PDFDocument.create(); for (const imgObj of this.state.imgFiles) { const imgBytes = await imgObj.file.arrayBuffer(); let pdfImage; if (imgObj.file.type === 'image/jpeg') pdfImage = await pdfDoc.embedJpg(imgBytes); else if (imgObj.file.type === 'image/png') pdfImage = await pdfDoc.embedPng(imgBytes); else continue; const page = pdfDoc.addPage([595.28, 841.89]); const scaled = pdfImage.scaleToFit(595.28, 841.89); page.drawImage(pdfImage, { x: 595.28 / 2 - scaled.width / 2, y: 841.89 / 2 - scaled.height / 2, width: scaled.width, height: scaled.height }); } const pdfBytes = await pdfDoc.save(); const blob = new Blob([pdfBytes], { type: 'application/pdf' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `Img2Pdf-${Date.now()}.pdf`; link.click(); ToastManager.show('PDF gerado!', 'success'); } catch(e) { ToastManager.show('Erro.', 'error'); } finally { btn.disabled = false; } }); },
    updateImgUI() { const list = document.getElementById('img-list'); list.innerHTML = this.state.imgFiles.map(img => `<div class="relative aspect-square border rounded-lg overflow-hidden group"><img src="${img.url}" class="w-full h-full object-cover"><button class="absolute top-1 right-1 bg-red-500 text-white rounded p-1 opacity-0 group-hover:opacity-100" onclick="window.margemImgDel('${img.id}')"><i data-lucide="x" class="w-3 h-3"></i></button></div>`).join(''); window.margemImgDel = (id) => { this.state.imgFiles = this.state.imgFiles.filter(i => i.id !== id); this.updateImgUI(); }; document.getElementById('img-btn-export').disabled = this.state.imgFiles.length === 0; lucide.createIcons(); }
};

const DocumentaLegacy = {
    state: { activeTab: 'new', currentTemplateId: 'orcamento', formData: {}, visualSettings: { style: 'classic', color: '#18181b', logo: null }, history: JSON.parse(localStorage.getItem('margemlab_docs_history') || '[]') },
    templates: [ { id: 'orcamento', name: 'Orçamento Comercial', category: 'Negócios', content: `**ORÇAMENTO DE PRESTAÇÃO DE SERVIÇOS**\n\nCliente: {{NOME_DO_CLIENTE}}\nDocumento: {{CPF_CNPJ_CLIENTE}}\n\n**DESCRIÇÃO**\n{{DESCRICAO_DO_SERVICO}}\n\nValor Total: **R$ {{VALOR_TOTAL}}**\nCondições: {{FORMA_DE_PAGAMENTO}}\n\nAtenciosamente,\n\n___________________________________\n**{{NOME_DA_SUA_EMPRESA}}**\n{{DATA_ATUAL}}` }, { id: 'contrato', name: 'Contrato de Serviço', category: 'Jurídico', content: `**CONTRATO DE PRESTAÇÃO DE SERVIÇOS**\n\n**CONTRATANTE:** {{NOME_CONTRATANTE}}, doc {{DOC_CONTRATANTE}}.\n**CONTRATADO:** {{NOME_CONTRATADO}}, doc {{DOC_CONTRATADO}}.\n\nCláusula 1: Objeto é {{DESCRICAO_SERVICO}}.\nCláusula 2: Valor de **R$ {{VALOR_TOTAL}}**.\n\n{{CIDADE_ESTADO}}, {{DATA_ATUAL}}\n\n_________________________________\nContratante\n\n_________________________________\nContratado` }, { id: 'builder', name: '⚡ Construtor Livre', category: 'Avançado', content: `**{{TITULO_DOCUMENTO}}**\n\nInsira seu texto e coloque variáveis em chaves duplas {{ASSIM}}. O sistema criará os campos.\n\nAssinatura:\n_______________________` } ],
    formatters: { cpf_cnpj: (val) => val.replace(/\D/g, '').length > 11 ? val.replace(/\D/g, '').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5") : val.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"), telefone: (val) => val.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3"), moeda: (val) => { const num = val.replace(/\D/g, ''); if(!num) return ''; return (parseFloat(num) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); } },
    extractTags(text) { const matches = [...text.matchAll(/{{(?!SE_)(?!FIM_SE)([^}]+)}}/g)].map(m => m[1]); return [...new Set(matches)]; },
    parseTemplate(text, formData) { let output = text; const condRegex = /{{SE_([^}]+)}}([\s\S]*?){{FIM_SE}}/g; output = output.replace(condRegex, (match, field, innerContent) => { const val = formData[field]; if(val && val.trim() !== '') return innerContent.trim(); return ''; }); output = output.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); output = output.replace(/\n/g, '<br>'); const varRegex = /{{(?!SE_)(?!FIM_SE)([^}]+)}}/g; output = output.replace(varRegex, (match, field) => { const val = formData[field]; return val ? `<span class="doc-bound-value">${val}</span>` : `<span class="text-base-300 dark:text-base-700 bg-base-100 dark:bg-base-900 px-1 rounded">[${field.replace(/_/g, ' ')}]</span>`; }); return output; },
    render(container) { const main = `<div class="flex gap-4 border-b mb-6"><button id="doc-tab-new" class="pb-3 text-sm font-bold border-b-2 border-base-900">Criar Documento</button><button id="doc-tab-history" class="pb-3 text-sm font-medium border-b-2 border-transparent text-base-400">Histórico (<span id="doc-history-count">0</span>)</button></div><div id="doc-view-new" class="form-section space-y-6"><div class="grid grid-cols-2 gap-6 bg-base-50 p-4 rounded-xl"><div><label class="block text-[10px] font-bold mb-2">Modelo</label><select id="doc-select-template" class="input-premium py-2 text-sm"></select></div><div class="grid grid-cols-2 gap-3"><div><label class="block text-[10px] font-bold mb-2">Estilo</label><select id="doc-select-style" class="input-premium py-2"><option value="classic">Clássico</option><option value="modern">Moderno</option><option value="corporate">Corporativo</option></select></div><div><label class="block text-[10px] font-bold mb-2">Cor</label><input type="color" id="doc-color" value="#18181b" class="h-10 w-full rounded-lg cursor-pointer bg-transparent border p-0.5"></div></div></div><div id="doc-builder-area" class="hidden"><label class="block text-xs font-bold mb-2">Editor Livre</label><textarea id="doc-builder-source" class="input-premium h-40 font-mono text-[11px]"></textarea></div><div><label class="block text-xs font-bold border-b pb-2 mb-4">Campos (Smart Fields)</label><div id="doc-smart-fields" class="grid grid-cols-2 gap-4"></div></div><div class="flex gap-4 pt-4 border-t"><label class="flex-1 flex justify-center items-center h-12 border border-dashed rounded-xl cursor-pointer hover:bg-base-50"><span class="text-xs font-medium" id="doc-lbl-logo">Add Logo</span><input type="file" id="doc-input-logo" accept="image/*" class="hidden"></label><button id="doc-save-history" class="btn-secondary flex-1 py-3"><i data-lucide="save"></i> Salvar</button></div></div><div id="doc-view-history" class="hidden form-section"><div id="doc-history-list" class="space-y-3"></div></div>`; const side = `<div class="form-section flex flex-col h-full p-4 rounded-2xl"><div class="flex justify-between items-center mb-4"><label class="text-[10px] font-bold uppercase">A4 Preview</label><button id="doc-toggle-edit" class="text-[10px] px-3 py-1.5 border rounded-lg hover:border-base-900 shadow-sm font-medium"><i data-lucide="edit-3" class="w-3 h-3 inline"></i> Editar</button></div><div class="w-full relative shadow-premium bg-white flex-1 overflow-hidden flex flex-col" style="aspect-ratio: 1/1.414;"><div id="doc-a4-header" class="w-full h-2"></div><div class="w-full px-8 pt-8 flex justify-center"><img id="doc-a4-logo" class="max-h-16 hidden" /></div><div id="doc-a4-content" class="w-full flex-1 p-8 text-black text-[12px] outline-none overflow-y-auto" contenteditable="false"></div></div><div class="grid grid-cols-2 gap-3 mt-6"><button id="doc-export-pdf" class="btn-primary w-full"><i data-lucide="file-down"></i> Baixar PDF</button><button id="doc-print-btn" class="btn-secondary w-full"><i data-lucide="printer"></i> Imprimir</button></div></div><div id="doc-export-area" class="hidden absolute top-[-9999px] left-[-9999px]"></div>`; container.innerHTML = SharedUI.layout('documenta', 'Documenta PRO', 'Motor inteligente de documentos dinâmicos.', main, side); },
    init() { const el = id => document.getElementById(id); this.state.formData = { 'DATA_ATUAL': new Date().toLocaleDateString('pt-BR') }; el('doc-select-template').innerHTML = this.templates.map(t => `<option value="${t.id}">${t.name}</option>`).join(''); el('doc-history-count').innerText = this.state.history.length; const setTab = (t) => { this.state.activeTab = t; if(t==='new') { el('doc-view-new').classList.remove('hidden'); el('doc-view-history').classList.add('hidden'); } else { el('doc-view-history').classList.remove('hidden'); el('doc-view-new').classList.add('hidden'); renderHistory(); } }; el('doc-tab-new').addEventListener('click', ()=>setTab('new')); el('doc-tab-history').addEventListener('click', ()=>setTab('history')); const rebuildForm = () => { const tplId = el('doc-select-template').value; this.state.currentTemplateId = tplId; let raw = ''; if(tplId==='builder'){ el('doc-builder-area').classList.remove('hidden'); raw = el('doc-builder-source').value || this.templates.find(t=>t.id==='builder').content; el('doc-builder-source').value = raw; } else { el('doc-builder-area').classList.add('hidden'); raw = this.templates.find(t=>t.id===tplId).content; } const tags = this.extractTags(raw); const c = el('doc-smart-fields'); c.innerHTML = tags.map(tag => `<div><label class="block text-[10px] font-bold mb-1">${tag}</label><input type="text" data-tag="${tag}" value="${this.state.formData[tag]||''}" class="input-premium doc-smart-input py-2 text-xs"></div>`).join(''); c.querySelectorAll('.doc-smart-input').forEach(inp => inp.addEventListener('input', e => { let v=e.target.value; const t=e.target.dataset.tag; if(t.includes('CPF'))v=this.formatters.cpf_cnpj(v); if(t.includes('VALOR'))v=this.formatters.moeda(v); e.target.value=v; this.state.formData[t]=v; updatePreview(raw); })); updatePreview(raw); }; const updatePreview = (raw) => { const box = el('doc-a4-content'); box.innerHTML = this.parseTemplate(raw, this.state.formData); const style = el('doc-select-style').value; const col = el('doc-color').value; box.className = `w-full flex-1 p-8 text-black text-[12px] outline-none overflow-y-auto ${style==='classic'?'font-serif':'font-sans'}`; if(style==='corporate'){ el('doc-a4-header').style.background=col; el('doc-a4-header').style.height='12px'; }else{ el('doc-a4-header').style.height='0'; } box.querySelectorAll('.doc-bound-value').forEach(s => { s.style.color = style==='corporate'?col:'#000'; s.style.fontWeight='bold'; }); }; el('doc-select-template').addEventListener('change', rebuildForm); el('doc-builder-source').addEventListener('input', rebuildForm); ['doc-select-style', 'doc-color'].forEach(id => el(id).addEventListener('change', (e) => { this.state.visualSettings[id==='doc-color'?'color':'style'] = e.target.value; rebuildForm(); })); el('doc-input-logo').addEventListener('change', e => { const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>{ this.state.visualSettings.logo=ev.target.result; el('doc-a4-logo').src=ev.target.result; el('doc-a4-logo').classList.remove('hidden'); el('doc-lbl-logo').innerText="Logo OK"; }; r.readAsDataURL(f); }); el('doc-toggle-edit').addEventListener('click', () => { const box=el('doc-a4-content'); const isEd=box.getAttribute('contenteditable')==='true'; box.setAttribute('contenteditable', !isEd); if(!isEd)box.focus(); }); const renderHistory = () => { el('doc-history-list').innerHTML = this.state.history.map(d=>`<div class="flex justify-between border p-3 rounded"><span class="text-sm font-bold">${d.title}</span><button class="doc-load-hist btn-secondary text-[10px] px-2" data-id="${d.id}">Carregar</button></div>`).join(''); document.querySelectorAll('.doc-load-hist').forEach(b => b.addEventListener('click', e => { const d = this.state.history.find(x=>x.id===e.target.dataset.id); if(d) { el('doc-select-template').value=d.templateId; this.state.formData={...d.formData}; this.state.visualSettings={...d.visualSettings}; setTab('new'); rebuildForm(); } })); }; el('doc-save-history').addEventListener('click', () => { this.state.history.unshift({ id:Date.now().toString(), templateId:this.state.currentTemplateId, title: "Salvo " + new Date().toLocaleTimeString(), formData: {...this.state.formData}, visualSettings: {...this.state.visualSettings} }); localStorage.setItem('margemlab_docs_history', JSON.stringify(this.state.history)); el('doc-history-count').innerText=this.state.history.length; ToastManager.show('Salvo!', 'success'); }); el('doc-print-btn').addEventListener('click', () => { document.getElementById('print-area').innerHTML = `<div style="max-width:800px; margin:0 auto; padding:40px; font-family:serif; color:black; font-size:14pt; white-space:pre-wrap;">${el('doc-a4-content').innerHTML}</div>`; setTimeout(()=>window.print(), 500); }); el('doc-export-pdf').addEventListener('click', async () => { const exportArea = document.getElementById('doc-export-area'); exportArea.innerHTML = `<div style="width: 210mm; min-height: 297mm; background: white; margin: 0 auto; box-sizing: border-box; display: flex; flex-direction: column; overflow: hidden;"> <div style="${el('doc-a4-header').style.cssText}"></div> ${this.state.visualSettings.logo ? `<div style="text-align:center; padding-top:40px;"><img src="${this.state.visualSettings.logo}" style="max-height:80px; max-width:250px; object-fit:contain;"></div>` : ''} <div class="${el('doc-a4-content').className.replace('overflow-y-auto', '')}" style="flex:1; padding: 40px 60px;">${el('doc-a4-content').innerHTML}</div> </div>`; try { const canvas = await html2canvas(exportArea.firstElementChild, { scale: 2, useCORS: true, backgroundColor: '#ffffff' }); const imgData = canvas.toDataURL('image/jpeg', 0.95); const { PDFDocument } = PDFLib; const pdfDoc = await PDFDocument.create(); const page = pdfDoc.addPage([595.28, 841.89]); const image = await pdfDoc.embedJpg(imgData); page.drawImage(image, { x: 0, y: 0, width: 595.28, height: 841.89 }); const pdfBytes = await pdfDoc.save(); const blob = new Blob([pdfBytes], { type: 'application/pdf' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `Documento-${Date.now()}.pdf`; link.click(); ToastManager.show('PDF baixado!', 'success'); } catch(e) { ToastManager.show('Erro ao gerar PDF.', 'error'); } finally { exportArea.innerHTML = ''; } }); rebuildForm(); }
};

const CertificaLegacy = {
    state: { template: 'academic', logo: null, signature: null, useQR: true, primaryColor: '#18181b', batchCSV: null },
    render(container) { const main = `<div class="form-section space-y-6"><div class="flex gap-4"><div class="flex-1"><label class="block text-xs font-bold mb-2">Design</label><select id="cert-template" class="input-premium py-2"><option value="academic">Acadêmico</option><option value="premium">Corporativo</option><option value="minimal">Minimalista</option></select></div><div><label class="block text-xs font-bold mb-2">Cor</label><input type="color" id="cert-color" value="#18181b" class="h-10 w-full rounded-lg cursor-pointer bg-transparent border p-0.5"></div></div><hr class="border-base-200"><div><div class="flex border-b mb-4"><button id="tab-individual" class="px-4 py-2 text-sm font-bold border-b-2 border-base-900">Individual</button><button id="tab-batch" class="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-base-400">Em Lote (CSV)</button></div><div id="cert-mode-single" class="space-y-4"><div class="grid grid-cols-2 gap-4"><div><label class="block text-[10px] font-semibold mb-1">Nome</label><input type="text" id="cert-name" class="input-premium" value="Nome do Aluno"></div><div><label class="block text-[10px] font-semibold mb-1">Curso</label><input type="text" id="cert-course" class="input-premium" value="Masterclass"></div></div><div class="grid grid-cols-3 gap-4"><div><label class="block text-[10px] font-semibold mb-1">Horas</label><input type="text" id="cert-hours" class="input-premium" value="40h"></div><div><label class="block text-[10px] font-semibold mb-1">Data</label><input type="date" id="cert-date" class="input-premium" value="${new Date().toISOString().split('T')[0]}"></div><div><label class="block text-[10px] font-semibold mb-1">Local</label><input type="text" id="cert-location" class="input-premium" value="Recife, PE"></div></div><div class="grid grid-cols-2 gap-4"><div><label class="block text-[10px] font-semibold mb-1">Org</label><input type="text" id="cert-org" class="input-premium" value="Academy"></div><div><label class="block text-[10px] font-semibold mb-1">Resp</label><input type="text" id="cert-resp" class="input-premium" value="Direção"></div></div><div><label class="block text-[10px] font-semibold mb-1">Código</label><input type="text" id="cert-hash" class="input-premium font-mono text-xs" value="MGLB-1234"></div></div><div id="cert-mode-batch" class="space-y-4 hidden"><label class="flex flex-col items-center justify-center h-24 w-full border border-dashed rounded-lg cursor-pointer"><span class="text-xs font-medium" id="lbl-csv-status">Selecionar CSV</span><input type="file" id="cert-csv-input" accept=".csv" class="hidden"></label><button id="cert-batch-btn" class="btn-primary w-full disabled:opacity-50" disabled>Gerar Lote (ZIP)</button></div></div><hr class="border-base-200"><div class="grid grid-cols-3 gap-4"><label class="flex flex-col items-center justify-center h-20 w-full border border-dashed rounded-xl cursor-pointer"><span class="text-[10px] font-medium" id="lbl-cert-logo">Logo</span><input type="file" id="cert-logo-input" accept="image/*" class="hidden"></label><label class="flex flex-col items-center justify-center h-20 w-full border border-dashed rounded-xl cursor-pointer"><span class="text-[10px] font-medium" id="lbl-cert-sig">Assinatura</span><input type="file" id="cert-sig-input" accept="image/*" class="hidden"></label><div class="flex items-center justify-center h-20 w-full border rounded-xl"><label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" id="cert-use-qr" checked class="w-4 h-4 rounded"><span class="text-xs font-medium">QR Code</span></label></div></div></div>`; const side = `<div class="form-section bg-base-100 p-4 flex flex-col items-center"><div class="w-full shadow-premium aspect-[1.414/1] bg-white"><canvas id="cert-canvas" width="1123" height="794" class="w-full h-full object-contain"></canvas></div></div><div class="grid grid-cols-2 gap-3 mt-4"><button id="cert-download-png" class="btn-primary w-full">Baixar PNG</button><button id="cert-download-pdf" class="btn-secondary w-full">Baixar PDF</button></div>`; container.innerHTML = SharedUI.layout('certifica', 'Certifica PRO', 'Geração de certificados de alta qualidade.', main, side); },
    init() { const el = id => document.getElementById(id); const canvas = el('cert-canvas'); const ctx = canvas.getContext('2d'); let qrImg = new Image(); el('tab-individual').addEventListener('click', () => { el('cert-mode-single').classList.remove('hidden'); el('cert-mode-batch').classList.add('hidden'); }); el('tab-batch').addEventListener('click', () => { el('cert-mode-batch').classList.remove('hidden'); el('cert-mode-single').classList.add('hidden'); }); const updateCert = async (overrideName = null) => { const tpl = el('cert-template').value; const primaryColor = el('cert-color').value; const name = overrideName || el('cert-name').value; const hash = el('cert-hash').value; if (el('cert-use-qr').checked && hash) { const qr = new QRCodeStyling({ width: 100, height: 100, data: `valida=${hash}`, margin: 0 }); const qrBlob = await qr.getRawData("png"); qrImg.src = URL.createObjectURL(qrBlob); await new Promise(r => qrImg.onload = r); } ctx.fillStyle = "#ffffff"; ctx.fillRect(0,0,1123,794); if(tpl === 'academic') { ctx.strokeStyle = primaryColor; ctx.lineWidth = 12; ctx.strokeRect(40,40,1043,714); } else if (tpl === 'minimal') { ctx.strokeStyle = primaryColor; ctx.lineWidth = 1; ctx.strokeRect(50,50,1023,694); } ctx.textAlign = "center"; ctx.fillStyle = "#18181b"; ctx.font = "bold 60px 'Inter'"; ctx.fillText("CERTIFICADO", 561, 210); ctx.font = "bold 52px 'Inter'"; ctx.fillStyle = primaryColor; ctx.fillText(name, 561, 390); if(el('cert-use-qr').checked && hash) { ctx.drawImage(qrImg, 90, 620, 80, 80); ctx.textAlign = "left"; ctx.font = "10px 'Inter'"; ctx.fillText(hash, 90, 730); } }; ['cert-template', 'cert-color', 'cert-name', 'cert-hash', 'cert-use-qr'].forEach(id => el(id).addEventListener('input', () => updateCert())); document.fonts.ready.then(() => updateCert()); el('cert-download-png').addEventListener('click', () => { const l = document.createElement('a'); l.download = `Certificado.png`; l.href = canvas.toDataURL('image/png', 1.0); l.click(); }); }
};

const TextoToolLegacy = {
    render(container) { const main = `<div class="form-section"><textarea id="txt-in" class="input-premium h-64 font-mono text-sm resize-y"></textarea><div class="flex gap-2 mt-4"><button class="btn-secondary text-[10px] px-2 py-1" onclick="document.getElementById('txt-in').value=document.getElementById('txt-in').value.toUpperCase()">MAIÚSCULAS</button><button class="btn-secondary text-[10px] px-2 py-1" onclick="document.getElementById('txt-in').value=document.getElementById('txt-in').value.toLowerCase()">minúsculas</button></div></div>`; container.innerHTML = SharedUI.layout('texto', 'Texto Lab', 'Formatação.', main); }, init() {}
};

const ImagemToolLegacy = {
    render(container) { container.innerHTML = SharedUI.layout('imagem', 'Imagem Lab', 'Compressor.', `<div class="form-section"><input type="file" id="img-in" accept="image/*" class="input-premium"><img id="img-prev" class="mt-4 max-h-64 hidden"><button id="img-btn" class="btn-primary w-full mt-4" disabled>Baixar JPG</button></div>`); },
    init() { const inF = document.getElementById('img-in'); const prev = document.getElementById('img-prev'); const btn = document.getElementById('img-btn'); let bUrl = null; inF.addEventListener('change', e => { const f = e.target.files[0]; if(!f) return; const r = new FileReader(); r.onload = ev => { const i = new Image(); i.onload = () => { const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; c.getContext('2d').drawImage(i,0,0); c.toBlob(blob => { if(bUrl) URL.revokeObjectURL(bUrl); bUrl = URL.createObjectURL(blob); prev.src=bUrl; prev.classList.remove('hidden'); btn.disabled=false; }, 'image/jpeg', 0.8); }; i.src = ev.target.result; }; r.readAsDataURL(f); }); btn.addEventListener('click', () => { const l = document.createElement('a'); l.download = 'img.jpg'; l.href = bUrl; l.click(); }); }
};

const SorteadorLegacy = {
    render(container) { container.innerHTML = SharedUI.layout('sorteador', 'Sorteador', 'Motor de decisão.', `<div class="form-section"><textarea id="sort-in" class="input-premium h-64" placeholder="Nomes..."></textarea><button id="sort-btn" class="btn-primary mt-4 w-full">Sortear</button></div>`, `<div class="form-section text-center"><h3 class="font-bold text-3xl mt-10" id="sort-res">?</h3></div>`); },
    init() { document.getElementById('sort-btn').addEventListener('click', () => { const items = document.getElementById('sort-in').value.split('\n').filter(i=>i); if(items.length>1) document.getElementById('sort-res').innerText = items[Math.floor(Math.random()*items.length)]; }); }
};

// ==========================================
// 3. CERTIFICA (Aprimorado - Nível Premium)
// ==========================================
const Certifica = {
    state: {
        template: 'academic',
        logo: null,
        signature: null,
        useQR: true,
        primaryColor: '#18181b',
        batchCSV: null
    },

    render(container) {
        const main = `
            <div class="form-section space-y-6">
                <!-- TEMPLATES & ESTILO -->
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1">
                        <label class="block text-xs font-bold text-base-500 uppercase tracking-wider mb-2">Design e Estilo</label>
                        <select id="cert-template" class="input-premium py-2">
                            <option value="academic">Acadêmico Clássico</option>
                            <option value="premium">Corporativo Premium</option>
                            <option value="minimal">Minimalista Moderno</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-base-500 uppercase tracking-wider mb-2">Cor Principal</label>
                        <input type="color" id="cert-color" value="#18181b" class="h-10 w-full rounded-lg cursor-pointer bg-transparent border border-base-200 p-0.5">
                    </div>
                </div>

                <hr class="border-base-200 dark:border-base-800">

                <!-- MODO DE GERAÇÃO (TABS) -->
                <div>
                    <div class="flex border-b border-base-200 dark:border-base-800 mb-4">
                        <button id="tab-individual" class="px-4 py-2 text-sm font-bold border-b-2 border-base-900 dark:border-white text-base-900 dark:text-white">Gerar Individual</button>
                        <button id="tab-batch" class="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-base-400 hover:text-base-600 transition-colors">Geração em Lote (CSV)</button>
                    </div>

                    <!-- SINGLE MODE -->
                    <div id="cert-mode-single" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-[10px] font-semibold mb-1">Nome do Participante</label><input type="text" id="cert-name" class="input-premium" value="Luciano Vital Designer"></div>
                            <div><label class="block text-[10px] font-semibold mb-1">Evento / Curso</label><input type="text" id="cert-course" class="input-premium" value="Imersão Front-End Avançada"></div>
                        </div>
                        <div class="grid grid-cols-3 gap-4">
                            <div><label class="block text-[10px] font-semibold mb-1">Carga Horária</label><input type="text" id="cert-hours" class="input-premium" value="40 Horas"></div>
                            <div><label class="block text-[10px] font-semibold mb-1">Data</label><input type="date" id="cert-date" class="input-premium" value="${new Date().toISOString().split('T')[0]}"></div>
                            <div><label class="block text-[10px] font-semibold mb-1">Local / Cidade</label><input type="text" id="cert-location" class="input-premium" value="Recife, PE"></div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-[10px] font-semibold mb-1">Instituição</label><input type="text" id="cert-org" class="input-premium" value="MargemLab Academy"></div>
                            <div><label class="block text-[10px] font-semibold mb-1">Nome Responsável</label><input type="text" id="cert-resp" class="input-premium" value="Direção Acadêmica"></div>
                        </div>
                        <div>
                            <label class="block text-[10px] font-semibold mb-1">Código Único de Validação (Opcional)</label>
                            <div class="flex gap-2">
                                <input type="text" id="cert-hash" class="input-premium font-mono text-xs" value="MGLB-${Math.floor(1000 + Math.random() * 9000)}-2026">
                                <button id="cert-gen-hash" class="btn-secondary px-3 !w-auto" title="Gerar Novo"><i data-lucide="refresh-cw" class="w-4 h-4"></i></button>
                            </div>
                        </div>
                    </div>

                    <!-- BATCH MODE -->
                    <div id="cert-mode-batch" class="space-y-4 hidden">
                        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                            <h4 class="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">Como funciona a geração em lote?</h4>
                            <p class="text-xs text-blue-600 dark:text-blue-400 mb-3">O design atual e os campos fixos (Curso, Carga Horária, Data) serão aplicados a todos. Suba um arquivo .CSV contendo apenas os <strong>Nomes dos Alunos</strong> (um por linha).</p>
                            <label class="flex flex-col items-center justify-center h-24 w-full bg-white dark:bg-base-900 border border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50/50 transition-colors">
                                <i data-lucide="file-spreadsheet" class="w-6 h-6 mb-2 text-blue-500"></i>
                                <span class="text-xs font-medium" id="lbl-csv-status">Selecionar arquivo CSV</span>
                                <input type="file" id="cert-csv-input" accept=".csv" class="hidden">
                            </label>
                        </div>
                        <button id="cert-batch-btn" class="btn-primary w-full disabled:opacity-50" disabled><i data-lucide="layers"></i> Gerar e Baixar Lote (ZIP)</button>
                        <p class="text-[10px] text-base-400 text-center"><i data-lucide="shield" class="w-3 h-3 inline"></i> O processamento é 100% local. Nenhum dado é enviado à internet.</p>
                    </div>
                </div>

                <hr class="border-base-200 dark:border-base-800">

                <!-- ASSETS (Logo, Assinatura, QR) -->
                <div>
                    <label class="block text-xs font-bold text-base-500 uppercase tracking-wider mb-3">Ativos Visuais</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label class="flex flex-col items-center justify-center h-20 w-full bg-base-50 dark:bg-base-900/50 border border-dashed border-base-300 rounded-xl cursor-pointer hover:bg-base-100 transition-colors">
                            <span class="text-[10px] font-medium text-base-500" id="lbl-cert-logo">Logo da Instituição</span>
                            <input type="file" id="cert-logo-input" accept="image/*" class="hidden">
                        </label>
                        <label class="flex flex-col items-center justify-center h-20 w-full bg-base-50 dark:bg-base-900/50 border border-dashed border-base-300 rounded-xl cursor-pointer hover:bg-base-100 transition-colors">
                            <span class="text-[10px] font-medium text-base-500" id="lbl-cert-sig">Assinatura Digital</span>
                            <input type="file" id="cert-sig-input" accept="image/*" class="hidden">
                        </label>
                        <div class="flex items-center justify-center h-20 w-full bg-base-50 dark:bg-base-900/50 border border-base-200 rounded-xl">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" id="cert-use-qr" checked class="w-4 h-4 rounded">
                                <span class="text-xs font-medium">Incluir QR Code<br><span class="text-[9px] text-base-400">Verificação de Autenticidade</span></span>
                            </label>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 mt-2">
                        <button id="cert-clear-assets" class="text-[10px] text-red-500 hover:underline">Limpar Logo e Assinatura</button>
                    </div>
                </div>
            </div>`;

        const side = `
            <div class="form-section bg-base-100 dark:bg-base-950 p-4 flex flex-col items-center overflow-hidden">
                <div class="w-full relative shadow-premium rounded-sm bg-white aspect-[1.414/1] max-w-[500px]">
                    <canvas id="cert-canvas" width="1123" height="794" class="w-full h-full object-contain"></canvas>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3 mt-4">
                <button id="cert-download-png" class="btn-primary w-full"><i data-lucide="image"></i> Baixar PNG</button>
                <button id="cert-download-pdf" class="btn-secondary w-full"><i data-lucide="file-text"></i> Baixar PDF</button>
            </div>
        `;
        container.innerHTML = SharedUI.layout('certifica', 'Certifica PRO', 'Geração de certificados de alta qualidade com validação e suporte a lotes.', main, side);
    },

    init() {
        const el = id => document.getElementById(id);
        const canvas = el('cert-canvas');
        const ctx = canvas.getContext('2d');
        
        let qrImg = new Image(); // Cache para o QR Code gerado

        // TABS Logic
        el('tab-individual').addEventListener('click', () => {
            el('tab-individual').classList.replace('border-transparent', 'border-base-900'); el('tab-individual').classList.replace('text-base-400', 'text-base-900');
            el('tab-batch').classList.replace('border-base-900', 'border-transparent'); el('tab-batch').classList.replace('text-base-900', 'text-base-400');
            el('cert-mode-single').classList.remove('hidden'); el('cert-mode-batch').classList.add('hidden');
        });
        el('tab-batch').addEventListener('click', () => {
            el('tab-batch').classList.replace('border-transparent', 'border-base-900'); el('tab-batch').classList.replace('text-base-400', 'text-base-900');
            el('tab-individual').classList.replace('border-base-900', 'border-transparent'); el('tab-individual').classList.replace('text-base-900', 'text-base-400');
            el('cert-mode-batch').classList.remove('hidden'); el('cert-mode-single').classList.add('hidden');
        });

        // HASH Generator
        el('cert-gen-hash').addEventListener('click', () => {
            el('cert-hash').value = `MGLB-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${new Date().getFullYear()}`;
            updateCert();
        });

        // Assets Upload
        const handleImageUpload = (inputId, stateKey, lblId, defaultText) => {
            el(inputId).addEventListener('change', (e) => {
                const file = e.target.files[0];
                if(!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const img = new Image();
                    img.onload = () => { this.state[stateKey] = img; el(lblId).innerText = "Carregado (Pronto)"; updateCert(); };
                    img.src = ev.target.result;
                };
                reader.readAsDataURL(file);
            });
        };
        handleImageUpload('cert-logo-input', 'logo', 'lbl-cert-logo', 'Logo da Instituição');
        handleImageUpload('cert-sig-input', 'signature', 'lbl-cert-sig', 'Assinatura Digital');

        el('cert-clear-assets').addEventListener('click', () => {
            this.state.logo = null; this.state.signature = null;
            el('cert-logo-input').value = ''; el('cert-sig-input').value = '';
            el('lbl-cert-logo').innerText = 'Logo da Instituição'; el('lbl-cert-sig').innerText = 'Assinatura Digital';
            updateCert();
        });

        // CSV Logic
        el('cert-csv-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(!file) return;
            el('lbl-csv-status').innerText = `Lendo ${file.name}...`;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const text = ev.target.result;
                this.state.batchCSV = text.split(/\r?\n/).map(row => row.split(',')[0].trim()).filter(n => n.length > 2);
                if(this.state.batchCSV.length > 0) {
                    el('lbl-csv-status').innerHTML = `<b class="text-green-600">${this.state.batchCSV.length} nomes identificados.</b>`;
                    el('cert-batch-btn').disabled = false;
                } else {
                    el('lbl-csv-status').innerHTML = `<b class="text-red-500">Nenhum nome válido.</b>`;
                    el('cert-batch-btn').disabled = true;
                }
            };
            reader.readAsText(file);
        });

        // Update Logic / Draw Engine
        const updateCert = async (overrideName = null, overrideHash = null) => {
            const tpl = el('cert-template').value;
            const primaryColor = el('cert-color').value;
            const name = overrideName || el('cert-name').value || "Nome do Aluno";
            const course = el('cert-course').value || "Curso";
            const hours = el('cert-hours').value;
            const rawDate = el('cert-date').value;
            const date = rawDate ? rawDate.split('-').reverse().join('/') : '--';
            const location = el('cert-location').value;
            const org = el('cert-org').value;
            const resp = el('cert-resp').value;
            const hash = overrideHash || el('cert-hash').value;
            const useQR = el('cert-use-qr').checked;

            // Generate QR Code Object if needed
            if (useQR && hash) {
                const validationUrl = `https://margemlab.com/valida?code=${hash}`;
                const qr = new QRCodeStyling({ width: 100, height: 100, data: validationUrl, margin: 0, qrOptions: { errorCorrectionLevel: 'M' } });
                const qrBlob = await qr.getRawData("png");
                qrImg.src = URL.createObjectURL(qrBlob);
                await new Promise(r => qrImg.onload = r);
            }

            // 1. Clear & Background
            ctx.fillStyle = "#ffffff"; ctx.fillRect(0,0,1123,794);

            // 2. Borders & Styles based on Template
            if(tpl === 'academic') {
                ctx.strokeStyle = primaryColor; ctx.lineWidth = 12; ctx.strokeRect(40,40,1043,714);
                ctx.strokeStyle = "#e4e4e7"; ctx.lineWidth = 2; ctx.strokeRect(55,55,1013,684);
                // Corner details
                ctx.fillStyle = primaryColor;
                ctx.fillRect(40,40, 30,30); ctx.fillRect(1053,40, 30,30);
                ctx.fillRect(40,724, 30,30); ctx.fillRect(1053,724, 30,30);
            } else if (tpl === 'premium') {
                // Corpo com faixa lateral
                ctx.fillStyle = primaryColor; ctx.fillRect(0,0, 40, 794);
                ctx.fillStyle = primaryColor + '11'; ctx.fillRect(40,0, 1083, 794); // Very light tint
                ctx.strokeStyle = primaryColor; ctx.lineWidth = 4; ctx.strokeRect(60,40,1023,714);
            } else if (tpl === 'minimal') {
                ctx.strokeStyle = primaryColor; ctx.lineWidth = 1; ctx.strokeRect(50,50,1023,694);
                ctx.beginPath(); ctx.moveTo(50, 180); ctx.lineTo(1073, 180); ctx.stroke();
            }

            // 3. Logo
            if(this.state.logo) {
                // Resize preserving aspect ratio (max height 80, max width 250)
                const maxH = 80; const maxW = 250;
                let w = this.state.logo.width; let h = this.state.logo.height;
                if(h > maxH) { w = w * (maxH/h); h = maxH; }
                if(w > maxW) { h = h * (maxW/w); w = maxW; }
                ctx.drawImage(this.state.logo, 561 - (w/2), 70, w, h);
            }

            // 4. Texts
            ctx.textAlign = "center";
            
            // Header
            ctx.fillStyle = tpl === 'minimal' ? primaryColor : "#18181b";
            ctx.font = tpl === 'academic' ? "bold 55px 'Georgia', serif" : "900 60px 'Inter', sans-serif"; 
            ctx.fillText("CERTIFICADO", 561, tpl === 'minimal' ? 140 : 210);
            
            // Subtitle
            ctx.font = "20px 'Inter', sans-serif"; 
            ctx.fillStyle = "#71717a";
            ctx.fillText("Certificamos orgulhosamente que", 561, tpl === 'minimal' ? 240 : 300);
            
            // Name
            ctx.font = tpl === 'academic' ? "italic bold 52px 'Georgia', serif" : "bold 52px 'Inter', sans-serif"; 
            ctx.fillStyle = primaryColor;
            ctx.fillText(name, 561, tpl === 'minimal' ? 320 : 390);
            
            // Body text
            ctx.font = "20px 'Inter', sans-serif"; 
            ctx.fillStyle = "#71717a";
            ctx.fillText(`concluiu com êxito os requisitos do programa com carga horária de ${hours}:`, 561, tpl === 'minimal' ? 400 : 470);
            
            // Course
            ctx.font = "bold 28px 'Inter', sans-serif"; 
            ctx.fillStyle = "#18181b";
            ctx.fillText(course, 561, tpl === 'minimal' ? 460 : 530);

            // Metadata line (Date / Location)
            ctx.font = "16px 'Inter', sans-serif"; 
            ctx.fillStyle = "#52525b";
            ctx.fillText(`${location}, ${date}`, 561, tpl === 'minimal' ? 510 : 580);

            // 5. Footer (Signatures & Verification)
            // Signature Line
            if(this.state.signature) {
                // Signature image
                let sw = this.state.signature.width; let sh = this.state.signature.height;
                const maxSH = 60; if(sh > maxSH) { sw = sw * (maxSH/sh); sh = maxSH; }
                ctx.drawImage(this.state.signature, 561 - (sw/2), 630, sw, sh);
            }
            ctx.beginPath(); ctx.moveTo(400, 690); ctx.lineTo(722, 690); 
            ctx.strokeStyle = "#18181b"; ctx.lineWidth = 1; ctx.stroke();
            
            ctx.font = "bold 16px 'Inter', sans-serif"; ctx.fillStyle = "#18181b"; ctx.fillText(resp, 561, 715);
            ctx.font = "14px 'Inter', sans-serif"; ctx.fillStyle = "#71717a"; ctx.fillText(org, 561, 735);

            // QR & Hash
            if(useQR && hash) {
                ctx.drawImage(qrImg, 90, 620, 80, 80);
                ctx.textAlign = "left";
                ctx.font = "10px 'Inter', sans-serif"; ctx.fillStyle = "#a1a1aa";
                ctx.fillText("Validar Autenticidade", 90, 715);
                ctx.font = "bold 10px 'Inter', monospace"; ctx.fillStyle = primaryColor;
                ctx.fillText(hash, 90, 730);
            }
            
            // Watermark (if premium)
            if(tpl === 'premium') {
                ctx.save(); ctx.translate(1123/2, 794/2); ctx.rotate(-Math.PI/4);
                ctx.font = "bold 150px 'Inter', sans-serif"; ctx.fillStyle = primaryColor + "08"; ctx.textAlign = "center";
                ctx.fillText(org.toUpperCase(), 0, 0);
                ctx.restore();
            }
        };

        // Listeners for live update
        ['cert-template', 'cert-color', 'cert-name', 'cert-course', 'cert-hours', 'cert-date', 'cert-location', 'cert-org', 'cert-resp', 'cert-hash', 'cert-use-qr'].forEach(id => {
            el(id).addEventListener('input', () => updateCert());
        });

        // Action: Export Single
        el('cert-download-png').addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = `Certificado-${el('cert-name').value.replace(/\s+/g, '-')}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
            ToastManager.show('Certificado PNG exportado.', 'success');
        });

        el('cert-download-pdf').addEventListener('click', async () => {
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const { PDFDocument } = PDFLib;
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([841.89, 595.28]); // A4 Landscape pts
            const image = await pdfDoc.embedJpg(imgData);
            page.drawImage(image, { x: 0, y: 0, width: 841.89, height: 595.28 });
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
            link.download = `Certificado-${el('cert-name').value.replace(/\s+/g, '-')}.pdf`;
            link.click();
            ToastManager.show('Certificado PDF exportado.', 'success');
        });

        // Action: Batch Export (ZIP)
        el('cert-batch-btn').addEventListener('click', async () => {
            if(!this.state.batchCSV || this.state.batchCSV.length === 0) return;
            const btn = el('cert-batch-btn');
            btn.innerHTML = `<i data-lucide="loader" class="animate-spin"></i> Processando ${this.state.batchCSV.length} arquivos...`;
            btn.disabled = true; lucide.createIcons();

            const zip = new JSZip();
            const folder = zip.folder("Certificados_MargemLab");

            // Process async loop not to freeze completely
            for(let i = 0; i < this.state.batchCSV.length; i++) {
                const studentName = this.state.batchCSV[i];
                const uniqueHash = `MGLB-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${new Date().getFullYear()}`;
                
                await updateCert(studentName, uniqueHash); // Render frame
                
                // Get Blob
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                folder.file(`Certificado_${studentName.replace(/[^a-z0-9]/gi, '_')}_${uniqueHash}.png`, blob);
            }

            // Re-render original
            updateCert();

            // Zip & Download
            btn.innerHTML = `<i data-lucide="loader" class="animate-spin"></i> Compactando ZIP...`; lucide.createIcons();
            zip.generateAsync({type:"blob"}).then(function(content) {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = `Lote_Certificados_${Date.now()}.zip`;
                link.click();
                ToastManager.show('Lote exportado com sucesso!', 'success');
                btn.innerHTML = `<i data-lucide="layers"></i> Gerar e Baixar Lote (ZIP)`;
                btn.disabled = false; lucide.createIcons();
            });
        });

        // Initialize fonts and render
        document.fonts.ready.then(() => updateCert());
    }
};

// ==========================================
// 4. DOCUMENTA PRO (Motor de Documentação)
// ==========================================
const Documenta = {
    state: {
        activeTab: 'new', // 'new' | 'history'
        currentTemplateId: 'orcamento',
        formData: {},
        visualSettings: {
            style: 'classic', // classic | modern | corporate
            color: '#18181b',
            logo: null
        },
        history: JSON.parse(localStorage.getItem('margemlab_docs_history') || '[]')
    },

    templates: [
        {
            id: 'orcamento',
            name: 'Orçamento Comercial',
            category: 'Negócios',
            content: `**ORÇAMENTO DE PRESTAÇÃO DE SERVIÇOS**\n\n**1. DADOS DO CLIENTE**\nCliente: {{NOME_DO_CLIENTE}}\nDocumento: {{CPF_CNPJ_CLIENTE}}\nEndereço: {{ENDERECO_CLIENTE}}\n\n**2. DESCRIÇÃO DOS SERVIÇOS**\n{{DESCRICAO_DO_SERVICO}}\n\n**3. INVESTIMENTO E PRAZOS**\nValor Total: **R$ {{VALOR_TOTAL}}**\nCondições de Pagamento: {{FORMA_DE_PAGAMENTO}}\nValidade desta proposta: {{VALIDADE_DIAS}} dias.\nPrazo de Execução: {{PRAZO_DE_ENTREGA}}\n\n{{SE_OBSERVACOES}}\n**Observações adicionais:**\n{{OBSERVACOES}}\n{{FIM_SE}}\n\nAtenciosamente,\n\n___________________________________\n**{{NOME_DA_SUA_EMPRESA}}**\n{{SEU_TELEFONE}} | {{SEU_EMAIL}}\n{{DATA_ATUAL}}`
        },
        {
            id: 'contrato',
            name: 'Contrato Simples de Serviço',
            category: 'Jurídico',
            content: `**CONTRATO DE PRESTAÇÃO DE SERVIÇOS**\n\n**CONTRATANTE:** {{NOME_CONTRATANTE}}, inscrito no CPF/CNPJ sob o nº {{DOC_CONTRATANTE}}, residente/sediado em {{ENDERECO_CONTRATANTE}}.\n\n**CONTRATADO(A):** {{NOME_CONTRATADO}}, inscrito no CPF/CNPJ sob o nº {{DOC_CONTRATADO}}.\n\nAs partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços, que se regerá pelas cláusulas a seguir:\n\n**Cláusula 1 - Objeto:** O CONTRATADO obriga-se a prestar os serviços de {{DESCRICAO_SERVICO}}.\n\n**Cláusula 2 - Valor:** Pela prestação dos serviços, a CONTRATANTE pagará o valor de **R$ {{VALOR_TOTAL}}**.\n\n**Cláusula 3 - Prazo:** O serviço será concluído até o dia {{DATA_DE_ENTREGA}}.\n\nE, por estarem de pleno acordo, assinam o presente contrato.\n\n{{CIDADE_ESTADO}}, {{DATA_ATUAL}}\n\n\n_________________________________\n{{NOME_CONTRATANTE}} (Contratante)\n\n_________________________________\n{{NOME_CONTRATADO}} (Contratado)`
        },
        {
            id: 'recibo',
            name: 'Recibo de Pagamento',
            category: 'Financeiro',
            content: `**RECIBO DE PAGAMENTO**\n\n**VALOR: R$ {{VALOR_RECEBIDO}}**\n**Nº: {{NUMERO_DO_RECIBO}}**\n\nRecebi(emos) de **{{NOME_PAGADOR}}**, CPF/CNPJ nº {{DOC_PAGADOR}}, a importância supra de R$ {{VALOR_RECEBIDO}} referente a {{REFERENCIA_DO_PAGAMENTO}}.\n\nPara maior clareza, firmo o presente recibo para que produza os seus efeitos legais.\n\n{{CIDADE_ESTADO}}, {{DATA_ATUAL}}\n\n\n___________________________________\n**{{NOME_RECEBEDOR}}**\nCPF/CNPJ: {{DOC_RECEBEDOR}}`
        },
        {
            id: 'uso_imagem',
            name: 'Autorização de Uso de Imagem',
            category: 'Legal',
            content: `**TERMO DE AUTORIZAÇÃO DE USO DE IMAGEM E VOZ**\n\nEu, **{{NOME_COMPLETO}}**, inscrito(a) no CPF sob o nº {{CPF}}, residente e domiciliado(a) em {{ENDERECO_COMPLETO}}, AUTORIZO o uso de minha imagem, bem como som de voz, em fotos ou vídeo, pelo(a) **{{NOME_DA_EMPRESA_AUTORIZADA}}**, para fins de {{FINALIDADE_DO_USO}}.\n\nA presente autorização é concedida a título gratuito, abrangendo o uso da imagem em todo território nacional e no exterior, em todas as suas modalidades e plataformas (redes sociais, sites, material impresso).\n\nPor esta ser a expressão da minha vontade, declaro que autorizo o uso acima descrito sem que nada haja a ser reclamado a título de direitos conexos à minha imagem ou a qualquer outro.\n\n{{CIDADE_ESTADO}}, {{DATA_ATUAL}}\n\n\n___________________________________\n{{NOME_COMPLETO}}`
        },
        {
            id: 'builder',
            name: '⚡ Construtor Livre (Crie o seu)',
            category: 'Avançado',
            content: `**{{TITULO_DO_SEU_DOCUMENTO}}**\n\nDigite seu próprio texto livremente aqui. Para criar campos inteligentes que você preencherá repetidas vezes, coloque o nome do campo entre duas chaves. \n\nExemplo: Eu me chamo {{MEU_NOME}} e atuo na área de {{MINHA_AREA_DE_ATUACAO}}.\n\nPara criar blocos que só aparecem se o campo for preenchido, use SE_CAMPO e FIM_SE.\n\n{{SE_MOSTRAR_RODAPE}}\nBloco opcional exibido.\n{{FIM_SE}}\n\n_______________________\nAssinatura`
        }
    ],

    // --- Core Engine: Formatter & Parser ---
    formatters: {
        cpf_cnpj: (val) => val.replace(/\D/g, '').length > 11 
            ? val.replace(/\D/g, '').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
            : val.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"),
        telefone: (val) => val.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3"),
        moeda: (val) => {
            const num = val.replace(/\D/g, '');
            if(!num) return '';
            return (parseFloat(num) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    },

    extractTags(text) {
        // Encontra todas as tags normais, ignorando SE_ e FIM_SE
        const matches = [...text.matchAll(/{{(?!SE_)(?!FIM_SE)([^}]+)}}/g)].map(m => m[1]);
        return [...new Set(matches)]; // Unique
    },

    parseTemplate(text, formData) {
        let output = text;
        
        // 1. Process Conditionals: {{SE_CAMPO}} ... {{FIM_SE}}
        // Se a variável existir e não for vazia, mantém o interior. Senão, apaga.
        const condRegex = /{{SE_([^}]+)}}([\s\S]*?){{FIM_SE}}/g;
        output = output.replace(condRegex, (match, field, innerContent) => {
            const val = formData[field];
            if(val && val.trim() !== '') return innerContent.trim();
            return '';
        });

        // 2. Process Variables: {{CAMPO}}
        // Substitui quebras de linha Markdown por <br> e aplica negrito Markdown (**texto**)
        output = output.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        output = output.replace(/\n/g, '<br>');

        const varRegex = /{{(?!SE_)(?!FIM_SE)([^}]+)}}/g;
        output = output.replace(varRegex, (match, field) => {
            const val = formData[field];
            return val ? `<span class="doc-bound-value">${val}</span>` : `<span class="text-base-300 dark:text-base-700 bg-base-100 dark:bg-base-900 px-1 rounded">[${field.replace(/_/g, ' ')}]</span>`;
        });

        return output;
    },

    // --- Renderização ---
    render(container) {
        const main = `
            <!-- NAVEGAÇÃO SUPERIOR -->
            <div class="flex gap-4 border-b border-base-200 dark:border-base-800 mb-6">
                <button id="doc-tab-new" class="pb-3 text-sm font-bold border-b-2 border-base-900 dark:border-white text-base-900 dark:text-white transition-colors"><i data-lucide="file-plus" class="inline w-4 h-4 mr-1"></i> Criar Documento</button>
                <button id="doc-tab-history" class="pb-3 text-sm font-medium border-b-2 border-transparent text-base-400 hover:text-base-600 transition-colors"><i data-lucide="folder-clock" class="inline w-4 h-4 mr-1"></i> Meus Documentos (<span id="doc-history-count">0</span>)</button>
            </div>

            <!-- VIEW: NOVO DOCUMENTO -->
            <div id="doc-view-new" class="form-section space-y-6">
                
                <!-- Seleção e Estilo -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-base-50 dark:bg-base-900/40 rounded-xl border border-base-200 dark:border-base-800">
                    <div>
                        <label class="block text-[10px] font-bold text-base-500 uppercase tracking-wider mb-2">1. Escolha o Modelo</label>
                        <select id="doc-select-template" class="input-premium py-2 text-sm font-semibold"></select>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[10px] font-bold text-base-500 uppercase tracking-wider mb-2">Estilo A4</label>
                            <select id="doc-select-style" class="input-premium py-2 text-sm">
                                <option value="classic">Clássico (Serif)</option>
                                <option value="modern">Moderno (Sans)</option>
                                <option value="corporate">Corporativo (Faixa)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-base-500 uppercase tracking-wider mb-2">Cor (Destaque)</label>
                            <input type="color" id="doc-color" value="#18181b" class="h-10 w-full rounded-lg cursor-pointer bg-transparent border border-base-200 p-0.5">
                        </div>
                    </div>
                </div>

                <!-- Construtor Livre (Só aparece se Template = Builder) -->
                <div id="doc-builder-area" class="hidden">
                    <label class="block text-xs font-bold text-base-500 uppercase tracking-wider mb-2">Editor de Template (Use {{TAGS}})</label>
                    <textarea id="doc-builder-source" class="input-premium h-40 font-mono text-[11px] leading-relaxed"></textarea>
                </div>

                <!-- Formulário Smart Fields -->
                <div>
                    <div class="flex justify-between items-center mb-4 border-b border-base-200 dark:border-base-800 pb-2">
                        <label class="block text-xs font-bold text-base-500 uppercase tracking-wider">2. Preencha os Dados</label>
                        <button id="doc-clear-fields" class="text-[10px] text-base-400 hover:text-red-500 transition-colors">Limpar Campos</button>
                    </div>
                    <div id="doc-smart-fields" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Campos gerados dinamicamente via parser -->
                    </div>
                </div>

                <!-- Opcional: Logo e Salvar -->
                <div class="flex flex-col md:flex-row gap-4 items-center pt-4 border-t border-base-200 dark:border-base-800">
                    <div class="flex-1 w-full">
                        <label class="flex items-center justify-center gap-2 h-12 w-full bg-white dark:bg-base-900 border border-dashed border-base-300 dark:border-base-700 rounded-xl cursor-pointer hover:bg-base-50 transition-colors">
                            <i data-lucide="image" class="w-4 h-4 text-base-400"></i>
                            <span class="text-xs font-medium" id="doc-lbl-logo">Adicionar Timbre / Logo</span>
                            <input type="file" id="doc-input-logo" accept="image/*" class="hidden">
                        </label>
                    </div>
                    <button id="doc-save-history" class="btn-secondary flex-1 py-3"><i data-lucide="save" class="w-4 h-4"></i> Salvar no Histórico</button>
                </div>
            </div>

            <!-- VIEW: HISTÓRICO -->
            <div id="doc-view-history" class="hidden space-y-4">
                <div class="form-section">
                    <p class="text-xs text-base-500 mb-6">Os documentos abaixo estão salvos apenas no seu navegador (Local Storage). Eles não foram enviados para nenhum servidor.</p>
                    <div id="doc-history-list" class="space-y-3">
                        <!-- Itens do histórico -->
                    </div>
                </div>
            </div>
        `;

        const side = `
            <div class="form-section flex flex-col h-full bg-base-100 dark:bg-base-950 p-4 md:p-6 rounded-2xl">
                <div class="flex justify-between items-center mb-4">
                    <label class="block text-[10px] font-bold text-base-500 uppercase tracking-wider">3. Pré-Visualização A4</label>
                    <button id="doc-toggle-edit" class="text-[10px] px-3 py-1.5 rounded-lg border border-base-300 dark:border-base-700 bg-white dark:bg-base-900 hover:border-base-900 transition-colors shadow-sm font-medium flex items-center gap-2"><i data-lucide="edit-3" class="w-3 h-3"></i> Revisar / Tocar no Texto</button>
                </div>
                
                <!-- CONTAINER A4 REAL -->
                <div class="w-full relative shadow-premium bg-white flex-1 overflow-hidden flex flex-col" style="aspect-ratio: 1 / 1.414; max-height: 800px;">
                    <!-- Cabecalho Corporativo Dinâmico -->
                    <div id="doc-a4-header" class="w-full h-2 flex-shrink-0"></div>
                    
                    <div class="w-full px-8 pt-8 flex justify-center flex-shrink-0">
                        <img id="doc-a4-logo" class="max-h-16 max-w-[200px] object-contain hidden" />
                    </div>

                    <!-- Corpo Editável -->
                    <div id="doc-a4-content" class="w-full flex-1 p-8 text-black text-[12px] leading-[1.8] outline-none overflow-y-auto doc-style-classic" contenteditable="false"></div>
                </div>

                <div class="grid grid-cols-2 gap-3 mt-6">
                    <button id="doc-export-pdf" class="btn-primary w-full py-3"><i data-lucide="file-down"></i> Baixar PDF</button>
                    <button id="doc-print-btn" class="btn-secondary w-full py-3"><i data-lucide="printer"></i> Imprimir</button>
                </div>
            </div>
        `;
        container.innerHTML = SharedUI.layout('documenta', 'Documenta PRO', 'Motor inteligente de documentos. Crie formulários automaticamente baseados em variáveis.', main, side);
    },

    init() {
        const el = id => document.getElementById(id);
        const today = new Date().toLocaleDateString('pt-BR');

        // Defaults inteligentes iniciais
        this.state.formData = { 'DATA_ATUAL': today, 'CIDADE_ESTADO': 'Sua Cidade/UF', 'NOME_DA_SUA_EMPRESA': 'Sua Empresa LTDA' };

        // 1. Popula os Selects
        el('doc-select-template').innerHTML = this.templates.map(t => `<option value="${t.id}">${t.category} - ${t.name}</option>`).join('');
        el('doc-history-count').innerText = this.state.history.length;

        // 2. Lógica de TABS
        const setTab = (tab) => {
            this.state.activeTab = tab;
            if(tab === 'new') {
                el('doc-tab-new').classList.replace('border-transparent', 'border-base-900'); el('doc-tab-new').classList.replace('text-base-400', 'text-base-900');
                el('doc-tab-history').classList.replace('border-base-900', 'border-transparent'); el('doc-tab-history').classList.replace('text-base-900', 'text-base-400');
                el('doc-view-new').classList.remove('hidden'); el('doc-view-history').classList.add('hidden');
            } else {
                el('doc-tab-history').classList.replace('border-transparent', 'border-base-900'); el('doc-tab-history').classList.replace('text-base-400', 'text-base-900');
                el('doc-tab-new').classList.replace('border-base-900', 'border-transparent'); el('doc-tab-new').classList.replace('text-base-900', 'text-base-400');
                el('doc-view-history').classList.remove('hidden'); el('doc-view-new').classList.add('hidden');
                renderHistory();
            }
        };
        el('doc-tab-new').addEventListener('click', () => setTab('new'));
        el('doc-tab-history').addEventListener('click', () => setTab('history'));

        // 3. Engine de Geração de Formulário (O Core)
        const rebuildForm = () => {
            const tplId = el('doc-select-template').value;
            this.state.currentTemplateId = tplId;
            let sourceContent = '';

            if (tplId === 'builder') {
                el('doc-builder-area').classList.remove('hidden');
                // Pega do textarea se já existir, senão carrega o default
                sourceContent = el('doc-builder-source').value || this.templates.find(t=>t.id==='builder').content;
                el('doc-builder-source').value = sourceContent;
            } else {
                el('doc-builder-area').classList.add('hidden');
                sourceContent = this.templates.find(t => t.id === tplId).content;
            }

            const tags = this.extractTags(sourceContent);
            const container = el('doc-smart-fields');
            
            // Verifica se as tags mudaram para não reconstruir os inputs atoa (perde focus)
            const currentRenderedTags = Array.from(container.querySelectorAll('.doc-smart-input')).map(inp => inp.dataset.tag);
            if(JSON.stringify(tags) !== JSON.stringify(currentRenderedTags)) {
                if(tags.length === 0) {
                    container.innerHTML = `<p class="text-xs text-base-400 col-span-2 py-4">Nenhuma variável inteligente {{TAG}} encontrada no documento.</p>`;
                } else {
                    container.innerHTML = tags.map(tag => {
                        const val = this.state.formData[tag] || '';
                        const label = tag.replace(/_/g, ' ');
                        let maskHint = '';
                        if(tag.includes('CPF') || tag.includes('DOC')) maskHint = '000.000.000-00';
                        if(tag.includes('VALOR')) maskHint = 'R$ 0,00';
                        if(tag.includes('TELEFONE')) maskHint = '(00) 00000-0000';

                        return `
                            <div>
                                <label class="block text-[10px] font-bold text-base-500 mb-1 capitalize">${label}</label>
                                <input type="text" data-tag="${tag}" value="${val}" class="input-premium doc-smart-input py-2.5 text-xs font-medium" placeholder="${maskHint || 'Preencher...'}">
                            </div>
                        `;
                    }).join('');

                    // Bind events & masks
                    container.querySelectorAll('.doc-smart-input').forEach(inp => {
                        inp.addEventListener('input', (e) => {
                            let val = e.target.value;
                            const tag = e.target.dataset.tag;
                            // Aplica máscara simples on the fly
                            if(tag.includes('CPF')) val = this.formatters.cpf_cnpj(val);
                            if(tag.includes('VALOR')) val = this.formatters.moeda(val);
                            if(tag.includes('TELEFONE')) val = this.formatters.telefone(val);
                            
                            e.target.value = val;
                            this.state.formData[tag] = val;
                            updatePreview(sourceContent);
                        });
                    });
                }
            }
            updatePreview(sourceContent);
        };

        // 4. Update A4 Preview
        const updatePreview = (sourceContent) => {
            const parsedHTML = this.parseTemplate(sourceContent, this.state.formData);
            const contentBox = el('doc-a4-content');
            contentBox.innerHTML = parsedHTML;

            // Aplica estilos Visuais
            const style = el('doc-select-style').value;
            const color = el('doc-color').value;
            
            contentBox.className = `w-full flex-1 p-8 text-black text-[12px] leading-[1.8] outline-none overflow-y-auto`;
            if(style === 'classic') contentBox.classList.add('font-serif');
            if(style === 'modern') contentBox.classList.add('font-sans');
            if(style === 'corporate') {
                contentBox.classList.add('font-sans');
                el('doc-a4-header').style.backgroundColor = color;
                el('doc-a4-header').style.height = '12px';
            } else {
                el('doc-a4-header').style.backgroundColor = 'transparent';
                el('doc-a4-header').style.height = '0';
            }

            // Aplicar cor do highlight nas palavras substituídas
            contentBox.querySelectorAll('.doc-bound-value').forEach(span => {
                span.style.color = (style === 'classic' || style === 'modern') ? '#000' : color;
                span.style.fontWeight = 'bold';
            });
        };

        // 5. Histórico e Storage
        const saveToHistory = () => {
            const tplName = this.templates.find(t => t.id === this.state.currentTemplateId)?.name || 'Documento Customizado';
            const docName = this.state.formData['NOME_DO_CLIENTE'] || this.state.formData['NOME_CONTRATANTE'] || 'Documento sem título';
            const doc = {
                id: Date.now().toString(),
                date: new Date().toLocaleString('pt-BR'),
                templateId: this.state.currentTemplateId,
                title: `${tplName} - ${docName.substring(0,20)}`,
                formData: { ...this.state.formData },
                visualSettings: { ...this.state.visualSettings },
                builderSource: el('doc-builder-source').value
            };
            this.state.history.unshift(doc);
            if(this.state.history.length > 20) this.state.history.pop(); // Max 20
            localStorage.setItem('margemlab_docs_history', JSON.stringify(this.state.history));
            el('doc-history-count').innerText = this.state.history.length;
            ToastManager.show('Documento salvo no histórico local.', 'success');
        };

        const renderHistory = () => {
            const list = el('doc-history-list');
            if(this.state.history.length === 0) {
                list.innerHTML = `<div class="p-6 text-center text-sm text-base-400 border border-dashed rounded-xl border-base-300">Nenhum documento salvo ainda.</div>`;
                return;
            }
            list.innerHTML = this.state.history.map(doc => `
                <div class="flex items-center justify-between p-4 bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-xl hover:border-base-400 transition-colors">
                    <div>
                        <h4 class="font-bold text-sm">${doc.title}</h4>
                        <span class="text-[10px] text-base-500">${doc.date}</span>
                    </div>
                    <div class="flex gap-2">
                        <button class="doc-load-hist btn-secondary px-3 py-1.5 text-[10px]" data-id="${doc.id}"><i data-lucide="copy" class="w-3 h-3"></i> Duplicar/Carregar</button>
                        <button class="doc-del-hist text-red-500 hover:text-red-700 p-2" data-id="${doc.id}"><i data-lucide="trash" class="w-4 h-4"></i></button>
                    </div>
                </div>
            `).join('');
            lucide.createIcons();

            document.querySelectorAll('.doc-load-hist').forEach(btn => btn.addEventListener('click', (e) => {
                const doc = this.state.history.find(d => d.id === e.currentTarget.dataset.id);
                if(doc) {
                    el('doc-select-template').value = doc.templateId;
                    this.state.formData = { ...doc.formData };
                    this.state.visualSettings = { ...doc.visualSettings };
                    el('doc-select-style').value = doc.visualSettings.style || 'classic';
                    el('doc-color').value = doc.visualSettings.color || '#18181b';
                    if(doc.templateId === 'builder') el('doc-builder-source').value = doc.builderSource;
                    if(doc.visualSettings.logo) {
                        el('doc-a4-logo').src = doc.visualSettings.logo;
                        el('doc-a4-logo').classList.remove('hidden');
                        el('doc-lbl-logo').innerText = "Logo Aplicada";
                    }
                    setTab('new');
                    rebuildForm();
                    ToastManager.show('Documento carregado.', 'info');
                }
            }));

            document.querySelectorAll('.doc-del-hist').forEach(btn => btn.addEventListener('click', (e) => {
                this.state.history = this.state.history.filter(d => d.id !== e.currentTarget.dataset.id);
                localStorage.setItem('margemlab_docs_history', JSON.stringify(this.state.history));
                el('doc-history-count').innerText = this.state.history.length;
                renderHistory();
            }));
        };

        // 6. Listeners Primários
        el('doc-select-template').addEventListener('change', rebuildForm);
        el('doc-builder-source').addEventListener('input', rebuildForm);
        el('doc-save-history').addEventListener('click', saveToHistory);
        el('doc-clear-fields').addEventListener('click', () => { this.state.formData = { 'DATA_ATUAL': today }; rebuildForm(); });
        
        ['doc-select-style', 'doc-color'].forEach(id => el(id).addEventListener('change', (e) => {
            const key = id === 'doc-color' ? 'color' : 'style';
            this.state.visualSettings[key] = e.target.value;
            rebuildForm();
        }));

        // Upload de Logo
        el('doc-input-logo').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                this.state.visualSettings.logo = ev.target.result;
                el('doc-a4-logo').src = ev.target.result;
                el('doc-a4-logo').classList.remove('hidden');
                el('doc-lbl-logo').innerText = "Logo Aplicada";
            };
            reader.readAsDataURL(file);
        });

        // Tocar no Texto (ContentEditable)
        el('doc-toggle-edit').addEventListener('click', () => {
            const box = el('doc-a4-content');
            const isEditing = box.getAttribute('contenteditable') === 'true';
            if(!isEditing) {
                box.setAttribute('contenteditable', 'true'); box.focus();
                el('doc-toggle-edit').innerHTML = `<i data-lucide="check" class="w-3 h-3"></i> Travar Edição`;
                el('doc-toggle-edit').classList.replace('border-base-300', 'border-green-500');
                ToastManager.show('Edição livre ativada. Pode digitar no papel.', 'info');
            } else {
                box.setAttribute('contenteditable', 'false');
                el('doc-toggle-edit').innerHTML = `<i data-lucide="edit-3" class="w-3 h-3"></i> Revisar / Tocar no Texto`;
                el('doc-toggle-edit').classList.replace('border-green-500', 'border-base-300');
            }
            lucide.createIcons();
        });

        // 7. Geração de PDF e Impressão
        const getPrintHTML = () => {
            const headerCss = el('doc-a4-header').style.cssText;
            const logoHtml = this.state.visualSettings.logo ? `<div style="text-align:center; padding-top:40px;"><img src="${this.state.visualSettings.logo}" style="max-height:80px; max-width:250px; object-fit:contain;"></div>` : '';
            const contentClass = el('doc-a4-content').className.replace('overflow-y-auto', ''); // remove scroll para print
            const contentHtml = el('doc-a4-content').innerHTML;

            return `
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
                    @media print { @page { size: A4 portrait; margin: 0; } body { margin:0; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                    .a4-print-box { width: 210mm; min-height: 297mm; background: white; margin: 0 auto; box-sizing: border-box; display: flex; flex-direction: column; overflow: hidden;}
                    .doc-bound-value { font-weight: bold; }
                </style>
                <div class="a4-print-box">
                    <div style="${headerCss}"></div>
                    ${logoHtml}
                    <div class="${contentClass}" style="flex:1; padding: 40px 60px;">${contentHtml}</div>
                </div>
            `;
        };

        el('doc-print-btn').addEventListener('click', () => {
            const printArea = document.getElementById('print-area');
            printArea.innerHTML = getPrintHTML();
            ToastManager.show('Abrindo tela de impressão. Escolha salvar como PDF.', 'info');
            setTimeout(() => window.print(), 500);
        });

        el('doc-export-pdf').addEventListener('click', async () => {
            const btn = el('doc-export-pdf');
            btn.innerHTML = `<i data-lucide="loader" class="animate-spin"></i> Gerando...`; btn.disabled = true; lucide.createIcons();
            
            // Use offscreen div for html2canvas
            const exportArea = document.getElementById('zine-export-area'); // Reusing the invisible div
            exportArea.innerHTML = getPrintHTML();

            try {
                await new Promise(r => setTimeout(r, 400)); // wait fonts
                const canvas = await html2canvas(exportArea.firstElementChild, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
                const imgData = canvas.toDataURL('image/jpeg', 0.95);
                
                const { PDFDocument } = PDFLib;
                const pdfDoc = await PDFDocument.create();
                const page = pdfDoc.addPage([595.28, 841.89]); // A4 Portrait pts
                const image = await pdfDoc.embedJpg(imgData);
                page.drawImage(image, { x: 0, y: 0, width: 595.28, height: 841.89 });
                
                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
                link.download = `Documento-${Date.now()}.pdf`; link.click();
                ToastManager.show('PDF baixado com sucesso!', 'success');
            } catch(e) {
                console.error(e); ToastManager.show('Erro ao gerar PDF.', 'error');
            } finally {
                exportArea.innerHTML = ''; btn.innerHTML = `<i data-lucide="file-down"></i> Baixar PDF`; btn.disabled = false; lucide.createIcons();
            }
        });

        // Initialize First Render
        rebuildForm();
    }
};


// ==========================================
// 5. PDF TOOLKIT (Novo Motor Estrutural)
// ==========================================
const PDFTool = {
    state: {
        view: 'menu', // menu | lab | img2pdf
        files: [],    // Stores parsed PDFDocuments { id, name, doc }
        pages: [],    // Virtual pages { id, fileId, originalIndex, rotation, selected }
        imgFiles: []  // For Img2PDF { id, file, url }
    },

    render(container) {
        container.innerHTML = `
            <div class="max-w-6xl mx-auto px-6 py-12 animate-fade-in" id="pdf-toolkit">
                <div class="mb-10">
                    <a href="#home" class="inline-flex items-center text-sm font-medium text-base-500 hover:text-base-900 dark:hover:text-base-50 mb-6 transition-colors"><i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i> Explorar Ferramentas</a>
                    <h1 class="text-3xl font-bold mb-2">PDF Toolkit</h1>
                    <p class="text-base-500 text-sm max-w-xl">Edite estruturalmente, junte, divida, organize páginas ou converta arquivos 100% no seu navegador, sem limites.</p>
                </div>
                <div id="pdf-dynamic-view"></div>
            </div>
        `;
    },

    init() {
        this.state = { view: 'menu', files: [], pages: [], imgFiles: [] }; // reset
        this.renderView();
    },

    renderView() {
        const viewContainer = document.getElementById('pdf-dynamic-view');
        if (this.state.view === 'menu') {
            viewContainer.innerHTML = this.htmlMenu();
            this.bindMenu();
        } else if (this.state.view === 'lab') {
            viewContainer.innerHTML = this.htmlLab();
            this.bindLab();
            this.updateLabUI();
        } else if (this.state.view === 'img2pdf') {
            viewContainer.innerHTML = this.htmlImg2Pdf();
            this.bindImg2Pdf();
        }
        lucide.createIcons();
    },

    // --- VIEWS HTML ---
    htmlMenu() {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- PDF LAB -->
                <div class="form-section group cursor-pointer hover:border-base-900 dark:hover:border-white transition-colors" id="btn-goto-lab">
                    <div class="flex items-center gap-4 mb-4">
                        <div class="w-12 h-12 bg-base-100 dark:bg-base-900 rounded-xl flex items-center justify-center text-base-900 dark:text-white"><i data-lucide="layout-grid"></i></div>
                        <div><h3 class="text-lg font-bold">PDF Lab (Organizador)</h3><p class="text-xs text-base-500">A ferramenta principal.</p></div>
                    </div>
                    <p class="text-sm text-base-600 dark:text-base-400">Adicione múltiplos PDFs em uma <b>Área de Trabalho</b>. Arraste páginas, junte arquivos, exclua, duplique e gire páginas individualmente.</p>
                    <div class="mt-4 flex gap-2">
                        <span class="text-[10px] bg-base-100 dark:bg-base-800 px-2 py-1 rounded font-medium">Juntar</span>
                        <span class="text-[10px] bg-base-100 dark:bg-base-800 px-2 py-1 rounded font-medium">Dividir / Extrair</span>
                        <span class="text-[10px] bg-base-100 dark:bg-base-800 px-2 py-1 rounded font-medium">Girar</span>
                    </div>
                </div>

                <!-- IMAGEM PARA PDF -->
                <div class="form-section group cursor-pointer hover:border-base-900 dark:hover:border-white transition-colors" id="btn-goto-img">
                    <div class="flex items-center gap-4 mb-4">
                        <div class="w-12 h-12 bg-base-100 dark:bg-base-900 rounded-xl flex items-center justify-center text-base-900 dark:text-white"><i data-lucide="image"></i></div>
                        <div><h3 class="text-lg font-bold">Imagens → PDF</h3><p class="text-xs text-base-500">Conversão de formatos.</p></div>
                    </div>
                    <p class="text-sm text-base-600 dark:text-base-400">Selecione múltiplas imagens (JPG, PNG) e crie um único arquivo PDF. Ideal para digitalizações e fotos de documentos.</p>
                    <div class="mt-4 flex gap-2">
                        <span class="text-[10px] bg-base-100 dark:bg-base-800 px-2 py-1 rounded font-medium">JPG para PDF</span>
                        <span class="text-[10px] bg-base-100 dark:bg-base-800 px-2 py-1 rounded font-medium">Escaneamento Virtual</span>
                    </div>
                </div>
            </div>
        `;
    },

    htmlLab() {
        return `
            <div class="flex flex-col gap-6">
                <!-- Toolbar -->
                <div class="flex flex-col md:flex-row justify-between items-center gap-4 bg-base-50 dark:bg-base-900/40 p-4 rounded-xl border border-base-200 dark:border-base-800">
                    <div class="flex items-center gap-2">
                        <button id="lab-btn-back" class="p-2 hover:bg-base-200 dark:hover:bg-base-800 rounded-lg"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>
                        <h2 class="font-bold text-sm uppercase tracking-wider ml-2 border-l-2 border-base-300 pl-3">Área de Trabalho</h2>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <label class="btn-secondary !w-auto !py-2 cursor-pointer text-xs">
                            <i data-lucide="file-plus" class="w-4 h-4"></i> Adicionar PDF
                            <input type="file" id="lab-input-pdf" accept="application/pdf" multiple class="hidden">
                        </label>
                        <button id="lab-btn-export" class="btn-primary !w-auto !py-2 text-xs disabled:opacity-50"><i data-lucide="download" class="w-4 h-4"></i> Exportar Tudo (${this.state.pages.length} págs)</button>
                        <button id="lab-btn-export-sel" class="btn-primary !w-auto !py-2 text-xs !bg-blue-600 dark:!bg-blue-500 hidden"><i data-lucide="scissors" class="w-4 h-4"></i> Extrair Selecionadas</button>
                    </div>
                </div>

                <!-- Painel Principal -->
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <!-- Arquivos Carregados (Sidebar) -->
                    <div class="lg:col-span-1 form-section !p-4">
                        <h3 class="text-xs font-bold uppercase text-base-500 mb-4">Arquivos Base</h3>
                        <div id="lab-files-list" class="space-y-2"></div>
                        <p class="text-[10px] text-base-400 mt-4 leading-relaxed border-t border-base-200 pt-4">Os PDFs carregados são desmembrados em páginas na área ao lado. Você pode misturar as páginas livremente.</p>
                    </div>

                    <!-- Editor de Páginas (Canvas de Trabalho) -->
                    <div class="lg:col-span-3 form-section !p-4 flex flex-col bg-base-50 dark:bg-base-950 min-h-[500px]">
                        
                        <!-- Page Actions Bar -->
                        <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-200 dark:border-base-800">
                            <div class="flex gap-2 items-center">
                                <button id="lab-act-selectall" class="text-[10px] font-semibold text-base-500 hover:text-base-900 dark:hover:text-white px-2 py-1">Selecionar Tudo</button>
                                <span class="text-base-300">|</span>
                                <span id="lab-sel-count" class="text-[10px] font-bold text-blue-500">0 selecionadas</span>
                            </div>
                            <div class="flex gap-2">
                                <button id="lab-act-rotate" class="p-1.5 bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded shadow-sm hover:border-base-400 disabled:opacity-30" disabled title="Girar Selecionadas"><i data-lucide="rotate-cw" class="w-4 h-4"></i></button>
                                <button id="lab-act-dup" class="p-1.5 bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded shadow-sm hover:border-base-400 disabled:opacity-30" disabled title="Duplicar Selecionadas"><i data-lucide="copy" class="w-4 h-4"></i></button>
                                <button id="lab-act-del" class="p-1.5 bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded shadow-sm text-red-500 hover:border-red-400 disabled:opacity-30" disabled title="Excluir Selecionadas"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                            </div>
                        </div>

                        <!-- Page Grid -->
                        <div id="lab-pages-grid" class="flex-1 flex flex-wrap content-start gap-4 overflow-y-auto p-2">
                            ${this.state.pages.length === 0 ? `<div class="w-full h-full flex flex-col items-center justify-center opacity-40"><i data-lucide="file-dashed" class="w-12 h-12 mb-3"></i><p class="text-sm">Nenhum PDF adicionado.</p></div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    htmlImg2Pdf() {
        return `
            <div class="form-section space-y-6 max-w-3xl mx-auto">
                <div class="flex items-center gap-2 mb-4 border-b border-base-200 pb-4">
                    <button id="img-btn-back" class="p-1 hover:bg-base-200 rounded-lg"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>
                    <h2 class="font-bold text-sm uppercase tracking-wider">Imagens para PDF</h2>
                </div>
                
                <label class="flex flex-col items-center justify-center h-32 w-full bg-base-50 dark:bg-base-900/50 border-2 border-dashed border-base-300 dark:border-base-700 rounded-xl cursor-pointer hover:bg-base-100 transition-colors">
                    <i data-lucide="image-plus" class="w-8 h-8 mb-2 text-base-400"></i>
                    <span class="text-sm font-medium">Selecionar Imagens (JPG, PNG)</span>
                    <input type="file" id="img-input-files" accept="image/png, image/jpeg" multiple class="hidden">
                </label>
                
                <div id="img-list" class="grid grid-cols-4 sm:grid-cols-6 gap-3"></div>

                <div class="grid grid-cols-2 gap-4 pt-4 border-t border-base-200">
                    <button id="img-btn-clear" class="btn-secondary w-full">Limpar Lista</button>
                    <button id="img-btn-export" class="btn-primary w-full disabled:opacity-50" disabled><i data-lucide="file-text"></i> Gerar PDF A4</button>
                </div>
            </div>
        `;
    },

    // --- CONTROLLERS ---

    bindMenu() {
        document.getElementById('btn-goto-lab').addEventListener('click', () => { this.state.view = 'lab'; this.renderView(); });
        document.getElementById('btn-goto-img').addEventListener('click', () => { this.state.view = 'img2pdf'; this.renderView(); });
    },

    bindLab() {
        const el = id => document.getElementById(id);
        
        el('lab-btn-back').addEventListener('click', () => { this.state.view = 'menu'; this.renderView(); });
        
        el('lab-input-pdf').addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            if(files.length === 0) return;
            
            const btn = el('lab-btn-export');
            const originalText = btn.innerHTML;
            btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Processando...`; btn.disabled = true; lucide.createIcons();

            try {
                const { PDFDocument } = PDFLib;
                for (const file of files) {
                    const arrayBuffer = await file.arrayBuffer();
                    const pdfDoc = await PDFDocument.load(arrayBuffer);
                    const pageCount = pdfDoc.getPageCount();
                    const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
                    
                    this.state.files.push({ id: fileId, name: file.name, doc: pdfDoc });
                    
                    // Populate virtual pages
                    for(let i = 0; i < pageCount; i++) {
                        this.state.pages.push({ id: 'pg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5), fileId: fileId, originalIndex: i, rotation: 0, selected: false });
                    }
                }
            } catch (err) {
                console.error(err); ToastManager.show('Erro ao ler um dos PDFs. Pode estar corrompido ou protegido por senha.', 'error');
            }
            
            el('lab-input-pdf').value = ''; // reset
            this.updateLabUI();
        });

        // Page Actions
        el('lab-act-selectall').addEventListener('click', () => {
            const allSelected = this.state.pages.every(p => p.selected);
            this.state.pages.forEach(p => p.selected = !allSelected);
            this.updateLabUI();
        });

        el('lab-act-del').addEventListener('click', () => {
            this.state.pages = this.state.pages.filter(p => !p.selected);
            this.updateLabUI();
        });

        el('lab-act-rotate').addEventListener('click', () => {
            this.state.pages.forEach(p => { if(p.selected) p.rotation = (p.rotation + 90) % 360; });
            this.updateLabUI();
        });

        el('lab-act-dup').addEventListener('click', () => {
            const newPages = [];
            this.state.pages.forEach(p => {
                newPages.push(p);
                if(p.selected) newPages.push({ ...p, id: 'pg_' + Date.now() + '_' + Math.random().toString(36).substr(2,5), selected: false });
            });
            this.state.pages = newPages;
            this.updateLabUI();
        });

        // Exports
        el('lab-btn-export').addEventListener('click', () => this.exportLabPDF(this.state.pages));
        el('lab-btn-export-sel').addEventListener('click', () => this.exportLabPDF(this.state.pages.filter(p => p.selected)));
    },

    updateLabUI() {
        const el = id => document.getElementById(id);
        
        // 1. Render Files Sidebar
        el('lab-files-list').innerHTML = this.state.files.map((f, i) => `
            <div class="flex items-center justify-between bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 p-2 rounded-lg">
                <div class="flex items-center gap-2 overflow-hidden"><div class="w-6 h-6 bg-base-100 rounded text-[10px] font-bold flex items-center justify-center shrink-0">${i+1}</div><span class="text-xs truncate font-medium">${f.name}</span></div>
            </div>
        `).join('');

        if(this.state.files.length === 0) el('lab-files-list').innerHTML = `<p class="text-xs text-base-400">Sem arquivos.</p>`;

        // 2. Render Pages Grid
        const grid = el('lab-pages-grid');
        if(this.state.pages.length === 0) {
            grid.innerHTML = `<div class="w-full h-full flex flex-col items-center justify-center opacity-40"><i data-lucide="file-dashed" class="w-12 h-12 mb-3"></i><p class="text-sm">Área Vazia.</p></div>`;
        } else {
            grid.innerHTML = this.state.pages.map((p, index) => {
                const file = this.state.files.find(f => f.id === p.fileId);
                const isSel = p.selected;
                // Simulação visual de rotação no card
                const rotStyle = `transform: rotate(${p.rotation}deg);`;
                
                return `
                    <div class="relative w-[100px] h-[141px] flex-shrink-0 cursor-pointer group select-none transition-transform hover:-translate-y-1" onclick="window.margemPdfTogglePage('${p.id}')">
                        <div class="absolute inset-0 bg-white dark:bg-base-900 border-2 rounded-lg flex flex-col items-center justify-center p-2 text-center shadow-sm transition-all overflow-hidden ${isSel ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20' : 'border-base-200 dark:border-base-700'}" style="${rotStyle}">
                            <i data-lucide="file" class="w-6 h-6 text-base-300 mb-1"></i>
                            <span class="text-[9px] font-bold truncate w-full text-base-700 dark:text-base-300">${file.name}</span>
                            <span class="text-[9px] text-base-500">Pág ${p.originalIndex + 1}</span>
                        </div>
                        ${isSel ? `<div class="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-0.5 shadow-sm z-10"><i data-lucide="check" class="w-3 h-3"></i></div>` : ''}
                        <div class="absolute bottom-1 right-1 bg-black/50 text-white text-[8px] px-1 rounded z-10">${index + 1}</div>
                    </div>
                `;
            }).join('');
        }

        // Window Helper for inline onclick
        window.margemPdfTogglePage = (id) => {
            const p = this.state.pages.find(pg => pg.id === id);
            if(p) { p.selected = !p.selected; this.updateLabUI(); }
        };

        // 3. Update Buttons State
        const selCount = this.state.pages.filter(p => p.selected).length;
        const total = this.state.pages.length;
        
        el('lab-sel-count').innerText = `${selCount} selecionadas`;
        
        const actBtns = ['lab-act-rotate', 'lab-act-dup', 'lab-act-del'];
        actBtns.forEach(id => el(id).disabled = selCount === 0);

        el('lab-btn-export').innerHTML = `<i data-lucide="download" class="w-4 h-4"></i> Exportar Tudo (${total})`;
        el('lab-btn-export').disabled = total === 0;

        if (selCount > 0) {
            el('lab-btn-export-sel').classList.remove('hidden');
            el('lab-btn-export-sel').innerHTML = `<i data-lucide="scissors" class="w-4 h-4"></i> Extrair (${selCount})`;
            el('lab-btn-export').classList.add('hidden');
        } else {
            el('lab-btn-export-sel').classList.add('hidden');
            el('lab-btn-export').classList.remove('hidden');
        }

        lucide.createIcons();
    },

    async exportLabPDF(pagesArray) {
        if(pagesArray.length === 0) return;
        const btnId = pagesArray.length === this.state.pages.length ? 'lab-btn-export' : 'lab-btn-export-sel';
        const btn = document.getElementById(btnId);
        const origHtml = btn.innerHTML;
        
        btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Gerando...`;
        btn.disabled = true; lucide.createIcons();

        try {
            const { PDFDocument, degrees } = PDFLib;
            const newPdf = await PDFDocument.create();

            for (const p of pagesArray) {
                const sourcePdf = this.state.files.find(f => f.id === p.fileId).doc;
                const [copiedPage] = await newPdf.copyPages(sourcePdf, [p.originalIndex]);
                
                if (p.rotation !== 0) {
                    const currentRot = copiedPage.getRotation().angle;
                    copiedPage.setRotation(degrees(currentRot + p.rotation));
                }
                newPdf.addPage(copiedPage);
            }

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
            link.download = `MargemLab-Workspace-${Date.now()}.pdf`; link.click();
            ToastManager.show('PDF gerado com sucesso!', 'success');
        } catch(err) {
            console.error(err); ToastManager.show('Erro ao exportar PDF.', 'error');
        } finally {
            btn.innerHTML = origHtml; btn.disabled = false; lucide.createIcons();
        }
    },

    // --- IMG 2 PDF ---
    bindImg2Pdf() {
        const el = id => document.getElementById(id);
        
        el('img-btn-back').addEventListener('click', () => { this.state.view = 'menu'; this.renderView(); });
        
        el('img-input-files').addEventListener('change', (e) => {
            Array.from(e.target.files).forEach(f => {
                this.state.imgFiles.push({ id: Date.now()+Math.random(), file: f, url: URL.createObjectURL(f) });
            });
            this.updateImgUI();
            el('img-input-files').value = '';
        });

        el('img-btn-clear').addEventListener('click', () => { this.state.imgFiles = []; this.updateImgUI(); });
        
        el('img-btn-export').addEventListener('click', async () => {
            if(this.state.imgFiles.length === 0) return;
            const btn = el('img-btn-export'); btn.innerHTML = `<i data-lucide="loader" class="animate-spin w-4 h-4"></i> Gerando...`; btn.disabled = true; lucide.createIcons();
            
            try {
                const { PDFDocument } = PDFLib;
                const pdfDoc = await PDFDocument.create();
                
                for (const imgObj of this.state.imgFiles) {
                    const imgBytes = await imgObj.file.arrayBuffer();
                    let pdfImage;
                    if (imgObj.file.type === 'image/jpeg') pdfImage = await pdfDoc.embedJpg(imgBytes);
                    else if (imgObj.file.type === 'image/png') pdfImage = await pdfDoc.embedPng(imgBytes);
                    else continue;

                    const page = pdfDoc.addPage([595.28, 841.89]); // A4 Dimension
                    const scaled = pdfImage.scaleToFit(595.28, 841.89);
                    
                    page.drawImage(pdfImage, {
                        x: 595.28 / 2 - scaled.width / 2,
                        y: 841.89 / 2 - scaled.height / 2,
                        width: scaled.width,
                        height: scaled.height
                    });
                }
                
                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
                link.download = `MargemLab-Imagens-${Date.now()}.pdf`; link.click();
                ToastManager.show('PDF gerado!', 'success');
            } catch(e) { ToastManager.show('Erro ao criar PDF.', 'error'); } 
            finally { btn.innerHTML = `<i data-lucide="file-text"></i> Gerar PDF A4`; btn.disabled = false; lucide.createIcons(); }
        });
    },

    updateImgUI() {
        const list = document.getElementById('img-list');
        list.innerHTML = this.state.imgFiles.map(img => `
            <div class="relative aspect-square border rounded-lg overflow-hidden bg-base-100 dark:bg-base-900 group">
                <img src="${img.url}" class="w-full h-full object-cover">
                <button class="absolute top-1 right-1 bg-red-500 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity" onclick="window.margemImgDel('${img.id}')"><i data-lucide="x" class="w-3 h-3"></i></button>
            </div>
        `).join('');
        
        window.margemImgDel = (id) => { this.state.imgFiles = this.state.imgFiles.filter(i => i.id !== id); this.updateImgUI(); };
        
        document.getElementById('img-btn-export').disabled = this.state.imgFiles.length === 0;
        lucide.createIcons();
    }
};

// ==========================================
// 6, 7 e 8 (Texto, Imagem e Sorteador MANTIDOS IDÊNTICOS da Iteração Anterior)
// ==========================================
const TextoTool = {
    render(container) {
        const main = `<div class="form-section"><textarea id="txt-input" class="input-premium h-64 font-mono text-sm resize-y" placeholder="Cole seu texto aqui..."></textarea><div class="flex flex-wrap gap-2 mt-4"><button class="txt-action btn-primary !bg-base-200 !text-base-900 dark:!bg-base-800 dark:!text-base-100 text-xs px-3 py-1.5 rounded-md" data-action="upper">MAIÚSCULAS</button><button class="txt-action btn-primary !bg-base-200 !text-base-900 dark:!bg-base-800 dark:!text-base-100 text-xs px-3 py-1.5 rounded-md" data-action="lower">minúsculas</button><button class="txt-action btn-primary !bg-base-200 !text-base-900 dark:!bg-base-800 dark:!text-base-100 text-xs px-3 py-1.5 rounded-md" data-action="title">Title Case</button><button class="txt-action btn-primary !bg-base-200 !text-base-900 dark:!bg-base-800 dark:!text-base-100 text-xs px-3 py-1.5 rounded-md" data-action="clean">Remover Espaços Extras</button><button class="txt-action btn-primary !bg-base-200 !text-base-900 dark:!bg-base-800 dark:!text-base-100 text-xs px-3 py-1.5 rounded-md" data-action="lines">Remover Quebras</button><button class="txt-action btn-primary !bg-base-200 !text-base-900 dark:!bg-base-800 dark:!text-base-100 text-xs px-3 py-1.5 rounded-md" data-action="emails">Extrair E-mails</button></div></div>`;
        const side = `<div class="form-section flex flex-col gap-4"><div class="flex justify-between items-center pb-4 border-b border-base-200 dark:border-base-800"><span class="text-sm font-semibold text-base-500">Caracteres</span><span id="txt-chars" class="font-bold text-xl">0</span></div><div class="flex justify-between items-center pb-4 border-b border-base-200 dark:border-base-800"><span class="text-sm font-semibold text-base-500">Palavras</span><span id="txt-words" class="font-bold text-xl">0</span></div><div class="flex justify-between items-center pb-4 border-b border-base-200 dark:border-base-800"><span class="text-sm font-semibold text-base-500">Linhas</span><span id="txt-lines" class="font-bold text-xl">0</span></div><button id="txt-copy" class="btn-primary mt-4"><i data-lucide="copy"></i> Copiar Texto</button><button id="txt-clear" class="btn-secondary mt-2"><i data-lucide="trash-2"></i> Limpar Tudo</button></div>`;
        container.innerHTML = SharedUI.layout('texto', 'Utilitários de Texto', 'Análise, formatação e extração instantânea.', main, side);
    },
    init() {
        const input = document.getElementById('txt-input');
        const updateStats = () => { const val = input.value; document.getElementById('txt-chars').innerText = val.length; document.getElementById('txt-words').innerText = val.trim() ? val.trim().split(/\s+/).length : 0; document.getElementById('txt-lines').innerText = val === '' ? 0 : val.split('\n').length; };
        input.addEventListener('input', updateStats);
        document.querySelectorAll('.txt-action').forEach(btn => btn.addEventListener('click', (e) => { let val = input.value; const action = e.target.dataset.action; if(!val) return ToastManager.show('Insira um texto primeiro.', 'error'); if (action === 'upper') val = val.toUpperCase(); if (action === 'lower') val = val.toLowerCase(); if (action === 'title') val = val.toLowerCase().replace(/\b\w/g, s => s.toUpperCase()); if (action === 'clean') val = val.replace(/[ \t]+/g, ' ').trim(); if (action === 'lines') val = val.replace(/(\r\n|\n|\r)/gm, " "); if (action === 'emails') { const emails = val.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi); val = emails ? emails.join('\n') : 'Nenhum e-mail encontrado.'; } input.value = val; updateStats(); }));
        document.getElementById('txt-copy').addEventListener('click', () => { if(!input.value) return; navigator.clipboard.writeText(input.value); ToastManager.show('Texto copiado!', 'success'); });
        document.getElementById('txt-clear').addEventListener('click', () => { input.value = ''; updateStats(); });
    }
};

const ImagemTool = {
    render(container) {
        const main = `<div class="form-section space-y-6"><label class="flex flex-col items-center justify-center h-40 w-full bg-base-50 dark:bg-base-900/50 border-2 border-dashed border-base-300 rounded-xl cursor-pointer hover:bg-base-100 transition-colors"><i data-lucide="upload-cloud" class="w-8 h-8 mb-3 text-base-400"></i><span class="text-sm font-medium">Clique ou arraste uma imagem</span><input type="file" id="img-input" accept="image/*" class="hidden"></label><div class="grid grid-cols-2 gap-4"><div><label class="block text-xs font-semibold mb-2">Formato de Saída</label><select id="img-format" class="input-premium py-3"><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></div><div><label class="block text-xs font-semibold mb-2">Qualidade (<span id="qual-val">80</span>%)</label><input type="range" id="img-quality" min="0.1" max="1" step="0.1" value="0.8" class="w-full mt-3"></div></div><div><label class="block text-xs font-semibold mb-2">Redimensionamento Máximo</label><select id="img-resize" class="input-premium py-3"><option value="0">Original</option><option value="1920">1920px</option><option value="1080">1080px</option><option value="800">800px</option></select></div></div>`;
        const side = `<div class="form-section text-center"><div class="h-48 flex items-center justify-center border border-base-200 dark:border-base-800 rounded-lg overflow-hidden bg-base-50 dark:bg-base-950 mb-4"><img id="img-preview" class="max-w-full max-h-full object-contain hidden" /><span id="img-placeholder" class="text-xs text-base-400">Preview</span></div><div class="flex justify-between text-xs text-base-500 mb-6"><span id="img-meta-old">Original: --</span><span id="img-meta-new" class="font-bold text-green-600">Novo: --</span></div><button id="img-download" class="btn-primary w-full disabled:opacity-50" disabled><i data-lucide="download"></i> Baixar Imagem</button></div>`;
        container.innerHTML = SharedUI.layout('imagem', 'Imagem Lab', 'Otimize, comprima e converta imagens.', main, side);
    },
    init() {
        const input = document.getElementById('img-input'); const preview = document.getElementById('img-preview'); const btn = document.getElementById('img-download'); let currentFile = null; let processedBlobURL = null; let finalExtension = 'jpg';
        document.getElementById('img-quality').addEventListener('input', (e) => { document.getElementById('qual-val').innerText = Math.round(e.target.value * 100); if(currentFile) processImage(); });
        ['img-format', 'img-resize'].forEach(id => document.getElementById(id).addEventListener('change', () => { if(currentFile) processImage(); }));
        const processImage = () => { if(!currentFile) return; const format = document.getElementById('img-format').value; const quality = parseFloat(document.getElementById('img-quality').value); const resizeMax = parseInt(document.getElementById('img-resize').value); finalExtension = format.split('/')[1]; if(finalExtension === 'jpeg') finalExtension = 'jpg'; const reader = new FileReader(); reader.onload = (e) => { const img = new Image(); img.onload = () => { let w = img.width, h = img.height; if(resizeMax > 0 && w > resizeMax) { h = Math.round((resizeMax / w) * h); w = resizeMax; } const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h; canvas.getContext('2d').drawImage(img, 0, 0, w, h); canvas.toBlob((blob) => { if(processedBlobURL) URL.revokeObjectURL(processedBlobURL); processedBlobURL = URL.createObjectURL(blob); preview.src = processedBlobURL; preview.classList.remove('hidden'); document.getElementById('img-placeholder').classList.add('hidden'); document.getElementById('img-meta-old').innerText = `Orig: ${(currentFile.size / 1024).toFixed(2)} KB`; document.getElementById('img-meta-new').innerText = `Novo: ${(blob.size / 1024).toFixed(2)} KB`; btn.disabled = false; }, format, format === 'image/png' ? undefined : quality); }; img.src = e.target.result; }; reader.readAsDataURL(currentFile); };
        input.addEventListener('change', (e) => { currentFile = e.target.files[0]; processImage(); });
        btn.addEventListener('click', () => { if(processedBlobURL) { const link = document.createElement('a'); link.download = `margemlab-img-${Date.now()}.${finalExtension}`; link.href = processedBlobURL; link.click(); ToastManager.show('Imagem salva!', 'success'); } });
    }
};

const PDFMergeToolLegacy = {
    render(container) { container.innerHTML = SharedUI.layout('pdf', 'Margem PDF Engine', 'Merge instantâneo e seguro.', `<div class="form-section space-y-6"><label class="flex flex-col items-center justify-center h-40 w-full bg-base-50 border-2 border-dashed border-base-300 rounded-xl cursor-pointer hover:bg-base-100 transition-colors"><i data-lucide="file-plus" class="w-8 h-8 mb-3 text-base-400"></i><span class="text-sm font-medium">Selecionar múltiplos PDFs</span><input type="file" id="pdf-input" accept="application/pdf" multiple class="hidden"></label><div id="pdf-list" class="space-y-2 max-h-64 overflow-y-auto"></div></div>`, `<div class="form-section flex flex-col items-center justify-center min-h-[250px] border-dashed border-2 bg-base-50"><i data-lucide="layers" class="w-12 h-12 text-base-300 mb-4" id="pdf-icon-state"></i><h3 class="font-bold text-lg mb-1" id="pdf-status-title">Aguardando Arquivos</h3></div><button id="pdf-merge-btn" class="btn-primary w-full disabled:opacity-50" disabled><i data-lucide="zap"></i> Juntar PDFs Agora</button>`); },
    init() {
        let selectedFiles = []; const input = document.getElementById('pdf-input'); const listEl = document.getElementById('pdf-list'); const mergeBtn = document.getElementById('pdf-merge-btn');
        const updateList = () => { listEl.innerHTML = selectedFiles.map((f, i) => `<div class="flex items-center justify-between bg-white border border-base-200 p-3 rounded-lg text-sm"><span class="truncate pr-4"><span class="font-bold text-base-400 mr-2">${i+1}.</span>${f.name}</span><button class="text-red-500 hover:text-red-700 p-1" onclick="window.removePdf(${i})"><i data-lucide="x" class="w-4 h-4"></i></button></div>`).join(''); lucide.createIcons(); mergeBtn.disabled = selectedFiles.length < 2; document.getElementById('pdf-status-title').innerText = selectedFiles.length > 0 ? `${selectedFiles.length} Arquivos` : 'Aguardando Arquivos'; };
        window.removePdf = (index) => { selectedFiles.splice(index, 1); updateList(); };
        input.addEventListener('change', (e) => { Array.from(e.target.files).forEach(f => { if(f.type === 'application/pdf') selectedFiles.push(f); }); updateList(); input.value = ''; });
        mergeBtn.addEventListener('click', async () => { try { document.getElementById('pdf-icon-state').classList.add('animate-spin'); mergeBtn.disabled = true; const { PDFDocument } = PDFLib; const mergedPdf = await PDFDocument.create(); for (const file of selectedFiles) { const arrayBuffer = await file.arrayBuffer(); const pdf = await PDFDocument.load(arrayBuffer); const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices()); copiedPages.forEach((page) => mergedPdf.addPage(page)); } const pdfBytes = await mergedPdf.save(); const blob = new Blob([pdfBytes], { type: 'application/pdf' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `margemlab-merged-${Date.now()}.pdf`; link.click(); ToastManager.show('PDFs juntados!', 'success'); } catch (error) { ToastManager.show('Erro ao juntar PDFs.', 'error'); } finally { document.getElementById('pdf-icon-state').classList.remove('animate-spin'); updateList(); } });
    }
};

const Sorteador = {
    render(container) { container.innerHTML = SharedUI.layout('sorteador', 'Motor de Sorteio', 'Decisões justas.', `<div class="form-section"><textarea id="sort-input" class="input-premium h-64 resize-none mb-4 font-mono text-sm" placeholder="João\nMaria\nJosé..."></textarea><div class="flex gap-4"><button id="sort-btn" class="btn-primary w-2/3 py-4 text-base"><i data-lucide="shuffle"></i> Sortear Um Item</button><button id="sort-clear" class="btn-secondary w-1/3"><i data-lucide="trash-2"></i> Limpar</button></div></div>`, `<div class="form-section flex flex-col items-center justify-center min-h-[300px] bg-base-900 text-white relative overflow-hidden"><h3 class="text-xs font-bold uppercase tracking-widest mb-6 opacity-60">O Sorteado É</h3><div id="sort-result" class="text-4xl md:text-5xl font-extrabold text-center px-4 break-words w-full text-transparent bg-clip-text bg-gradient-to-br from-white to-base-400">?</div></div>`); },
    init() {
        document.getElementById('sort-clear').addEventListener('click', () => { document.getElementById('sort-input').value = ''; document.getElementById('sort-result').innerText = '?'; document.getElementById('sort-result').classList.replace('text-green-400', 'from-white'); });
        document.getElementById('sort-btn').addEventListener('click', () => { let items = document.getElementById('sort-input').value.split('\n').map(i => i.trim()).filter(i => i); if(items.length < 2) return ToastManager.show('Insira pelo menos 2 opções.', 'error'); const resultEl = document.getElementById('sort-result'); resultEl.classList.remove('text-green-400'); resultEl.classList.add('from-white'); let ticks = 0; const interval = setInterval(() => { resultEl.innerText = items[Math.floor(Math.random() * items.length)]; ticks++; if(ticks > 20) { clearInterval(interval); resultEl.innerText = items[Math.floor(Math.random() * items.length)]; resultEl.classList.remove('from-white'); resultEl.classList.add('text-green-400'); gsap.fromTo(resultEl, {scale: 0.8, opacity: 0.5}, {scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)'}); } }, 60); });
    }
};

// ==========================================
// VIEWS & ROUTER ATUALIZADO
// ==========================================
const Home = {
    render(container) {
        container.innerHTML = `
            <section class="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-base-100 dark:bg-base-900 text-base-600 dark:text-base-400 text-xs font-medium mb-8 border border-base-200 dark:border-base-800">
                    <span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                    Processamento 100% Local (Nenhum dado é enviado)
                </div>
                <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">Ferramentas para criar <br class="hidden md:block"> <span class="text-transparent bg-clip-text bg-gradient-to-r from-base-900 to-base-500 dark:from-white dark:to-base-500">fora da margem.</span></h1>
                <p class="text-base-500 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">O laboratório premium de utilitários web. Design, produtividade e manipulação de documentos de forma rápida, segura e direto no seu navegador sem limite de uso.</p>
                <div class="relative max-w-xl mx-auto group">
                    <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-400 transition-colors"></i>
                    <input type="text" id="tool-search" placeholder="Buscar ferramentas (ex: Certificado, Documento)..." class="w-full bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-2xl py-4 pl-12 pr-4 text-base shadow-sm outline-none transition-all focus:border-base-900 dark:focus:border-white">
                </div>
            </section>
            <section class="max-w-6xl mx-auto px-6 pb-20">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="tools-grid"></div>
            </section>
        `;
        this.renderGrid(toolsData);
        document.getElementById('tool-search').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.renderGrid(toolsData.filter(t => t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)));
        });
    },
    renderGrid(tools) {
        document.getElementById('tools-grid').innerHTML = tools.map(tool => `
            <a href="${tool.hash}" class="group block p-6 bg-white dark:bg-base-900/50 rounded-2xl border border-base-200 dark:border-base-800 hover:border-base-400 dark:hover:border-base-600 transition-all hover:-translate-y-1 shadow-sm hover:shadow-md relative overflow-hidden">
                ${tool.featured ? `<div class="absolute top-0 right-0 bg-base-900 text-white text-[9px] font-bold px-3 py-1 rounded-bl-lg">PRO</div>` : ''}
                <div class="w-10 h-10 rounded-xl bg-base-100 dark:bg-base-800 flex items-center justify-center text-base-900 dark:text-base-100 mb-4 transition-colors group-hover:bg-base-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-base-900">
                    <i data-lucide="${tool.icon}" class="w-5 h-5"></i>
                </div>
                <h3 class="font-bold mb-2">${tool.name}</h3>
                <p class="text-sm text-base-500 dark:text-base-400 mb-4 line-clamp-2">${tool.description}</p>
            </a>
        `).join('');
        lucide.createIcons();
    }
};

const Router = {
    init() { window.addEventListener('hashchange', () => this.navigate()); this.navigate(); },
    navigate() {
        const hash = window.location.hash || '#home';
        if(AppState.currentRoute === hash) return;
        AppState.currentRoute = hash;
        
        const view = document.getElementById('app-view');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        document.getElementById('print-area').innerHTML = '';
        
        gsap.to(view, { opacity: 0, y: -5, duration: 0.15, onComplete: () => {
            const routes = {
                '#qrstudio': QRStudio,
                '#margemzine': MargemZine,
                '#certifica': Certifica,
                '#documenta': Documenta,
                '#texto': TextoTool,
                '#pdf': PDFTool,
                '#imagem': ImagemTool,
                '#sorteador': Sorteador
            };
            if(routes[hash]) { routes[hash].render(view); routes[hash].init(); } 
            else { Home.render(view); }
            lucide.createIcons();
            gsap.fromTo(view, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.25 });
        }});
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    Router.init();
    lucide.createIcons();
});

