# PowerShell script to update all gem-planner constant files for break_infinity.js support

$gemPlannerPath = "C:\Users\igorn\projects\huntersim2\src\constants\gem-planner"
$filesToUpdate = Get-ChildItem -Path $gemPlannerPath -Filter "*.js" | Where-Object { $_.Name -ne "index.js" -and $_.Name -ne "stats.js" }

foreach ($file in $filesToUpdate) {
    $filePath = $file.FullName
    $content = Get-Content -Path $filePath -Raw
    
    Write-Host "Updating $($file.Name)..."
    
    # Add Decimal import if not already present
    if ($content -notmatch "import Decimal from 'break_infinity\.js'") {
        $content = $content -replace "(\*\/\r?\n)", "`$1import Decimal from 'break_infinity.js';`n"
    }
    
    # Replace all Math.pow patterns with Decimal equivalents
    # Pattern 1: Math.pow(Math.pow(BASE, level), 1 + (LEVEL * 0.1) - 0.1)
    $content = $content -replace "Math\.pow\(Math\.pow\((\d+(?:\.\d+)?), level\), 1 \+ \((\w+Level) \* 0\.1\) - 0\.1\)", {
        param($match)
        $base = $match.Groups[1].Value
        $levelVar = $match.Groups[2].Value
        @"
(() => {
          const levelDecimal = new Decimal(level);
          const ${levelVar}Decimal = new Decimal($levelVar);
          const innerBase = new Decimal($base).pow(levelDecimal);
          const outerExponent = new Decimal(1).add(${levelVar}Decimal.mul(0.1)).sub(0.1);
          return innerBase.pow(outerExponent);
        })()
"@
    }
    
    # Pattern 2: Math.pow(Math.pow(1 + (MULTIPLIER * level), PARAM), 1 + (LEVEL * 0.1) - 0.1)
    $content = $content -replace "Math\.pow\(Math\.pow\(1 \+ \((\d+(?:\.\d+)?) \* level\), (\w+)\), 1 \+ \((\w+Level) \* 0\.1\) - 0\.1\)", {
        param($match)
        $multiplier = $match.Groups[1].Value
        $param = $match.Groups[2].Value
        $levelVar = $match.Groups[3].Value
        @"
(() => {
          const levelDecimal = new Decimal(level);
          const ${levelVar}Decimal = new Decimal($levelVar);
          const ${param}Decimal = new Decimal($param);
          const innerBase = new Decimal(1).add(levelDecimal.mul($multiplier));
          const innerPower = innerBase.pow(${param}Decimal);
          const outerExponent = new Decimal(1).add(${levelVar}Decimal.mul(0.1)).sub(0.1);
          return innerPower.pow(outerExponent);
        })()
"@
    }
    
    # Pattern 3: Math.floor(Math.pow(2 * level, 1 + (LEVEL * 0.1) - 0.1))
    $content = $content -replace "Math\.floor\(Math\.pow\(2 \* level, 1 \+ \((\w+Level) \* 0\.1\) - 0\.1\)\)", {
        param($match)
        $levelVar = $match.Groups[1].Value
        @"
(() => {
          const levelDecimal = new Decimal(level);
          const ${levelVar}Decimal = new Decimal($levelVar);
          const base = new Decimal(2).mul(levelDecimal);
          const exponent = new Decimal(1).add(${levelVar}Decimal.mul(0.1)).sub(0.1);
          return base.pow(exponent).floor();
        })()
"@
    }
    
    # Pattern 4: Math.pow(1 + (MULTIPLIER * level) * PARAM, 1 + (LEVEL * 0.1) - 0.1)
    $content = $content -replace "Math\.pow\(1 \+ \((\d+(?:\.\d+)?) \* level\) \* (\w+), 1 \+ \((\w+Level) \* 0\.1\) - 0\.1\)", {
        param($match)
        $multiplier = $match.Groups[1].Value
        $param = $match.Groups[2].Value
        $levelVar = $match.Groups[3].Value
        @"
(() => {
          const levelDecimal = new Decimal(level);
          const ${levelVar}Decimal = new Decimal($levelVar);
          const ${param}Decimal = new Decimal($param);
          const base = new Decimal(1).add(levelDecimal.mul($multiplier).mul(${param}Decimal));
          const exponent = new Decimal(1).add(${levelVar}Decimal.mul(0.1)).sub(0.1);
          return base.pow(exponent);
        })()
"@
    }
    
    # Clean up the formatting - replace the lambda wrappers with direct returns
    $content = $content -replace "\(\(\) => \{([^}]+)\}\)\(\)", { param($match) $match.Groups[1].Value.Trim() }
    
    # Write the updated content back to the file
    Set-Content -Path $filePath -Value $content -Encoding UTF8
}

Write-Host "All gem-planner constant files have been updated for break_infinity.js support!"
