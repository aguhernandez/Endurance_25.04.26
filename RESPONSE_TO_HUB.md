# Respuesta del Satélite Cycling al HUB

## ❌ La sugerencia del HUB es INCORRECTA

La propuesta de usar `supabase.auth.setSession()` NO funcionará porque:

1. **El token del HUB NO es un token de Supabase**
   - Es un token de sesión del HUB
   - Debe validarse contra las edge functions del HUB, no contra Supabase

2. **El satélite NO usa autenticación de Supabase para usuarios**
   - Solo usa Supabase como base de datos
   - La autenticación es completamente manejada por el HUB

3. **`supabase.auth.setSession()` espera tokens OAuth de Supabase**
   - Access tokens y refresh tokens generados por Supabase Auth
   - No puede validar tokens externos del HUB

## ✅ La solución correcta (YA IMPLEMENTADA)

El satélite **YA estaba capturando el token correctamente** en `useSatelliteAuth.ts`.

El único problema era un tema de **timing**: establecer `hasToken=true` DESPUÉS de la validación async causaba una redirección prematura.

### Cambio realizado:

```typescript
// ANTES (problemático)
if (tokenFromUrl) {
  localStorage.setItem('hub_session_token', tokenFromUrl);
  // No se establecía hasToken aquí
}

const storedToken = localStorage.getItem('hub_session_token');
if (storedToken) {
  setHasToken(true); // ❌ Demasiado tarde, después de validación async
  // ... validación ...
}

// AHORA (correcto)
if (tokenFromUrl) {
  localStorage.setItem('hub_session_token', tokenFromUrl);
  setHasToken(true); // ✅ INMEDIATAMENTE para evitar redirección
  // ... limpiar URL ...
}
```

## 🎯 Qué debe hacer el HUB

**Código para el botón "Abrir Cycling":**

```typescript
const openCyclingSatellite = () => {
  // Obtener el token actual del usuario autenticado en el HUB
  const sessionToken = getCurrentUserToken();

  // Abrir el satélite con el token en el URL
  const satelliteUrl = 'https://cycling.asciende.pro';
  window.open(`${satelliteUrl}?session_token=${sessionToken}`, '_blank');

  // O si prefieres en la misma ventana:
  // window.location.href = `${satelliteUrl}?session_token=${sessionToken}`;
};
```

**Eso es TODO lo que necesita el HUB.**

El satélite se encarga de:
1. ✅ Capturar el token del URL
2. ✅ Guardarlo en localStorage
3. ✅ Establecer hasToken=true INMEDIATAMENTE
4. ✅ Validar el token contra `/functions/v1/auth-me`
5. ✅ Autenticar al usuario

## 📋 Resumen

- **NO** intentar usar `supabase.auth.setSession()` (no funcionará)
- **SÍ** simplemente pasar `?session_token=${token}` en el URL
- **SÍ** el satélite ya maneja todo automáticamente
- **SÍ** el problema de timing ya está solucionado

## 🔄 Flujo completo

1. Usuario autenticado en HUB hace click en "Abrir Cycling"
2. HUB abre: `https://cycling.asciende.pro?session_token=${token}`
3. Satélite captura el token del URL
4. Satélite guarda en localStorage y establece hasToken=true
5. Satélite limpia el URL (quita el token por seguridad)
6. Satélite valida el token en background
7. Usuario ve la aplicación sin necesidad de re-login ✅
