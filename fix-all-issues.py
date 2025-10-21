#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para reparar TODOS los emojis corruptos y otros problemas en registro-notas.html
"""
import re

# Leer el archivo
with open('public/privado/registro-notas.html', 'r', encoding='utf-8') as f:
    content = f.read()

original_content = content

# Mapeo de emojis corruptos a correctos
emoji_fixes = [
    # Checkmark corrupto
    (r'ℹœ…', '✅'),
    (r'ℹœ"', '✔'),
    
    # Info corrupto
    (r'ℹŒ', 'ℹ️'),
    (r'ℹœï¸', 'ℹ️'),
    (r'ℹœ', 'ℹ️'),
    
    # Bullet point corrupto
    (r'ℹ€¢', '•'),
    
    # Warning corrupto
    (r'ℹš ï¸', '⚠️'),
    
    # File corrupto
    (r'ðŸ"„', '📄'),
    
    # Party popper corrupto
    (r'ðŸŽ‰', '🎉'),
    
    # Star corrupto
    (r'ðŸŒŸ', '🌟'),
    
    # Cross mark corrupto
    (r'ℹœ—', '❌'),
    
    # Exclamation corrupto
    (r'ℹ¡', '¡'),
]

print("🔧 Reparando emojis corruptos...\n")

count = 0
for pattern, replacement in emoji_fixes:
    matches = len(re.findall(pattern, content))
    if matches > 0:
        content = re.sub(pattern, replacement, content)
        count += matches
        print(f"  ✓ {pattern} → {replacement}: {matches} reemplazos")

print(f"\n✅ Total: {count} emojis corruptos reparados\n")

# Buscar y eliminar la descripción "Alicia, Joselin, Pia y tú trabajan en los mismos cursos"
print("🗑️ Buscando descripción a eliminar...\n")

# Buscar el texto específico
description_pattern = r'Alicia, Joselin, Pia y tú trabajan en los mismos cursos'
if re.search(description_pattern, content):
    content = re.sub(description_pattern, '', content)
    print("  ✓ Descripción eliminada\n")
else:
    print("  ⚠️ Descripción no encontrada (puede que ya esté eliminada)\n")

# Guardar archivo
if content != original_content:
    with open('public/privado/registro-notas.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Archivo actualizado exitosamente!")
    print("📁 Archivo: public/privado/registro-notas.html")
else:
    print("ℹ️ No se encontraron cambios necesarios")
