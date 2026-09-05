document.addEventListener('DOMContentLoaded', () => {

    // Referências gerais do widget
    const widgetPhone = document.getElementById('widgetPhone');
    const widgetHeader = document.querySelector('.widget-header');
    const toastMessage = document.getElementById('toastMessage');
    const btnCopiar = document.getElementById('btnCopiar');
    const btnLimpar = document.getElementById('btnLimpar');
    const btnMinimizar = document.getElementById('btnMinimizar');
    const iconMinimizar = document.getElementById('iconMinimizar');

    // Referências - Formulário Geral
    const campoData = document.getElementById('campoData');
    const campoTicket = document.getElementById('campoTicket');
    const campoContato = document.getElementById('campoContato');
    const campoOperacao = document.getElementById('campoOperacao');
    const campoAnalista = document.getElementById('campoAnalista');
    const campoDescricao = document.getElementById('campoDescricao');
    const campoStatus = document.getElementById('campoStatus');
    const campoQueda = document.getElementById('campoQueda');

    // Referências - Formulário Leroy Acionamento
    const CONTATO_LEROY = 'Backlog';
    const lrTicket = document.getElementById('lrTicket');
    const lrDescricao = document.getElementById('lrDescricao');
    const lrFila = document.getElementById('lrFila');
    const lrHorario = document.getElementById('lrHorario');
    const lrAcionamento = document.getElementById('lrAcionamento');
    const lrAcionamentoBase = document.getElementById('lrAcionamentoBase');
    const lrAnalista = document.getElementById('lrAnalista');

    // Referências - Histórico
    const listaHistorico = document.getElementById('listaHistorico');
    const histVazio = document.getElementById('histVazio');
    const histSemResultado = document.getElementById('histSemResultado');
    const btnLimparHistorico = document.getElementById('btnLimparHistorico');
    const txtLimparHistorico = document.getElementById('txtLimparHistorico');
    const campoBuscaHistorico = document.getElementById('campoBuscaHistorico');

    // Referências - Abas
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Mapa aba -> id do conteúdo (facilita adicionar novas abas no futuro)
    const MAPA_ABAS = {
        geral: 'formGeral',
        leroy: 'formLeroy',
        historico: 'formHistorico'
    };

    // Rótulo exato de cada tipo de registro
    const ROTULOS_TIPO = {
        geral: 'Passagem de Turno',
        leroy: 'Acionamento Leroy'
    };

    // ==========================================
    // BASE DE CONHECIMENTO: Descrição -> Fila (Leroy Acionamento)
    // ==========================================
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

    // Escapa HTML contra XSS
    const escaparHtml = (texto) => {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    };

    // Índice de busca
    const DESCRICAO_FILA = {};
    BASE_DESCRICOES_LEROY.forEach(item => {
        DESCRICAO_FILA[normalizar(item.descricao)] = item.fila;
    });

    let modoAtivo = 'geral';

    // Evitar Submit Acidental
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => e.preventDefault());
    });

    // ==========================================
    // POSIÇÃO E ESTADO MINIMIZADO
    // ==========================================
    const POSICAO_CHAVE = 'posicaoWidgetPM';
    const MINIMIZADO_CHAVE = 'minimizadoWidgetPM';

    const salvarPosicao = (left, top) => {
        localStorage.setItem(POSICAO_CHAVE, JSON.stringify({ left, top }));
    };

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
        } catch {
            // Ignora se corrompido
        }
        return false;
    };

    if (!restaurarPosicao()) {
        centralizarWidget();
    }

    // CORREÇÃO: Mantém widget dentro da tela ao redimensionar
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

    // Popular Datalist Leroy
    const listaDescricoesLeroy = document.getElementById('listaDescricoesLeroy');
    if (listaDescricoesLeroy) {
        BASE_DESCRICOES_LEROY.forEach(item => {
            const option = document.createElement('option');
            option.value = item.descricao;
            listaDescricoesLeroy.appendChild(option);
        });
    }

    // ==========================================
    // TROCA DE ABA
    // ==========================================
    const trocarAba = (tab) => {
        modoAtivo = tab;

        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        tabContents.forEach(content => {
            const isTarget = content.id === MAPA_ABAS[tab];
            content.classList.toggle('active', isTarget);
        });

        widgetPhone.classList.toggle('modo-leroy', tab === 'leroy');

        if (tab === 'historico') {
            renderizarHistorico();
        }

        const semAcaoNoHistorico = tab === 'historico';
        btnCopiar.disabled = semAcaoNoHistorico;
        btnLimpar.disabled = semAcaoNoHistorico;
        btnCopiar.classList.toggle('btn-disabled', semAcaoNoHistorico);
        btnLimpar.classList.toggle('btn-disabled', semAcaoNoHistorico);
    };

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => trocarAba(btn.dataset.tab));
    });

    // ==========================================
    // MÁSCARA DE DATA/HORA
    // ==========================================
    // CORREÇÃO: Regex permitindo segundos opcionais para lidar com diferentes copys
    const REGEX_ISO_COMPLETO = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}(:\d{2})?$/;
    const REGEX_BR_COMPLETO = /^\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}(:\d{2})?$/;

    const pareceDataCompletaColada = (valor) => {
        const v = valor.trim();
        return REGEX_ISO_COMPLETO.test(v) || REGEX_BR_COMPLETO.test(v);
    };

    const formatarDataHora = (valor) => {
        if (!valor) return '';

        let v = valor.replace(/\D/g, '');
        if (v.length > 12) v = v.substring(0, 12);

        let formatted = '';
        if (v.length > 0) formatted += v.substring(0, 2);
        if (v.length > 2) formatted += '/' + v.substring(2, 4);
        if (v.length > 4) formatted += '/' + v.substring(4, 8);
        if (v.length > 8) formatted += ' ' + v.substring(8, 10);
        if (v.length > 10) formatted += ':' + v.substring(10, 12);

        return formatted;
    };

    campoData.addEventListener('input', (e) => {
        if (!pareceDataCompletaColada(e.target.value)) {
            e.target.value = formatarDataHora(e.target.value);
        }
        salvarRascunhoGeral();
    });

    lrHorario.addEventListener('input', (e) => {
        if (!pareceDataCompletaColada(e.target.value)) {
            e.target.value = formatarDataHora(e.target.value);
        }
        salvarRascunhoLeroy();
    });

    // Vínculo Automático Leroy
    lrDescricao.addEventListener('input', () => {
        const chave = normalizar(lrDescricao.value);
        const filaEncontrada = DESCRICAO_FILA[chave];
        if (filaEncontrada) {
            lrFila.value = filaEncontrada;
        }
        salvarRascunhoLeroy();
    });

    // Acionamento Pré-definido
    const horaAtual = () => {
        const agora = new Date();
        const hh = String(agora.getHours()).padStart(2, '0');
        const mm = String(agora.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    };

    lrAcionamentoBase.addEventListener('change', () => {
        const template = lrAcionamentoBase.value;
        if (!template) return;

        const temHorario = template.includes('{HORA}');
        const hora = horaAtual();
        const textoFinal = temHorario ? template.replace('{HORA}', hora) : template;

        lrAcionamento.value = textoFinal;
        salvarRascunhoLeroy();

        lrAcionamentoBase.value = '';

        if (temHorario) {
            const posicaoHora = textoFinal.indexOf(hora);
            lrAcionamento.focus();
            lrAcionamento.setSelectionRange(posicaoHora, posicaoHora + hora.length);
        }
    });

    // ==========================================
    // LÓGICA DE ARRASTAR
    // ==========================================
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

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

        let newLeft = clientX - offsetX;
        let newTop = clientY - offsetY;

        const maxLeft = window.innerWidth - widgetPhone.offsetWidth;
        const maxTop = window.innerHeight - widgetPhone.offsetHeight;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        widgetPhone.style.left = `${newLeft}px`;
        widgetPhone.style.top = `${newTop}px`;
    };

    const finalizarArrasto = () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.userSelect = '';

        const rect = widgetPhone.getBoundingClientRect();
        salvarPosicao(rect.left, rect.top);
    };

    if (widgetHeader && widgetPhone) {
        // Mouse
        widgetHeader.addEventListener('mousedown', (e) => {
            if (e.target.closest('.btn-minimize')) return;
            iniciarArrasto(e.clientX, e.clientY);
        });
        document.addEventListener('mousemove', (e) => moverArrasto(e.clientX, e.clientY));
        document.addEventListener('mouseup', finalizarArrasto);

        // Touch
        widgetHeader.addEventListener('touchstart', (e) => {
            if (e.target.closest('.btn-minimize')) return;
            const toque = e.touches[0];
            iniciarArrasto(toque.clientX, toque.clientY);
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const toque = e.touches[0];
            moverArrasto(toque.clientX, toque.clientY);
        }, { passive: true });

        document.addEventListener('touchend', finalizarArrasto);
    }

    // ==========================================
    // RASCUNHOS
    // ==========================================
    const carregarRascunhoGeral = () => {
        const rascunho = JSON.parse(localStorage.getItem('rascunhoChamadoPM'));
        if (rascunho) {
            if (rascunho.data) {
                campoData.value = pareceDataCompletaColada(rascunho.data)
                    ? rascunho.data
                    : formatarDataHora(rascunho.data);
            }
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
        const dados = {
            data: campoData.value,
            ticket: campoTicket.value,
            contato: campoContato.value,
            operacao: campoOperacao.value,
            analista: campoAnalista.value,
            descricao: campoDescricao.value,
            status: campoStatus.value,
            queda: campoQueda.value
        };
        localStorage.setItem('rascunhoChamadoPM', JSON.stringify(dados));
    };

    const inputsGeral = [campoTicket, campoContato, campoOperacao, campoAnalista, campoDescricao, campoStatus, campoQueda];
    inputsGeral.forEach(input => {
        input.addEventListener('input', salvarRascunhoGeral);
        input.addEventListener('change', salvarRascunhoGeral);
    });

    const carregarRascunhoLeroy = () => {
        const rascunho = JSON.parse(localStorage.getItem('rascunhoChamadoLeroyPM'));
        if (rascunho) {
            lrTicket.value = rascunho.ticket || '';
            lrDescricao.value = rascunho.descricao || '';
            lrFila.value = rascunho.fila || '';
            if (rascunho.horario) lrHorario.value = formatarDataHora(rascunho.horario);
            lrAcionamento.value = rascunho.acionamento || '';
            if (rascunho.analista) lrAnalista.value = rascunho.analista;
        }
    };

    const salvarRascunhoLeroy = () => {
        const dados = {
            ticket: lrTicket.value,
            contato: CONTATO_LEROY,
            descricao: lrDescricao.value,
            fila: lrFila.value,
            horario: lrHorario.value,
            acionamento: lrAcionamento.value,
            analista: lrAnalista.value
        };
        localStorage.setItem('rascunhoChamadoLeroyPM', JSON.stringify(dados));
    };

    const inputsLeroy = [lrTicket, lrFila, lrAcionamento, lrAnalista];
    inputsLeroy.forEach(input => {
        input.addEventListener('input', salvarRascunhoLeroy);
        input.addEventListener('change', salvarRascunhoLeroy);
    });

    carregarRascunhoGeral();
    carregarRascunhoLeroy();

    // ==========================================
    // TOAST & VALIDAÇÃO
    // ==========================================
    const mostrarToast = (mensagem, tipo = 'sucesso') => {
        const icone = tipo === 'erro' ? 'mdi-alert-circle' : 'mdi-check-circle';
        toastMessage.innerHTML = `<i class="mdi ${icone}"></i> ${mensagem}`;
        toastMessage.classList.toggle('toast-error', tipo === 'erro');
        toastMessage.classList.add('show');
        setTimeout(() => {
            toastMessage.classList.remove('show');
        }, 3000);
    };

    const sinalizarCampoVazio = (campo) => {
        campo.classList.remove('field-error');
        void campo.offsetWidth;
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

    // ==========================================
    // COPIAR TEXTO
    // ==========================================
    const gerarTextoGeral = () => {
        return `Data: ${campoData.value || 'N/A'}
Ticket: ${campoTicket.value.trim() || 'N/A'}
Contato: ${campoContato.value}
Operação: ${campoOperacao.value}
Analista: ${campoAnalista.value}
Descrição: ${campoDescricao.value.trim() || 'Sem descrição.'}
Status: ${campoStatus.value}
Queda: ${campoQueda.value}`;
    };

    const gerarTextoLeroy = () => {
        return `Ticket: ${lrTicket.value.trim() || 'N/A'}
Contato: ${CONTATO_LEROY}
Descrição: ${lrDescricao.value.trim() || 'Sem descrição.'}
Fila: ${lrFila.value.trim() || 'N/A'}
Horario: ${lrHorario.value || 'N/A'}
Acionamento: ${lrAcionamento.value.trim() || 'N/A'}
Analista: ${lrAnalista.value}`;
    };

    const copiarTexto = async (texto, rotuloTipo) => {
        const mensagem = rotuloTipo ? `Copiado: ${rotuloTipo}` : 'Copiado com sucesso!';
        try {
            await navigator.clipboard.writeText(texto);
            mostrarToast(mensagem);
        } catch (err) {
            // CORREÇÃO: Style adicionado para prevenir o pulo da tela
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
        }
    };

    // ==========================================
    // HISTÓRICO
    // ==========================================
    const HISTORICO_CHAVE = 'historicoChamadosPM';
    const HISTORICO_LIMITE = 50;

    const formatarDataExibicao = (timestamp) => {
        const d = new Date(timestamp);
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        return `${dia}/${mes} ${hh}:${mm}`;
    };

    const obterHistorico = () => {
        try {
            return JSON.parse(localStorage.getItem(HISTORICO_CHAVE)) || [];
        } catch {
            return [];
        }
    };

    const salvarHistoricoCompleto = (lista) => {
        localStorage.setItem(HISTORICO_CHAVE, JSON.stringify(lista));
    };

    const montarRegistroHistorico = (texto) => {
        if (modoAtivo === 'geral') {
            return {
                id: Date.now(),
                tipo: 'geral',
                timestamp: Date.now(),
                ticket: campoTicket.value.trim() || 'N/A',
                resumo: `${campoOperacao.value} · ${campoStatus.value}`,
                texto,
                campos: {
                    data: campoData.value,
                    ticket: campoTicket.value,
                    contato: campoContato.value,
                    operacao: campoOperacao.value,
                    analista: campoAnalista.value,
                    descricao: campoDescricao.value,
                    status: campoStatus.value,
                    queda: campoQueda.value
                }
            };
        }
        return {
            id: Date.now(),
            tipo: 'leroy',
            timestamp: Date.now(),
            ticket: lrTicket.value.trim() || 'N/A',
            resumo: `${lrDescricao.value.trim() || 'Sem descrição'} · ${lrFila.value.trim() || 'N/A'}`,
            texto,
            campos: {
                ticket: lrTicket.value,
                contato: CONTATO_LEROY,
                descricao: lrDescricao.value,
                fila: lrFila.value,
                horario: lrHorario.value,
                acionamento: lrAcionamento.value,
                analista: lrAnalista.value
            }
        };
    };

    const adicionarAoHistorico = (texto) => {
        const registro = montarRegistroHistorico(texto);
        const lista = obterHistorico();
        lista.unshift(registro); 
        if (lista.length > HISTORICO_LIMITE) lista.length = HISTORICO_LIMITE;
        salvarHistoricoCompleto(lista);
    };

    const excluirDoHistorico = (id) => {
        const lista = obterHistorico().filter(item => item.id !== id);
        salvarHistoricoCompleto(lista);
        renderizarHistorico();
    };

    const restaurarDoHistorico = (id) => {
        const item = obterHistorico().find(i => i.id === id);
        if (!item) return;

        if (item.tipo === 'geral') {
            campoData.value = pareceDataCompletaColada(item.campos.data || '')
                ? item.campos.data
                : formatarDataHora(item.campos.data || '');
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

    const recopiarDoHistorico = (id) => {
        const item = obterHistorico().find(i => i.id === id);
        if (!item) return;
        copiarTexto(item.texto, ROTULOS_TIPO[item.tipo]);
    };

    const filtrarHistorico = (lista, termo) => {
        const chave = normalizar(termo || '');
        if (!chave) return lista;
        return lista.filter(item =>
            normalizar(item.ticket).includes(chave) ||
            normalizar(item.resumo).includes(chave)
        );
    };

    const renderizarHistorico = () => {
        const listaCompleta = obterHistorico();
        const termo = campoBuscaHistorico.value;
        const lista = filtrarHistorico(listaCompleta, termo);

        listaHistorico.innerHTML = '';

        const semNadaCadastrado = listaCompleta.length === 0;
        const semResultadoBusca = !semNadaCadastrado && lista.length === 0;

        histVazio.style.display = semNadaCadastrado ? 'flex' : 'none';
        histSemResultado.style.display = semResultadoBusca ? 'flex' : 'none';
        listaHistorico.style.display = lista.length === 0 ? 'none' : 'flex';
        campoBuscaHistorico.parentElement.style.display = semNadaCadastrado ? 'none' : 'flex';

        lista.forEach(item => {
            const div = document.createElement('div');
            div.className = 'hist-item';
            div.dataset.id = item.id;

            const badgeClasse = item.tipo === 'geral' ? 'hist-badge-geral' : 'hist-badge-leroy';
            const badgeTexto = item.tipo === 'geral' ? 'Geral' : 'Leroy';

            div.innerHTML = `
                <div class="hist-item-header">
                    <span class="hist-badge ${badgeClasse}">${badgeTexto}</span>
                    <span class="hist-ticket"><i class="mdi mdi-ticket-outline"></i> ${escaparHtml(item.ticket)}</span>
                    <span class="hist-time">${formatarDataExibicao(item.timestamp)}</span>
                </div>
                <div class="hist-resumo">${escaparHtml(item.resumo)}</div>
                <div class="hist-actions">
                    <button type="button" class="hist-btn hist-recopiar" title="Copiar de novo">
                        <i class="mdi mdi-content-copy"></i>
                    </button>
                    <button type="button" class="hist-btn hist-restaurar" title="Restaurar nos campos">
                        <i class="mdi mdi-restore"></i>
                    </button>
                    <button type="button" class="hist-btn hist-excluir" title="Excluir do histórico">
                        <i class="mdi mdi-trash-can-outline"></i>
                    </button>
                </div>
            `;

            div.querySelector('.hist-recopiar').addEventListener('click', () => recopiarDoHistorico(item.id));
            div.querySelector('.hist-restaurar').addEventListener('click', () => restaurarDoHistorico(item.id));
            div.querySelector('.hist-excluir').addEventListener('click', () => excluirDoHistorico(item.id));

            listaHistorico.appendChild(div);
        });
    };

    campoBuscaHistorico.addEventListener('input', renderizarHistorico);

    // ==========================================
    // LIMPAR HISTÓRICO
    // ==========================================
    let aguardandoConfirmacaoLimpeza = false;
    let timeoutConfirmacaoLimpeza = null;

    const resetarConfirmacaoLimpeza = () => {
        aguardandoConfirmacaoLimpeza = false;
        btnLimparHistorico.classList.remove('confirming');
        txtLimparHistorico.textContent = 'Limpar';
        clearTimeout(timeoutConfirmacaoLimpeza);
    };

    btnLimparHistorico.addEventListener('click', () => {
        if (obterHistorico().length === 0) return;

        if (!aguardandoConfirmacaoLimpeza) {
            aguardandoConfirmacaoLimpeza = true;
            btnLimparHistorico.classList.add('confirming');
            txtLimparHistorico.textContent = 'Confirmar?';
            timeoutConfirmacaoLimpeza = setTimeout(resetarConfirmacaoLimpeza, 3000);
            return;
        }

        salvarHistoricoCompleto([]);
        resetarConfirmacaoLimpeza();
        renderizarHistorico();
        mostrarToast('Histórico limpo!');
    });

    // ==========================================
    // AÇÕES PRINCIPAIS (Copiar e Limpar)
    // ==========================================
    const executarCopia = () => {
        if (modoAtivo === 'historico') return; 
        if (!validarAntesDeCopiar()) return;

        const texto = modoAtivo === 'geral' ? gerarTextoGeral() : gerarTextoLeroy();
        adicionarAoHistorico(texto);
        copiarTexto(texto, ROTULOS_TIPO[modoAtivo]);
    };

    btnCopiar.addEventListener('click', executarCopia);

    document.addEventListener('keydown', (e) => {
        const teclaCopiar = (e.ctrlKey || e.metaKey) && e.key === 'Enter';
        if (teclaCopiar && !btnCopiar.disabled) {
            e.preventDefault();
            executarCopia();
        }
    });

    btnLimpar.addEventListener('click', () => {
        if (modoAtivo === 'geral') {
            campoData.value = '';
            campoTicket.value = '';
            campoContato.selectedIndex = 0;
            campoDescricao.value = '';
            campoStatus.selectedIndex = 0;
            campoQueda.selectedIndex = 0;
            salvarRascunhoGeral();
        } else if (modoAtivo === 'leroy') {
            lrTicket.value = '';
            lrDescricao.value = '';
            lrFila.value = '';
            lrHorario.value = '';
            lrAcionamento.value = '';
            lrAcionamentoBase.value = '';
            salvarRascunhoLeroy();
        }
    });

    renderizarHistorico();
});
