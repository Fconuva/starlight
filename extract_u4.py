import re

# Leer el archivo de texto
with open("pdf_full_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Buscar la Unidad 4 - Poder y ambición
u4_pattern = r'(ObjetivOs de\s+AprendizAje.*?U4.*?(?=ObjetivOs de AprendizAje|$))'
u4_match = re.search(u4_pattern, text, re.IGNORECASE | re.DOTALL)

if u4_match:
    u4_section = u4_match.group(1)
    
    # Extraer OAs con sus indicadores
    oa_pattern = r'(OA \d+)\s+([^O]*?)(?=OA \d+|$)'
    oa_matches = re.findall(oa_pattern, u4_section, re.DOTALL)
    
    print("=== UNIDAD 4: PODER Y AMBICIÓN ===\n")
    print(f"Encontrados {len(oa_matches)} OAs\n")
    
    for i, (oa_num, content) in enumerate(oa_matches[:10]):
        # Limpiar espacios múltiples
        cleaned = re.sub(r'\s+', ' ', content.strip())
        print(f"{oa_num}")
        print(f"{cleaned[:600]}")
        print("-" * 80)
        print()
else:
    print("No se encontró Unidad 4")
    
    # Mostrar líneas con "OA " para debug
    lines = text.split('\n')
    count = 0
    for i, line in enumerate(lines):
        if 'OA ' in line and 'OA 3' in line:
            print(f"Línea {i}: {line}")
            count += 1
            if count > 20:
                break
