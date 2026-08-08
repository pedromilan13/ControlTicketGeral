document.addEventListener('DOMContentLoaded', () => {

    // Referências gerais do widget
    const widgetPhone = document.querySelector('.widget-phone');
    const widgetHeader = document.querySelector('.widget-header');
    const toastMessage = document.getElementById('toastMessage');
    const btnCopiar = document.getElementById('btnCopiar');
    const btnLimpar = document.getElementById('btnLimpar');

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
    const lrTicket = document.getElementById('lrTicket');
    const lrContato = document.getElementById('lrContato');
    const lrDescricao = document.getElementById('lrDescricao');
    const lrFila = document.getElementById('lrFila');
    const lrHorario = document.getElementById('lrHorario');
    const lrAcionamento = document.getElementById('lrAcionamento');
    const lrAcionamentoBase = document.getElementById('lrAcionamentoBase');
    const lrAnalista = document.getElementById('lrAnalista');

    // Referências - Abas
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // ==========================================
    // BASE DE CONHECIMENTO: Descrição -> Fila (Leroy Acionamento)
    // Fonte única: usada tanto para popular o dropdown quanto para o
    // preenchimento automático da Fila. Editar só aqui.
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
        { descricao: 'Agendamento recebimento', fila: 'N2 SAP EWM' }
    ];

    const normalizar = (texto) => texto.trim().toLowerCase();

    // Índice de busca (chave normalizada -> fila), gerado a partir da base acima
    const DESCRICAO_FILA = {};
    BASE_DESCRICOES_LEROY.forEach(item => {
        DESCRICAO_FILA[normalizar(item.descricao)] = item.fila;
    });

    // Controla qual modo está ativo: 'geral' ou 'leroy'
    let modoAtivo = 'geral';

    // ==========================================
    // CENTRALIZAÇÃO INICIAL SEM CONFLITO DE CSS
    // ==========================================
    const centralizarWidget = () => {
        if (!widgetPhone) return;
        const width = widgetPhone.offsetWidth || 360;
        const height = widgetPhone.offsetHeight || 750;

        const initialLeft = Math.max(0, (window.innerWidth - width) / 2);
        const initialTop = Math.max(0, (window.innerHeight - height) / 2);

        widgetPhone.style.left = `${initialLeft}px`;
        widgetPhone.style.top = `${initialTop}px`;
    };

    centralizarWidget();
    window.addEventListener('resize', () => {
        if (!widgetPhone.dataset.moved) {
            centralizarWidget();
        }
    });

    // ==========================================
    // POPULAR DATALIST DE DESCRIÇÕES (Leroy Acionamento)
    // ==========================================
    const listaDescricoesLeroy = document.getElementById('listaDescricoesLeroy');
    if (listaDescricoesLeroy) {
        BASE_DESCRICOES_LEROY.forEach(item => {
            const option = document.createElement('option');
            option.value = item.descricao;
            listaDescricoesLeroy.appendChild(option);
        });
    }

    // ==========================================
    // TROCA DE ABA (Geral <-> Leroy Acionamento)
    // ==========================================
    const trocarAba = (tab) => {
        modoAtivo = tab;

        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        tabContents.forEach(content => {
            const isTarget = content.id === (tab === 'geral' ? 'formGeral' : 'formLeroy');
            content.classList.toggle('active', isTarget);
        });
    };

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => trocarAba(btn.dataset.tab));
    });

    // ==========================================
    // MÁSCARA DE DATA/HORA (Geral) - DD/MM/AAAA HH:MM
    // ==========================================
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
        e.target.value = formatarDataHora(e.target.value);
        salvarRascunhoGeral();
    });

    lrHorario.addEventListener('input', (e) => {
        e.target.value = formatarDataHora(e.target.value);
        salvarRascunhoLeroy();
    });

    // ==========================================
    // VÍNCULO AUTOMÁTICO: Descrição -> Fila (Leroy Acionamento)
    // Se a descrição digitada/selecionada bater com a base, preenche a Fila.
    // Se não bater (descrição nova), a Fila continua livre para digitar.
    // ==========================================
    lrDescricao.addEventListener('input', () => {
        const chave = normalizar(lrDescricao.value);
        const filaEncontrada = DESCRICAO_FILA[chave];
        if (filaEncontrada) {
            lrFila.value = filaEncontrada;
        }
        salvarRascunhoLeroy();
    });

    // ==========================================
    // ACIONAMENTO PRÉ-DEFINIDO (Leroy Acionamento)
    // Ao escolher um acionamento, o texto entra pronto com o horário
    // atual já preenchido e selecionado - o usuário só digita por cima
    // se o horário do acionamento não for agora.
    // ==========================================
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

        // Reseta o select para permitir escolher o mesmo item de novo depois
        lrAcionamentoBase.value = '';

        // Se o texto tem horário, deixa ele já selecionado pra digitar por cima
        if (temHorario) {
            const posicaoHora = textoFinal.indexOf(hora);
            lrAcionamento.focus();
            lrAcionamento.setSelectionRange(posicaoHora, posicaoHora + hora.length);
        }
    });

    // ==========================================
    // LÓGICA DE ARRASTAR A JANELA (Drag & Drop Impecável)
    // ==========================================
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    if (widgetHeader && widgetPhone) {
        widgetHeader.addEventListener('mousedown', (e) => {
            isDragging = true;
            widgetPhone.dataset.moved = 'true';

            const rect = widgetPhone.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;

            const maxLeft = window.innerWidth - widgetPhone.offsetWidth;
            const maxTop = window.innerHeight - widgetPhone.offsetHeight;

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            widgetPhone.style.left = `${newLeft}px`;
            widgetPhone.style.top = `${newTop}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }

    // ==========================================
    // RASCUNHO - FORMULÁRIO GERAL
    // (mantém a mesma chave de antes, pra não perder rascunho já salvo)
    // ==========================================
    const carregarRascunhoGeral = () => {
        const rascunho = JSON.parse(localStorage.getItem('rascunhoChamadoPM'));
        if (rascunho) {
            if (rascunho.data) campoData.value = formatarDataHora(rascunho.data);
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

    // ==========================================
    // RASCUNHO - FORMULÁRIO LEROY ACIONAMENTO
    // (chave própria, não interfere no rascunho geral)
    // ==========================================
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
            contato: lrContato.value,
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
    // TOAST
    // ==========================================
    const mostrarToast = (mensagem) => {
        toastMessage.innerHTML = `<i class="mdi mdi-check-circle"></i> ${mensagem}`;
        toastMessage.classList.add('show');
        setTimeout(() => {
            toastMessage.classList.remove('show');
        }, 3000);
    };

    // ==========================================
    // COPIAR P/ TEAMS (texto muda conforme a aba ativa)
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
Contato: ${lrContato.value}
Descrição: ${lrDescricao.value.trim() || 'Sem descrição.'}
Fila: ${lrFila.value.trim() || 'N/A'}
Horário: ${lrHorario.value || 'N/A'}
Acionamento: ${lrAcionamento.value.trim() || 'N/A'}
Analista: ${lrAnalista.value}`;
    };

    const copiarTexto = async (texto) => {
        try {
            await navigator.clipboard.writeText(texto);
            mostrarToast("Copiado e pronto pro Teams!");
        } catch (err) {
            const textArea = document.createElement("textarea");
            textArea.value = texto;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("Copy");
            textArea.remove();
            mostrarToast("Copiado e pronto pro Teams!");
        }
    };

    btnCopiar.addEventListener('click', () => {
        const texto = modoAtivo === 'geral' ? gerarTextoGeral() : gerarTextoLeroy();
        copiarTexto(texto);
    });

    // ==========================================
    // LIMPAR CAMPOS (respeita a aba ativa, mantém Analista)
    // ==========================================
    btnLimpar.addEventListener('click', () => {
        if (modoAtivo === 'geral') {
            campoData.value = '';
            campoTicket.value = '';
            campoContato.selectedIndex = 0;
            campoDescricao.value = '';
            campoStatus.selectedIndex = 0;
            campoQueda.selectedIndex = 0;
            salvarRascunhoGeral();
        } else {
            lrTicket.value = '';
            lrDescricao.value = '';
            lrFila.value = '';
            lrHorario.value = '';
            lrAcionamento.value = '';
            lrAcionamentoBase.value = '';
            salvarRascunhoLeroy();
        }
    });
});
