#!/bin/bash

# Define the list of required files and their unique content
declare -A files_content=(
  ["documento_identidade_mock.pdf"]="Mock content for Documento Identidade Upload"
  ["autodeclaracao_mock.pdf"]="Mock content for Auto Declaration"
  ["diploma_graduacao_mock.pdf"]="Mock content for Graduation Diploma 1"
  ["historico_graduacao_mock.pdf"]="Mock content for Academic Record 1"
  ["diploma_graduacao2_mock.pdf"]="Mock content for Graduation Diploma 2"
  ["historico_graduacao2_mock.pdf"]="Mock content for Academic Record 2"
  ["calculo1_syllabus.pdf"]="Mock content for Syllabus - Calculus 1"
  ["mecanica_syllabus.pdf"]="Mock content for Syllabus - Mechanics"
  ["ia_syllabus.pdf"]="Mock content for Syllabus - Artificial Intelligence"
  ["projeto_ml_mock.pdf"]="Mock content for Project with Scholarship"
  ["projeto_web_mock.pdf"]="Mock content for Project without Scholarship"
  ["publicacao_rn_mock.pdf"]="Mock content for Publication on Neural Networks"
  ["publicacao_pi_mock.pdf"]="Mock content for Publication on Image Processing"
  ["resenha_cq_mock.pdf"]="Mock content for Review on Quantum Computing"
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
