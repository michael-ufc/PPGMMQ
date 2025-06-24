/**
 * Script para preencher e testar o formulário de inscrição automaticamente.
 * Foi ajustado para corresponder à estrutura mais recente dos formulários e aos
 * arquivos mock gerados pelo script `create_mocks.py`.
 * Cole este código no console do navegador na página do formulário e execute.
 */
async function fillAndTestForm() {
    console.log("🚀 Iniciando preenchimento automático do formulário...");

    // === Funções Auxiliares ===

    // Preenche um campo de texto, select ou textarea
    function fillText(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.value = value;
            el.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            console.warn(`Elemento não encontrado: #${id}`);
        }
    }

    // Marca um radio ou checkbox
    function checkRadioOrCheckbox(selector) {
        const el = document.querySelector(selector);
        if (el) {
            el.checked = true;
            el.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            console.warn(`Elemento não encontrado: ${selector}`);
        }
    }

    // "Anexa" um arquivo falso a um campo de upload.
    // O nome do arquivo é gerado a partir do ID se não for especificado.
    function setFileInput(id, fileName) {
        const fileInput = document.getElementById(id);
        if (fileInput) {
            // Se o nome do arquivo não for fornecido, cria um a partir do ID do campo.
            const finalFileName = fileName || `${id}.pdf`;
            
            const dataTransfer = new DataTransfer();
            const file = new File(['mock content'], finalFileName, { type: 'application/pdf' });
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            console.warn(`Elemento de arquivo não encontrado: #${id}`);
        }
    }

    // === Preenchimento dos Campos (Atualizado com os nomes dos arquivos mock) ===

    // -- Seção 1: Identificação do Candidato --
    console.log("Preenchendo Seção 1: Identificação");
    fillText('nomeCompleto', 'Candidato Teste da Silva');
    fillText('email', 'teste@example.com');
    fillText('cpf', '12345678900');
    fillText('documentoIdentificacao', '1234567 SSP/CE');
    fillText('cidade', 'Fortaleza/CE');
    fillText('telefoneCelular', '(85) 99999-8888');
    checkRadioOrCheckbox('#cotaNaoSeAplica');
    setFileInput('docIdentidadeUpload'); // Gera 'docIdentidadeUpload.pdf'
    setFileInput('autodeclaracaoUpload', 'autodeclaracao_mock.pdf');
    setFileInput('dcfUpload', 'dcf_mock.pdf');


    // -- Seção 2: Formação Acadêmica --
    console.log("Preenchendo Seção 2: Formação Acadêmica");
    fillText('curriculoLattes', 'http://lattes.cnpq.br/1234567890123456');
    fillText('cursoGraduacao', 'Engenharia de Software');
    fillText('instituicao', 'Universidade Federal do Ceará');
    fillText('igcInstituicao', '4');
    fillText('ira', '8.75');
    setFileInput('diplomaGraduacaoUpload', 'diploma_graduacao_mock.pdf');
    setFileInput('historicoDisciplinasGraduacao', 'historico_graduacao_mock.pdf');


    // -- Seção 3: Proposta de Projeto (Não há campos obrigatórios aqui)

    // -- Seção 4: Avaliação Curricular --
    console.log("Preenchendo Seção 4: Avaliação Curricular");
    setFileInput('projPesqComBolsaUpload');
    setFileInput('projPesqSemBolsaUpload');
    setFileInput('revistasA1A2Upload');
    setFileInput('revistasA3A4Upload');
    setFileInput('revistasB1B2Upload');
    setFileInput('revistasB3B4Upload');
    setFileInput('revistasCUpload');
    setFileInput('anaisArtigoCompletoUpload');
    setFileInput('anaisResumoEstendidoUpload');
    setFileInput('anaisResumoUpload');
    setFileInput('docenciaIESUpload');
    setFileInput('iniciacaoDocenciaUpload');
    setFileInput('docenciaBasicoUpload');
    setFileInput('bolsaPETUpload');
    setFileInput('outraBolsaIESUpload');
    setFileInput('tabelaPontuacaoUpload');

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
    fillText('motivacaoEstudos', 'Aprofundar conhecimentos e contribuir para a pesquisa científica.');

    // -- Seção 6: Autodeclaração --
    console.log("Preenchendo Seção 6: Autodeclaração");
    checkRadioOrCheckbox('#naoExercoAtividadeRemunerada');
    checkRadioOrCheckbox('#estouCienteDasPenalidades');
    checkRadioOrCheckbox('#autorizoAveriguacoes');

    // -- Seção 7: Confirmação de Proficiência em Inglês -- (Não há campos obrigatórios aqui)

    console.log("✅ Preenchimento concluído!");
    console.log("🖱️ Acionando o botão 'Gerar PDF'...");

    // === Acionar Validação e Geração do PDF ===
    document.getElementById('generatePdfBtn').click();
}

// Executa a função
fillAndTestForm();