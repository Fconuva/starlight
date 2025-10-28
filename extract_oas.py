import pdfplumber
import re

pdf_path = r"PROGRAMA DE ESTUDIO\articles-34446_programa.pdf"

with pdfplumber.open(pdf_path) as pdf:
    full_text = ""
    for page in pdf.pages:
        full_text += page.extract_text() + "\n"

# Guardar en archivo temporal para análisis
with open("pdf_full_text.txt", "w", encoding="utf-8") as f:
    f.write(full_text)

# Buscar OA patterns (OA1:, OA2:, etc.)
oa_pattern = r'(OA\d+:[^OA]*?)(?=OA\d+:|$)'
matches = re.findall(oa_pattern, full_text, re.MULTILINE | re.DOTALL)

if matches:
    print(f"Se encontraron {len(matches)} OAs\n")
    print("=== OBJETIVOS DE APRENDIZAJE ===\n")
    for i, oa in enumerate(matches[:10]):  # Primeros 10 OAs
        print(f"--- OA {i+1} ---")
        # Limpiar espacios múltiples
        cleaned = re.sub(r'\s+', ' ', oa.strip())
        print(cleaned[:500])  # Primeros 500 caracteres
        print()
else:
    print("No se encontraron OAs. Buscando 'Indicador':")
    if 'Indicador' in full_text:
        print("✓ Se encontró 'Indicador' en el documento")
    
    # Mostrar secciones relevantes
    lines = full_text.split('\n')
    for i, line in enumerate(lines):
        if 'OA' in line.upper():
            print(f"Línea {i}: {line[:100]}")
