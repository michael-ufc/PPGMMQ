# generate_mocks.py
import os
import re
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch

# --- Configuração ---
# Caminho para o script de teste que contém os nomes dos arquivos
JS_FILE_PATH = os.path.join("js", "testFill.js")
# Diretório onde os PDFs de mock serão salvos
OUTPUT_DIR = "mock_pdfs"
# --------------------


def extract_filenames_from_js(file_path):
    """
    Lê o arquivo JS e extrai os nomes dos arquivos dos campos de upload.
    Retorna uma lista de nomes de arquivo únicos.
    """
    filenames = set()
    # Regex para encontrar chamadas setFileInput('id', 'opcional_nome.pdf')
    # Captura o primeiro argumento (ID) e o segundo (nome do arquivo), se existir.
    pattern = re.compile(r"setFileInput\('([^']*)'(?:,\s*'([^']*)')?\)")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            matches = pattern.findall(content)
            for match in matches:
                input_id, optional_filename = match
                if optional_filename:
                    # Usa o nome do arquivo explícito se fornecido
                    filenames.add(optional_filename)
                elif input_id:
                    # Caso contrário, cria um nome a partir do ID do input
                    filenames.add(f"{input_id}.pdf")
    except FileNotFoundError:
        print(f"Erro: Arquivo não encontrado em '{file_path}'")
        return []

    return sorted(list(filenames))


def create_mock_pdf(directory, filename):
    """
    Cria um arquivo PDF simples com um texto de identificação.
    """
    filepath = os.path.join(directory, filename)

    try:
        c = canvas.Canvas(filepath, pagesize=letter)
        width, height = letter  # (612.0, 792.0)

        # Configura a fonte e o tamanho
        c.setFont("Helvetica-Bold", 16)

        # Escreve o título
        title = f"Arquivo Mock: {filename}"
        c.drawCentredString(width / 2.0, height - 1.5 * inch, title)

        # Configura a fonte para o corpo do texto
        c.setFont("Helvetica", 12)

        # Escreve o conteúdo
        line1 = "Este é um arquivo PDF gerado automaticamente para fins de teste."
        line2 = (
            f"Ele representa o documento para o campo '{filename.replace('.pdf', '')}'."
        )

        c.drawCentredString(width / 2.0, height - 2.5 * inch, line1)
        c.drawCentredString(width / 2.0, height - 2.7 * inch, line2)

        c.save()
        print(f"  [OK] Arquivo criado: {filepath}")

    except Exception as e:
        print(f"  [ERRO] Falha ao criar {filepath}: {e}")


def main():
    """
    Função principal para orquestrar a geração dos arquivos.
    """
    print("🚀 Iniciando a geração de arquivos PDF mock...")

    # Garante que o diretório de saída exista
    if not os.path.exists(OUTPUT_DIR):
        print(f"Criando diretório de saída: '{OUTPUT_DIR}'")
        os.makedirs(OUTPUT_DIR)

    # Extrai os nomes dos arquivos do script de teste
    filenames_to_generate = extract_filenames_from_js(JS_FILE_PATH)

    if not filenames_to_generate:
        print("Nenhum nome de arquivo encontrado no script JS. Saindo.")
        return

    print(f"\nEncontrados {len(filenames_to_generate)} arquivos para gerar:")

    # Gera um PDF para cada nome de arquivo encontrado
    for filename in filenames_to_generate:
        create_mock_pdf(OUTPUT_DIR, filename)

    print(
        f"\n✅ Concluído! {len(filenames_to_generate)} arquivos mock foram gerados em '{OUTPUT_DIR}'."
    )


if __name__ == "__main__":
    main()
