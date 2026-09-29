/**
 * Script para preencher e testar o formulário de inscrição automaticamente.
 * Foi ajustado para corresponder à estrutura mais recente dos formulários e aos
 * arquivos mock gerados pelo script `create_mocks.py`.
 * Cole este código no console do navegador na página do formulário e execute
 * (a página deve ser servida por HTTP, ex.: `python3 -m http.server`, para que
 * os PDFs de `mock_pdfs/` possam ser carregados).
 *
 * Modalidade: por padrão é Mestrado. Para Doutorado, defina antes de colar:
 *   window.TESTFILL_MODALIDADE = 'Doutorado';
 */
async function fillAndTestForm(modalidade = window.TESTFILL_MODALIDADE || 'Mestrado') {
    console.log(`🚀 Iniciando preenchimento automático do formulário (${modalidade})...`);

    // === Funções Auxiliares ===
    function fillText(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.value = value;
            el.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            console.warn(`Elemento não encontrado: #${id}`);
        }
    }

    function checkRadioOrCheckbox(selector) {
        const el = document.querySelector(selector);
        if (el) {
            el.checked = true;
            el.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            console.warn(`Elemento não encontrado: ${selector}`);
        }
    }

    // Anexa o PDF de `mock_pdfs/`; se não for possível carregá-lo, usa um arquivo falso.
    async function setFileInput(id, fileName) {
        const fileInput = document.getElementById(id);
        if (fileInput) {
            const finalFileName = fileName || `${id}.pdf`;
            let content = ['mock content'];
            try {
                const response = await fetch(`mock_pdfs/${finalFileName}`);
                if (response.ok) content = [await response.arrayBuffer()];
                else console.warn(`Mock não encontrado: mock_pdfs/${finalFileName}`);
            } catch (e) {
                console.warn(`Falha ao carregar mock_pdfs/${finalFileName}`, e);
            }
            const dataTransfer = new DataTransfer();
            const file = new File(content, finalFileName, { type: 'application/pdf' });
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            console.warn(`Elemento de arquivo não encontrado: #${id}`);
        }
    }

    // === Preenchimento dos Campos ===

    // -- Modalidade (Mestrado/Doutorado) --
    const modalidadeSelect = document.getElementById('modalidadeSelect');
    if (modalidadeSelect) {
        modalidadeSelect.value = modalidade;
        modalidadeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
        console.warn('Elemento não encontrado: #modalidadeSelect');
    }

    // -- Seção 1: Identificação do Candidato --
    console.log("Preenchendo Seção 1: Identificação");
    fillText('nomeCompleto', 'Candidato Teste da Silva');
    fillText('email', 'teste@example.com');
    fillText('cpf', '12345678900');
    fillText('documentoIdentificacao', '1234567 SSP/CE');
    fillText('cidade', 'Fortaleza/CE');
    fillText('telefoneCelular', '(85) 99999-8888');
    checkRadioOrCheckbox('#cotaNaoSeAplica');
    await setFileInput('docIdentidadeUpload');
    await setFileInput('autodeclaracaoUpload', 'autodeclaracao_mock.pdf');
    await setFileInput('dcfUpload', 'dcf_mock.pdf');

    // -- Seção 2: Formação Acadêmica --
    console.log("Preenchendo Seção 2: Formação Acadêmica");
    fillText('curriculoLattes', 'http://lattes.cnpq.br/1234567890123456');
    fillText('curriculoOrcid', 'https://orcid.org/0000-0002-1825-0097');
    fillText('cursoGraduacao', 'Engenharia de Software');
    fillText('instituicao', 'Universidade Federal do Ceará');
    fillText('igcInstituicao', '4');
    fillText('ira', '8.75');
    await setFileInput('diplomaGraduacaoUpload', 'diploma_graduacao_mock.pdf');
    await setFileInput('historicoDisciplinasGraduacao', 'historico_graduacao_mock.pdf');
    if (modalidade === 'Doutorado') {
        await setFileInput('diplomaMestradoUpload', 'diploma_graduacao_mock.pdf');
        await setFileInput('historicoMestradoUpload', 'historico_graduacao_mock.pdf');
        await setFileInput('projetoPesquisaUpload', 'projPesqComBolsaUpload.pdf');
    }

    // -- Seção 4: Avaliação Curricular --
    console.log("Preenchendo Seção 4: Avaliação Curricular");
    fillText('motivacaoMestrado', 'Minha principal motivação é aprofundar meus conhecimentos em Ciência de Dados para resolver problemas complexos do mundo real. Tenho grande expectativa em poder colaborar com os pesquisadores do programa e desenvolver uma dissertação de alto impacto na área de Métodos Estatísticos.');
    checkRadioOrCheckbox('#cdMetodosEstatisticos');
    await setFileInput('tabelaPontuacaoUpload');
    await setFileInput('projPesqComBolsaUpload');
    await setFileInput('projPesqSemBolsaUpload');
    await setFileInput('revistasA1A2Upload');
    await setFileInput('revistasA3A4Upload');
    await setFileInput('revistasB1B2Upload');
    await setFileInput('revistasB3B4Upload');
    await setFileInput('revistasCUpload');
    await setFileInput('anaisArtigoCompletoUpload');
    await setFileInput('anaisResumoEstendidoUpload');
    await setFileInput('anaisResumoUpload');
    await setFileInput('docenciaIESUpload');
    await setFileInput('iniciacaoDocenciaUpload');
    await setFileInput('docenciaBasicoUpload');
    await setFileInput('bolsaPETUpload');
    await setFileInput('outraBolsaIESUpload');

    // -- Seção 5: Questionário Socioeconômico --
    console.log("Preenchendo Seção 5: Questionário Socioeconômico");
    checkRadioOrCheckbox('#pardoMulato');
    fillText('localizacaoMoradia', 'Rua dos Testes, 123, Bairro Exemplo, Fortaleza/CE');
    fillText('localCondicaoMoradia', 'Resido em um apartamento com boas condições, 3 quartos, bem iluminado e ventilado.');
    fillText('numeroMoradores', '4');
    checkRadioOrCheckbox('#escolaFundamentalPublica');
    checkRadioOrCheckbox('#escolaMedioPublica');
    fillText('escolaridadeFamiliares', 'Pai: Ensino Médio completo. Mãe: Ensino Superior incompleto.');
    fillText('rendaFamiliar', '3500');
    fillText('quantidadeLivros', '12');

    // -- Seção 6: Autodeclaração --
    console.log("Preenchendo Seção 6: Autodeclaração");
    checkRadioOrCheckbox('#naoExercoAtividadeRemunerada');
    checkRadioOrCheckbox('#estouCienteDasPenalidades');
    checkRadioOrCheckbox('#autorizoAveriguacoes');

    console.log("✅ Preenchimento concluído!");
    console.log("🖱️ Acionando o botão 'Gerar PDF'...");

    // === Acionar Validação e Geração do PDF ===
    document.getElementById('generatePdfBtn').click();
}

// Executa a função
fillAndTestForm();