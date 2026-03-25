---
name: calculador-tokens-v2
description: "Activa este skill cuando el usuario quiere calcular o estimar cuántos tokens está gastando en una conversación. Se activa con frases como '/tokens', 'calcula tokens', 'audita tokens', 'cuántos tokens he gastado', 'tokens conversación', 'estima tokens uso', 'consumo tokens', 'revisa tokens'. Usa lógica reutilizable de core library."
---

# Calculador de Tokens (Chat)

Versión optimizada para claude.ai que importa lógica compartida del paquete `@token-calc/core`.

## Cuándo activarse

- `/tokens`
- `calcula tokens`
- `cuántos tokens he gastado`
- `audita tokens conversación`
- `tokens conversación`
- Cualquier petición sobre estimación de consumo de tokens

## Procedimiento

### Paso 0: Solicitud de consentimiento (PRIMERA VEZ SOLO)

```
🔐 CONSENTIMIENTO PARA DATOS EXACTOS

He detectado que tienes datos de sistema inyectados por Anthropic:
  • User Preferences: ~468 tokens ✅
  • User Memory: ~2,800-3,200 tokens ✅

¿Quieres que use estos datos para calcular con más precisión?

[SÍ, usar datos exactos] [NO, calcular solo de conversación visible]
```

**Si SÍ**: Margen de error ±18%
**Si NO**: Margen de error ±22-30%

### Paso 1: Recopilar datos del usuario

```
📊 CÁLCULO DE TOKENS

Dime aproximadamente:

1. ¿Cuántos mensajes llevas? (tuyo + míos)
2. ¿Has subido archivos? (imágenes, PDFs, documentos)
3. ¿Hay conversación anterior pegada?
4. Otros detalles relevantes
```

### Paso 2: Calcular automáticamente

Usa funciones de `@token-calc/core`:

```
calculateTokens({
  messageCount: X,
  userWords: Y,
  assistantWords: Z,
  language: 'es',
  useExactData: consentimiento
})
```

### Paso 3: Presentar resultado

Usa `formatTokenResult()` de core para output estándar.

## Características

✅ **Reutilizable**: Importa lógica de `packages/core`
✅ **Preciso**: ±18% con datos exactos
✅ **Transparente**: Explica márgenes de error
✅ **Respetuoso con privacidad**: Opción C (preguntar primera vez)
✅ **Memoria de consentimiento**: Recuerda preferencia del usuario

## Principios

1. Transparencia sobre certeza (conozco vs. estimo)
2. No hagas magia (si no sé, lo digo)
3. Contextualiza (zona segura / alerta / límite)
4. Útil, no obsesivo

## Referencias técnicas

- Core library: `@token-calc/core`
- Ratios español: 1 palabra ≈ 1.3 tokens
- Contexto: **200,000 tokens por conversación** (límite documentado públicamente por Anthropic)
- Datos exactos: 3,468 tokens (Preferences + Memory)

---

*Skill asistido por IA — parte de token-calculator-suite, código abierto en GitHub.*
