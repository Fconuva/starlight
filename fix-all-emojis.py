#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script completo para reparar TODOS los emojis corruptos en registro-notas.html
"""
import re

# Leer el archivo
with open('public/privado/registro-notas.html', 'r', encoding='utf-8') as f:
    content = f.read()

original_content = content

# Mapeo completo de emojis corruptos (incluyendo los que aparecen en consola)
emoji_fixes = [
    # Checkmark corrupto
    ('ℹœ…', '✅'),
    ('ℹœ"', '✔'),
    
    # Info corrupto  
    ('ℹŒ', 'ℹ️'),
    ('ℹœï¸', 'ℹ️'),
    ('ℹœ', 'ℹ️'),
    
    # Bullet point corrupto
    ('ℹ€¢', '•'),
    
    # Warning corrupto
    ('ℹš ï¸', '⚠️'),
    
    # File corrupto
    ('ðŸ"„', '📄'),
    
    # Party popper corrupto
    ('ðŸŽ‰', '🎉'),
    
    # Star corrupto
    ('ðŸŒŸ', '🌟'),
    
    # Cross mark corrupto
    ('ℹœ—', '❌'),
    
    # Exclamation corrupto
    ('ℹ¡', '¡'),
    
    # Question mark corrupto
    ('ℹ¿', '¿'),
]

print("🔧 Reparando emojis corruptos en registro-notas.html...\n")

count = 0
for pattern, replacement in emoji_fixes:
    # Escapar caracteres especiales de regex
    pattern_escaped = re.escape(pattern)
    matches = len(re.findall(pattern_escaped, content))
    if matches > 0:
        content = content.replace(pattern, replacement)
        count += matches
        print(f"  ✓ {pattern} → {replacement}: {matches} reemplazos")

print(f"\n✅ Total: {count} emojis corruptos reparados")

# Guardar archivo
if content != original_content:
    with open('public/privado/registro-notas.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ Archivo actualizado exitosamente!")
    print("📁 Archivo: public/privado/registro-notas.html")
else:
    print("\nℹ️ No se encontraron cambios necesarios")
