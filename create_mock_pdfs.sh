#!/bin/bash

# Define the list of required files and their content
declare -A files_content=(
  ["doc_id_upload.pdf"]="Mock content for Document ID Upload"
  ["autodeclaracao.pdf"]="Mock content for Auto Declaration"
  ["diploma1.pdf"]="Mock content for Graduation Diploma 1"
  ["historico1.pdf"]="Mock content for Academic Record 1"
  ["diploma2.pdf"]="Mock content for Graduation Diploma 2"
  ["historico2.pdf"]="Mock content for Academic Record 2"
  ["syllabi_calculo1.pdf"]="Mock content for Syllabi - Calculus 1"
  ["syllabi_algebra_linear.pdf"]="Mock content for Syllabi - Linear Algebra"
  ["syllabi_estatistica.pdf"]="Mock content for Syllabi - Statistics"
  ["proj_bolsa.pdf"]="Mock content for Projects with Scholarship"
  ["proj_sem_bolsa.pdf"]="Mock content for Projects without Scholarship"
  ["pub_a1a2.pdf"]="Mock content for Publications A1/A2"
  ["pub_b1b2.pdf"]="Mock content for Publications B1/B2"
  ["docencia_ies.pdf"]="Mock content for Teaching at Higher Education Institutions"
)

# Create output directory for mock files
output_dir="mock_pdfs"
mkdir -p "$output_dir"

# Generate each PDF file
for file in "${!files_content[@]}"; do
  content="${files_content[$file]}"
  output_file="$output_dir/$file"

  # Use pandoc to generate the PDF
  echo "$content" > temp.md
  pandoc temp.md -o "$output_file"
  rm temp.md

  echo "Generated: $output_file"
done

# Print completion message
echo "All mock PDF files have been created in the '$output_dir' directory."
