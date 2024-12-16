#!/bin/bash

# Define the list of required files and their unique content
declare -A files_content=(
  ["1_01_documento_identidade.pdf"]="Mock content for Documento Identidade Upload"
  ["1_02_autodeclaracao.pdf"]="Mock content for Auto Declaration"
  ["2_01_diploma_graduacao.pdf"]="Mock content for Graduation Diploma 1"
  ["2_02_historico_graduacao.pdf"]="Mock content for Academic Record 1"
  ["2_03_diploma_graduacao2.pdf"]="Mock content for Graduation Diploma 2"
  ["2_04_historico_graduacao2.pdf"]="Mock content for Academic Record 2"
  ["3_01_calculo1_syllabus.pdf"]="Mock content for Syllabus - Calculus 1"
  ["3_02_mecanica_syllabus.pdf"]="Mock content for Syllabus - Mechanics"
  ["3_03_ia_syllabus.pdf"]="Mock content for Syllabus - Artificial Intelligence"
  ["4_01_projeto_ml.pdf"]="Mock content for Project with Scholarship"
  ["4_02_projeto_web.pdf"]="Mock content for Project without Scholarship"
  ["4_03_publicacao_rn.pdf"]="Mock content for Publication on Neural Networks"
  ["4_04_publicacao_pi.pdf"]="Mock content for Publication on Image Processing"
  ["4_05_resenha_cq.pdf"]="Mock content for Review on Quantum Computing"
)

# Create output directory for mock files
output_dir="mock_pdfs"
mkdir -p "$output_dir"

# Generate each PDF file
for file in "${!files_content[@]}"; do
  content="${files_content[$file]}"
  output_file="$output_dir/$file"

  # Create temporary markdown file with content
  echo "$content" > temp.md
  
  # Use pandoc to convert markdown to PDF
  pandoc temp.md -o "$output_file"
  
  # Remove temporary markdown file
  rm temp.md

  echo "Generated: $output_file"
done

# Print completion message
echo "All mock PDF files have been created in the '$output_dir' directory."
