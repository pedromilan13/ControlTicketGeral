document.addEventListener('DOMContentLoaded', () => {

    const widgetPhone = document.getElementById('widgetPhone');
    const widgetHeader = document.querySelector('.widget-header');
    const toastMessage = document.getElementById('toastMessage');
    const btnCopiar = document.getElementById('btnCopiar');
    const txtBtnCopiar = document.getElementById('txtBtnCopiar');
    const iconBtnCopiar = document.getElementById('iconBtnCopiar');
    const btnCopiarGeralLeroy = document.getElementById('btnCopiarGeralLeroy');
    const btnLimpar = document.getElementById('btnLimpar');
    const btnMinimizar = document.getElementById('btnMinimizar');
    const iconMinimizar = document.getElementById('iconMinimizar');

    const campoData = document.getElementById('campoData');
    const campoTicket = document.getElementById('campoTicket');
    const campoContato = document.getElementById('campoContato');
    const campoOperacao = document.getElementById('campoOperacao');
    const campoAnalista = document.getElementById('campoAnalista');
    const campoDescricao = document.getElementById('campoDescricao');
    const campoStatus = document.getElementById('campoStatus');
    const campoQueda = document.getElementById('campoQueda');

    const CONTATO_LEROY = 'Backlog';
    const lrTicket = document.getElementById('lrTicket');
    const lrDescricao = document.getElementById('lrDescricao');
    const lrFila = document.getElementById('lrFila');
    const lrHorario = document.getElementById('lrHorario');
    const lrAcionamento = document.getElementById('lrAcionamento');
    const lrAcionamentoBase = document.getElementById('lrAcionamentoBase');
    const lrAnalista = document.getElementById('lrAnalista');

    const listaHistorico = document.getElementById('listaHistorico');
    const histVazio = document.getElementById('histVazio');
    const histSemResultado = document.getElementById('histSemResultado');
    const btnLimparHistorico = document.getElementById('btnLimparHistorico');
    const txtLimparHistorico = document.getElementById('txtLimparHistorico');
    const campoBuscaHistorico = document.getElementById('campoBuscaHistorico');

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    const MAPA_ABAS = {
        geral: 'formGeral',
        leroy: 'formLeroy',
        historico: 'formHistorico'
    };

    const ROTULOS_TIPO = {
        geral: 'Produtividade Geral',
        leroy: 'Acionamento Leroy',
        leroyGeral: 'Produtividade Geral (Leroy)'
    };

    const BASE_DESCRICOES_LEROY = [
        { descricao: 'Lentidão p/ liberar remessa', fila: 'N2 SAP TM/LES' },
        { descricao: 'Erro manifesto', fila: 'N2 SAP TM/LES' },
        { descricao: 'Divergência status remessa', fila: 'N2 SAP TM/LES' },
        { descricao: 'ID fora do cockpit', fila: 'N2 SAP TM/LES' },
        { descricao: 'Remessa já planejada no cockpit', fila: 'N2 SAP TM/LES' },
        { descricao: 'Rejeição/Emissão NF', fila: 'N2 SAP TM/LES' },
        { descricao: 'TU não integrada no EWM', fila: 'N2 SAP TM/LES' },
        { descricao: 'Custo frete', fila: 'N2 SAP TM/LES' },
        { descricao: 'Status do Pedido não Modificado', fila: 'N2 SAP TM/LES' },
        { descricao: 'CNF - Nota Saída', fila: 'N2 SAP TM/LES' },
        { descricao: 'Tarefa pendente', fila: 'N2 SAP EWM' },
        { descricao: 'UC sem ID', fila: 'N2 SAP EWM' },
        { descricao: 'Pacote separação EWM', fila: 'N2 SAP EWM' },
        { descricao: 'Finalização conferência', fila: 'N2 SAP EWM' },
        { descricao: 'CNF - Nota de venda saída', fila: 'N2 SAP EWM' },
        { descricao: 'Erro saída de Mercadoria', fila: 'N2 SAP EWM' },
        { descricao: 'Tarefa Armazenagem', fila: 'N2 SAP EWM' },
        { descricao: 'Fila não processada SMQ2', fila: 'N2 SAP EWM' },
        { descricao: 'RFID não confirma tarefa', fila: 'N2 SAP EWM' },
        { descricao: 'Erro Devolução Armazenagem', fila: 'N2 SAP EWM' },
        { descricao: 'Erro Devolução Recebimento Imediata', fila: 'N2 SAP EWM' },
        { descricao: 'NF fora agenda EWM', fila: 'N2 SAP EWM' },
        { descricao: 'Conferência CD', fila: 'N2 SAP EWM' },
        { descricao: 'OVDA Int_19', fila: 'N1 APLICAÇÕES DE NEGÓCIO' },
        { descricao: 'Lentidão Geração Manifesto', fila: 'N2 SAP TM/LES' },
        { descricao: 'Catraca', fila: 'N2 RH' },
        { descricao: 'Divergência arquivo NOTFIS', fila: 'N2 SAP TM/LES' },
        { descricao: 'Estorno', fila: 'N2 SAP TM/LES' },
        { descricao: 'Agendamento recebimento', fila: 'N2 SAP EWM' },
        { descricao: 'Pedido nao integrado no ewm', fila: 'N2 SAP EWM' },
        { descricao: 'NF Sem Inbound EWM', fila: 'N2 SAP MM' },
        { descricao: 'Remessa fora do Cockpit', fila: 'N2 SAP TM/LES' }
    ];

    const normalizar = (texto) => texto.trim().toLowerCase();
    const escaparHtml = (texto) => {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    };

    const DESCRICAO_FILA = {};
    BASE_DESCRICOES_LEROY.forEach(item => DESCRICAO_FILA[normalizar(item.descricao)] = item.fila);

    let modoAtivo = 'geral';

    document.querySelectorAll('form').forEach(form => form.addEventListener('submit', (e) => e.preventDefault()));

    // POSIÇÃO E ESTADO DO WIDGET
    const POSICAO_CHAVE = 'posicaoWidgetPM';
    const MINIMIZADO_CHAVE = 'minimizadoWidgetPM';

    const salvarPosicao = (left, top) => localStorage.setItem(POSICAO_CHAVE, JSON.stringify({ left, top }));

    const centralizarWidget = () => {
        if (!widgetPhone) return;
        const width = widgetPhone.offsetWidth || 360;
        const height = widgetPhone.offsetHeight || 750;
        const initialLeft = Math.max(0, (window.innerWidth - width) / 2);
        const initialTop = Math.max(0, (window.innerHeight - height) / 2);
        widgetPhone.style.left = `${initialLeft}px`;
        widgetPhone.style.top = `${initialTop}px`;
    };

    const restaurarPosicao = () => {
        try {
            const salva = JSON.parse(localStorage.getItem(POSICAO_CHAVE));
            if (salva && typeof salva.left === 'number' && typeof salva.top === 'number') {
                const maxLeft = Math.max(0, window.innerWidth - widgetPhone.offsetWidth);
                const maxTop = Math.max(0, window.innerHeight - widgetPhone.offsetHeight);
                widgetPhone.style.left = `${Math.min(Math.max(0, salva.left), maxLeft)}px`;
                widgetPhone.style.top = `${Math.min(Math.max(0, salva.top), maxTop)}px`;
                widgetPhone.dataset.moved = 'true';
                return true;
            }
        } catch { }
        return false;
    };

    if (!restaurarPosicao()) centralizarWidget();

    window.addEventListener('resize', () => {
        if (!widgetPhone.dataset.moved) {
            centralizarWidget();
        } else {
            const maxLeft = Math.max(0, window.innerWidth - widgetPhone.offsetWidth);
            const maxTop = Math.max(0, window.innerHeight - widgetPhone.offsetHeight);
            const currentLeft = parseInt(widgetPhone.style.left, 10) || 0;
            const currentTop = parseInt(widgetPhone.style.top, 10) || 0;
            widgetPhone.style.left = `${Math.min(currentLeft, maxLeft)}px`;
            widgetPhone.style.top = `${Math.min(currentTop, maxTop)}px`;
        }
    });

    const aplicarMinimizado = (minimizado) => {
        widgetPhone.classList.toggle('minimized', minimizado);
        iconMinimizar.className = minimizado ? 'mdi mdi-window-restore' : 'mdi mdi-window-minimize';
        btnMinimizar.title = minimizado ? 'Restaurar' : 'Minimizar';
        localStorage.setItem(MINIMIZADO_CHAVE, minimizado ? '1' : '0');
    };

    btnMinimizar.addEventListener('click', (e) => {
        e.stopPropagation();
        aplicarMinimizado(!widgetPhone.classList.contains('minimized'));
    });
    aplicarMinimizado(localStorage.getItem(MINIMIZADO_CHAVE) === '1');

    const listaDescricoesLeroy = document.getElementById('listaDescricoesLeroy');
    if (listaDescricoesLeroy) {
        BASE_DESCRICOES_LEROY.forEach(item => {
            const option = document.createElement('option');
            option.value = item.descricao;
            listaDescricoesLeroy.appendChild(option);
        });
    }

    // CONTROLE DE ABAS
    const trocarAba = (tab) => {
        modoAtivo = tab;
        
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
        tabContents.forEach(content => content.classList.toggle('active', content.id === MAPA_ABAS[tab]));
        
        widgetPhone.classList.toggle('modo-leroy', tab === 'leroy');

        // Exibir ou ocultar o botão "P/ Geral" corretamente
        if (tab === 'leroy') {
            btnCopiarGeralLeroy.style.display = 'flex';
            txtBtnCopiar.textContent = 'Copiar Leroy';
        } else {
            btnCopiarGeralLeroy.style.display = 'none';
            txtBtnCopiar.textContent = 'Copiar';
        }

        if (tab === 'historico') renderizarHistorico();

        const semAcaoNoHistorico = tab === 'historico';
        btnCopiar.disabled = semAcaoNoHistorico;
        btnLimpar.disabled = semAcaoNoHistorico;
        btnCopiar.classList.toggle('btn-disabled', semAcaoNoHistorico);
        btnLimpar.classList.toggle('btn-disabled', semAcaoNoHistorico);
    };

    // Inicializa a UI na aba correta no milissegundo zero
    trocarAba('geral');

    tabButtons.forEach(btn => btn.addEventListener('click', () => trocarAba(btn.dataset.tab)));

    // PREENCHIMENTO DE DATA/HORA
    const preencherAgora = (inputElement) => {
        const d = new Date();
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        inputElement.value = `${dia}/${mes}/${ano} ${hh}:${mm}`;
        inputElement.dispatchEvent(new Event('input')); // Força o salvamento no rascunho
    };

    document.getElementById('btnAgoraGeral').addEventListener('click', () => preencherAgora(campoData));
    document.getElementById('btnAgoraLeroy').addEventListener('click', () => preencherAgora(lrHorario));

    const REGEX_ISO = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}(:\d{2})?$/;
    const REGEX_BR = /^\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}(:\d{2})?$/;
    const pareceDataCompleta = (v) => REGEX_ISO.test(v.trim()) || REGEX_BR.test(v.trim());

    const formatarDataHora = (valor) => {
        if (!valor) return '';
        let v = valor.replace(/\D/g, '');
        if (v.length > 12) v = v.substring(0, 12);
        let f = '';
        if (v.length > 0) f += v.substring(0, 2);
        if (v.length > 2) f += '/' + v.substring(2, 4);
        if (v.length > 4) f += '/' + v.substring(4, 8);
        if (v.length > 8) f += ' ' + v.substring(8, 10);
        if (v.length > 10) f += ':' + v.substring(10, 12);
        return f;
    };

    campoData.addEventListener('input', (e) => {
        if (!pareceDataCompleta(e.target.value)) e.target.value = formatarDataHora(e.target.value);
        salvarRascunhoGeral();
    });

    lrHorario.addEventListener('input', (e) => {
        if (!pareceDataCompleta(e.target.value)) e.target.value = formatarDataHora(e.target.value);
        salvarRascunhoLeroy();
    });

    lrDescricao.addEventListener('input', () => {
        const filaEncontrada = DESCRICAO_FILA[normalizar(lrDescricao.value)];
        if (filaEncontrada) lrFila.value = filaEncontrada;
        salvarRascunhoLeroy();
    });

    lrAcionamentoBase.addEventListener('change', () => {
        const template = lrAcionamentoBase.value;
        if (!template) return;
        const d = new Date();
        const hora = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        const textoFinal = template.includes('{HORA}') ? template.replace('{HORA}', hora) : template;
        
        lrAcionamento.value = textoFinal;
        salvarRascunhoLeroy();
        lrAcionamentoBase.value = ''; // Reseta o seletor

        if (template.includes('{HORA}')) {
            const pos = textoFinal.indexOf(hora);
            lrAcionamento.focus();
            lrAcionamento.setSelectionRange(pos, pos + hora.length);
        }
    });

    // ARRASTO DO WIDGET
    let isDragging = false, offsetX = 0, offsetY = 0;
    const iniciarArrasto = (clientX, clientY) => {
        isDragging = true;
        widgetPhone.dataset.moved = 'true';
        const rect = widgetPhone.getBoundingClientRect();
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;
        document.body.style.userSelect = 'none';
    };
    
    const moverArrasto = (clientX, clientY) => {
        if (!isDragging) return;
        let newLeft = Math.max(0, Math.min(clientX - offsetX, window.innerWidth - widgetPhone.offsetWidth));
        let newTop = Math.max(0, Math.min(clientY - offsetY, window.innerHeight - widgetPhone.offsetHeight));
        widgetPhone.style.left = `${newLeft}px`;
        widgetPhone.style.top = `${newTop}px`;
    };
    
    const finalizarArrasto = () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.userSelect = '';
        salvarPosicao(widgetPhone.getBoundingClientRect().left, widgetPhone.getBoundingClientRect().top);
    };

    if (widgetHeader && widgetPhone) {
        widgetHeader.addEventListener('mousedown', (e) => { if (!e.target.closest('.btn-minimize')) iniciarArrasto(e.clientX, e.clientY); });
        document.addEventListener('mousemove', (e) => moverArrasto(e.clientX, e.clientY));
        document.addEventListener('mouseup', finalizarArrasto);
        
        // Suporte Mobile
        widgetHeader.addEventListener('touchstart', (e) => { if (!e.target.closest('.btn-minimize')) iniciarArrasto(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
        document.addEventListener('touchmove', (e) => { if (isDragging) moverArrasto(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
        document.addEventListener('touchend', finalizarArrasto);
    }

    // RASCUNHOS
    const carregarRascunhoGeral = () => {
        const rascunho = JSON.parse(localStorage.getItem('rascunhoChamadoPM'));
        if (rascunho) {
            campoData.value = pareceDataCompleta(rascunho.data || '') ? rascunho.data : formatarDataHora(rascunho.data);
            campoTicket.value = rascunho.ticket || '';
            if (rascunho.contato) campoContato.value = rascunho.contato;
            if (rascunho.operacao) campoOperacao.value = rascunho.operacao;
            if (rascunho.analista) campoAnalista.value = rascunho.analista;
            campoDescricao.value = rascunho.descricao || '';
            if (rascunho.status) campoStatus.value = rascunho.status;
            if (rascunho.queda) campoQueda.value = rascunho.queda;
        }
    };
    const salvarRascunhoGeral = () => {
        localStorage.setItem('rascunhoChamadoPM', JSON.stringify({
            data: campoData.value, ticket: campoTicket.value, contato: campoContato.value,
            operacao: campoOperacao.value, analista: campoAnalista.value, descricao: campoDescricao.value,
            status: campoStatus.value, queda: campoQueda.value
        }));
    };
    [campoTicket, campoContato, campoOperacao, campoAnalista, campoDescricao, campoStatus, campoQueda].forEach(i => {
        i.addEventListener('input', salvarRascunhoGeral);
        i.addEventListener('change', salvarRascunhoGeral);
    });

    const carregarRascunhoLeroy = () => {
        const rascunho = JSON.parse(localStorage.getItem('rascunhoChamadoLeroyPM'));
        if (rascunho) {
            lrTicket.value = rascunho.ticket || '';
            lrDescricao.value = rascunho.descricao || '';
            lrFila.value = rascunho.fila || '';
            lrHorario.value = pareceDataCompleta(rascunho.horario || '') ? rascunho.horario : formatarDataHora(rascunho.horario);
            lrAcionamento.value = rascunho.acionamento || '';
            if (rascunho.analista) lrAnalista.value = rascunho.analista;
        }
    };
    const salvarRascunhoLeroy = () => {
        localStorage.setItem('rascunhoChamadoLeroyPM', JSON.stringify({
            ticket: lrTicket.value, contato: CONTATO_LEROY, descricao: lrDescricao.value,
            fila: lrFila.value, horario: lrHorario.value, acionamento: lrAcionamento.value, analista: lrAnalista.value
        }));
    };
    [lrTicket, lrFila, lrAcionamento, lrAnalista].forEach(i => {
        i.addEventListener('input', salvarRascunhoLeroy);
        i.addEventListener('change', salvarRascunhoLeroy);
    });

    carregarRascunhoGeral();
    carregarRascunhoLeroy();

    // TOAST E VALIDAÇÃO
    const mostrarToast = (mensagem, tipo = 'sucesso') => {
        const icone = tipo === 'erro' ? 'mdi-alert-circle' : 'mdi-check-circle';
        toastMessage.innerHTML = `<i class="mdi ${icone}"></i> ${mensagem}`;
        toastMessage.classList.toggle('toast-error', tipo === 'erro');
        toastMessage.classList.add('show');
        setTimeout(() => toastMessage.classList.remove('show'), 3000);
    };

    const animarBotaoCopia = () => {
        if (!iconBtnCopiar) return;
        iconBtnCopiar.className = 'mdi mdi-check';
        setTimeout(() => { iconBtnCopiar.className = 'mdi mdi-content-copy'; }, 2000);
    };

    const sinalizarCampoVazio = (campo) => {
        campo.classList.remove('field-error');
        void campo.offsetWidth; // Força o reflow
        campo.classList.add('field-error');
        campo.focus();
        setTimeout(() => campo.classList.remove('field-error'), 900);
    };

    const validarAntesDeCopiar = () => {
        const campoTicketAtivo = modoAtivo === 'geral' ? campoTicket : lrTicket;
        if (!campoTicketAtivo.value.trim()) {
            sinalizarCampoVazio(campoTicketAtivo);
            mostrarToast('Preencha o Ticket antes de copiar', 'erro');
            return false;
        }
        return true;
    };

    // FUNÇÕES DE CÓPIA DE TEXTO
    const gerarTextoGeral = () => `Data: ${campoData.value || 'N/A'}\nTicket: ${campoTicket.value.trim() || 'N/A'}\nContato: ${campoContato.value}\nOperação: ${campoOperacao.value}\nAnalista: ${campoAnalista.value}\nDescrição: ${campoDescricao.value.trim() || 'Sem descrição.'}\nStatus: ${campoStatus.value}\nQueda: ${campoQueda.value}`;
    const gerarTextoLeroy = () => `Ticket: ${lrTicket.value.trim() || 'N/A'}\nContato: ${CONTATO_LEROY}\nDescrição: ${lrDescricao.value.trim() || 'Sem descrição.'}\nFila: ${lrFila.value.trim() || 'N/A'}\nHorario: ${lrHorario.value || 'N/A'}\nAcionamento: ${lrAcionamento.value.trim() || 'N/A'}\nAnalista: ${lrAnalista.value}`;
    const gerarTextoLeroyParaGeral = () => `Data: ${lrHorario.value || 'N/A'}\nTicket: ${lrTicket.value.trim() || 'N/A'}\nContato: Backlog\nOperação: Leroy\nAnalista: ${lrAnalista.value}\nDescrição: Acionamento\nStatus: Encaminhado\nQueda: N/A`;

    const copiarTexto = async (texto, rotuloTipo) => {
        const mensagem = rotuloTipo ? `Copiado: ${rotuloTipo}` : 'Copiado com sucesso!';
        try {
            await navigator.clipboard.writeText(texto);
            mostrarToast(mensagem);
            animarBotaoCopia();
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = texto;
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('Copy');
            textArea.remove();
            mostrarToast(mensagem);
            animarBotaoCopia();
        }
    };

    // HISTÓRICO
    const HISTORICO_CHAVE = 'historicoChamadosPM';
    const HISTORICO_LIMITE = 50;

    const obterHistorico = () => {
        try { return JSON.parse(localStorage.getItem(HISTORICO_CHAVE)) || []; } catch { return []; }
    };
    const salvarHistoricoCompleto = (lista) => localStorage.setItem(HISTORICO_CHAVE, JSON.stringify(lista));

    const montarRegistroHistorico = (texto, tipoOverride = null) => {
        const tipoFinal = tipoOverride || modoAtivo;
        if (tipoFinal === 'geral') {
            return {
                id: Date.now(), tipo: 'geral', timestamp: Date.now(),
                ticket: campoTicket.value.trim() || 'N/A', resumo: `${campoOperacao.value} · ${campoStatus.value}`, texto,
                campos: { data: campoData.value, ticket: campoTicket.value, contato: campoContato.value, operacao: campoOperacao.value, analista: campoAnalista.value, descricao: campoDescricao.value, status: campoStatus.value, queda: campoQueda.value }
            };
        } else if (tipoFinal === 'leroyGeral') {
            return {
                id: Date.now(), tipo: 'geral', timestamp: Date.now(),
                ticket: lrTicket.value.trim() || 'N/A', resumo: `Leroy · Encaminhado (Auto)`, texto,
                campos: { data: lrHorario.value, ticket: lrTicket.value, contato: 'Backlog', operacao: 'Leroy', analista: lrAnalista.value, descricao: 'Acionamento', status: 'Encaminhado', queda: 'N/A' }
            };
        }
        return {
            id: Date.now(), tipo: 'leroy', timestamp: Date.now(),
            ticket: lrTicket.value.trim() || 'N/A', resumo: `${lrDescricao.value.trim() || 'Sem descrição'} · ${lrFila.value.trim() || 'N/A'}`, texto,
            campos: { ticket: lrTicket.value, contato: CONTATO_LEROY, descricao: lrDescricao.value, fila: lrFila.value, horario: lrHorario.value, acionamento: lrAcionamento.value, analista: lrAnalista.value }
        };
    };

    const adicionarAoHistorico = (texto, tipoOverride = null) => {
        const lista = obterHistorico();
        lista.unshift(montarRegistroHistorico(texto, tipoOverride));
        if (lista.length > HISTORICO_LIMITE) lista.length = HISTORICO_LIMITE;
        salvarHistoricoCompleto(lista);
    };

    const excluirDoHistorico = (id) => {
        salvarHistoricoCompleto(obterHistorico().filter(item => item.id !== id));
        renderizarHistorico();
    };

    const restaurarDoHistorico = (id) => {
        const item = obterHistorico().find(i => i.id === id);
        if (!item) return;
        
        if (item.tipo === 'geral') {
            campoData.value = pareceDataCompleta(item.campos.data || '') ? item.campos.data : formatarDataHora(item.campos.data || '');
            campoTicket.value = item.campos.ticket || '';
            campoContato.value = item.campos.contato || 'Telefone';
            campoOperacao.value = item.campos.operacao || campoOperacao.value;
            campoAnalista.value = item.campos.analista || campoAnalista.value;
            campoDescricao.value = item.campos.descricao || '';
            campoStatus.value = item.campos.status || 'Encaminhado';
            campoQueda.value = item.campos.queda || 'N/A';
            salvarRascunhoGeral();
            trocarAba('geral');
        } else {
            lrTicket.value = item.campos.ticket || '';
            lrDescricao.value = item.campos.descricao || '';
            lrFila.value = item.campos.fila || '';
            lrHorario.value = formatarDataHora(item.campos.horario || '');
            lrAcionamento.value = item.campos.acionamento || '';
            lrAnalista.value = item.campos.analista || lrAnalista.value;
            salvarRascunhoLeroy();
            trocarAba('leroy');
        }
        mostrarToast('Restaurado no formulário!');
    };

    const renderizarHistorico = () => {
        const listaCompleta = obterHistorico();
        const termo = normalizar(campoBuscaHistorico.value);
        const lista = termo ? listaCompleta.filter(i => normalizar(i.ticket).includes(termo) || normalizar(i.resumo).includes(termo)) : listaCompleta;

        listaHistorico.innerHTML = '';
        histVazio.style.display = listaCompleta.length === 0 ? 'flex' : 'none';
        histSemResultado.style.display = (listaCompleta.length > 0 && lista.length === 0) ? 'flex' : 'none';
        listaHistorico.style.display = lista.length === 0 ? 'none' : 'flex';
        campoBuscaHistorico.parentElement.style.display = listaCompleta.length === 0 ? 'none' : 'flex';

        lista.forEach(item => {
            const div = document.createElement('div');
            div.className = 'hist-item';
            div.innerHTML = `
                <div class="hist-item-header">
                    <span class="hist-badge ${item.tipo === 'geral' ? 'hist-badge-geral' : 'hist-badge-leroy'}">${item.tipo === 'geral' ? 'Geral' : 'Leroy'}</span>
                    <span class="hist-ticket"><i class="mdi mdi-ticket-outline"></i> ${escaparHtml(item.ticket)}</span>
                    <span class="hist-time">${new Date(item.timestamp).toLocaleString('pt-BR', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'})}</span>
                </div>
                <div class="hist-resumo">${escaparHtml(item.resumo)}</div>
                <div class="hist-actions">
                    <button type="button" class="hist-btn hist-recopiar" title="Copiar de novo"><i class="mdi mdi-content-copy"></i></button>
                    <button type="button" class="hist-btn hist-restaurar" title="Restaurar nos campos"><i class="mdi mdi-restore"></i></button>
                    <button type="button" class="hist-btn hist-excluir" title="Excluir do histórico"><i class="mdi mdi-trash-can-outline"></i></button>
                </div>`;
            div.querySelector('.hist-recopiar').addEventListener('click', () => {
                const i = obterHistorico().find(x => x.id === item.id);
                if(i) copiarTexto(i.texto, ROTULOS_TIPO[i.tipo]);
            });
            div.querySelector('.hist-restaurar').addEventListener('click', () => restaurarDoHistorico(item.id));
            div.querySelector('.hist-excluir').addEventListener('click', () => excluirDoHistorico(item.id));
            listaHistorico.appendChild(div);
        });
    };

    campoBuscaHistorico.addEventListener('input', renderizarHistorico);

    let timeoutLimpeza = null;
    btnLimparHistorico.addEventListener('click', () => {
        if (obterHistorico().length === 0) return;
        if (!btnLimparHistorico.classList.contains('confirming')) {
            btnLimparHistorico.classList.add('confirming');
            txtLimparHistorico.textContent = 'Confirmar?';
            timeoutLimpeza = setTimeout(() => {
                btnLimparHistorico.classList.remove('confirming');
                txtLimparHistorico.textContent = 'Limpar';
            }, 3000);
            return;
        }
        salvarHistoricoCompleto([]);
        clearTimeout(timeoutLimpeza);
        btnLimparHistorico.classList.remove('confirming');
        txtLimparHistorico.textContent = 'Limpar';
        renderizarHistorico();
        mostrarToast('Histórico limpo!');
    });

    // AÇÕES GLOBAIS DE BOTÕES
    const executarCopiaPrincipal = () => {
        if (modoAtivo === 'historico') return; 
        if (!validarAntesDeCopiar()) return;
        
        const texto = modoAtivo === 'geral' ? gerarTextoGeral() : gerarTextoLeroy();
        adicionarAoHistorico(texto);
        copiarTexto(texto, ROTULOS_TIPO[modoAtivo]);
    };

    btnCopiar.addEventListener('click', executarCopiaPrincipal);

    btnCopiarGeralLeroy.addEventListener('click', () => {
        if (!validarAntesDeCopiar()) return;
        const texto = gerarTextoLeroyParaGeral();
        adicionarAoHistorico(texto, 'leroyGeral');
        copiarTexto(texto, ROTULOS_TIPO['leroyGeral']);
    });

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !btnCopiar.disabled) {
            e.preventDefault();
            executarCopiaPrincipal();
        }
    });

    btnLimpar.addEventListener('click', () => {
        if (modoAtivo === 'geral') {
            campoData.value = ''; campoTicket.value = ''; campoContato.selectedIndex = 0;
            campoDescricao.value = ''; campoStatus.selectedIndex = 0; campoQueda.selectedIndex = 0;
            salvarRascunhoGeral();
        } else if (modoAtivo === 'leroy') {
            lrTicket.value = ''; lrDescricao.value = ''; lrFila.value = '';
            lrHorario.value = ''; lrAcionamento.value = ''; lrAcionamentoBase.value = '';
            salvarRascunhoLeroy();
        }
    });
});
