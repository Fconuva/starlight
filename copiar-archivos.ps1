# Script de Migración - Copiar archivos del sitio de Francisco al sitio de Javiera
# Fecha: 2025-10-19

Write-Host "🚀 INICIANDO MIGRACIÓN DE ARCHIVOS" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Definir rutas
$sourcePath = "C:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog"
$destPath = "C:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profesorajavierapoblete"

# Verificar que las carpetas existan
if (-not (Test-Path $sourcePath)) {
    Write-Host "❌ ERROR: No se encuentra la carpeta source: $sourcePath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $destPath)) {
    Write-Host "❌ ERROR: No se encuentra la carpeta destino: $destPath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Carpetas verificadas" -ForegroundColor Green
Write-Host ""

# FASE 1: Copiar archivos HTML principales
Write-Host "📄 FASE 1: Copiando archivos HTML..." -ForegroundColor Yellow

$htmlFiles = @(
    @{Source="privado\registro-notas.html"; Dest="public\privado\index.html"},
    @{Source="privado\dashboard.html"; Dest="public\privado\dashboard.html"},
    @{Source="privado\admin-db-docentes.html"; Dest="public\privado\admin-db-docentes.html"}
)

foreach ($file in $htmlFiles) {
    $src = Join-Path $sourcePath $file.Source
    $dst = Join-Path $destPath $file.Dest
    
    if (Test-Path $src) {
        Copy-Item $src $dst -Force
        Write-Host "  ✓ Copiado: $($file.Source) → $($file.Dest)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ No encontrado: $($file.Source)" -ForegroundColor Yellow
    }
}

Write-Host ""

# FASE 2: Copiar archivos JSON de datos
Write-Host "📊 FASE 2: Copiando archivos JSON..." -ForegroundColor Yellow

$jsonFiles = @(
    "privado\objetivos-aprendizaje-lenguaje-NUEVO.json",
    "privado\objetivos-aprendizaje-lenguaje.json"
)

foreach ($file in $jsonFiles) {
    $src = Join-Path $sourcePath $file
    $dst = Join-Path $destPath "public\privado\$(Split-Path $file -Leaf)"
    
    if (Test-Path $src) {
        Copy-Item $src $dst -Force
        Write-Host "  ✓ Copiado: $file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ No encontrado: $file" -ForegroundColor Yellow
    }
}

Write-Host ""

# FASE 3: Copiar Netlify Functions
Write-Host "⚡ FASE 3: Copiando Netlify Functions..." -ForegroundColor Yellow

$functionFiles = @(
    "get-courses.js",
    "save-courses.js",
    "delete-course.js"
)

foreach ($file in $functionFiles) {
    $src = Join-Path $sourcePath "netlify\functions\$file"
    $dst = Join-Path $destPath "netlify\functions\$file"
    
    if (Test-Path $src) {
        Copy-Item $src $dst -Force
        Write-Host "  ✓ Copiado: netlify\functions\$file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ No encontrado: netlify\functions\$file" -ForegroundColor Yellow
    }
}

Write-Host ""

# FASE 4: Copiar Database Schemas
Write-Host "🗄️ FASE 4: Copiando Database Schemas..." -ForegroundColor Yellow

$dbFiles = @(
    "schema.sql",
    "init.sql"
)

foreach ($file in $dbFiles) {
    $src = Join-Path $sourcePath "database\$file"
    $dst = Join-Path $destPath "database\$file"
    
    if (Test-Path $src) {
        Copy-Item $src $dst -Force
        Write-Host "  ✓ Copiado: database\$file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ No encontrado: database\$file" -ForegroundColor Yellow
    }
}

Write-Host ""

# FASE 5: Copiar archivos CSS (si existen)
Write-Host "🎨 FASE 5: Copiando archivos CSS..." -ForegroundColor Yellow

$cssPath = Join-Path $sourcePath "css"
if (Test-Path $cssPath) {
    $destCssPath = Join-Path $destPath "public\css"
    New-Item -ItemType Directory -Path $destCssPath -Force | Out-Null
    Copy-Item "$cssPath\*" $destCssPath -Recurse -Force
    Write-Host "  ✓ Copiada carpeta CSS completa" -ForegroundColor Green
} else {
    Write-Host "  ⚠ No encontrada carpeta CSS" -ForegroundColor Yellow
}

Write-Host ""

# RESUMEN
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✅ MIGRACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📁 Archivos copiados a: $destPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "  1. cd '$destPath'" -ForegroundColor White
Write-Host "  2. npm install" -ForegroundColor White
Write-Host "  3. Crear archivo .env con las variables de entorno" -ForegroundColor White
Write-Host "  4. npm run dev (para probar localmente)" -ForegroundColor White
Write-Host "  5. git add . && git commit -m 'Migrar sistema de notas' && git push" -ForegroundColor White
Write-Host ""
