# Requerimientos para el HUB (hub.asciende.pro)

Esta aplicación satélite requiere que el HUB tenga los siguientes componentes:

## 1. Página de Login (`/auth` o ruta principal)

Una página que:
- Muestre un formulario de login (email/password)
- Después de login exitoso, redirija de vuelta a la app satélite con un token:
  ```
  const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
  const sessionToken = 'token-generado-tras-login';
  window.location.href = `${redirectUrl}?session_token=${sessionToken}`;
  ```

## 2. Edge Function: `auth-me`

**Ruta:** `/functions/v1/auth-me`
**Método:** `GET`
**Headers:** `Authorization: Bearer <token>`

**Respuesta exitosa:**
```json
{
  "authenticated": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "athlete|trainer|admin",
    "active_plan": []
  }
}
```

**Respuesta fallida:**
```json
{
  "authenticated": false,
  "error": "Invalid token"
}
```

## 3. Edge Function: `auth-logout`

**Ruta:** `/functions/v1/auth-logout`
**Método:** `POST`
**Headers:** `Authorization: Bearer <token>`

**Respuesta:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Variables de Entorno

Esta app tiene configurado:
```
VITE_HUB_URL=https://ngkcbygyoobqhlmlnuvl.supabase.co
```

Todas las llamadas de autenticación apuntan a ese URL.

## Flujo de Autenticación

### Flujo 1: Usuario accede directamente al satélite (sin sesión en HUB)
1. Usuario sin token → Click en "Login" → Redirige a `${HUB_URL}/auth?redirect=${currentUrl}`
2. HUB muestra login → Usuario se autentica → HUB redirige a `${redirect}?session_token=${token}`
3. App satélite recibe el token → Lo guarda en localStorage → Establece hasToken=true
4. App valida el token llamando a `${HUB_URL}/functions/v1/auth-me`
5. Si válido → Usuario autenticado

### Flujo 2: Usuario ya autenticado en HUB abre el satélite
1. Usuario en HUB hace click en botón "Abrir Cycling"
2. HUB obtiene el token de sesión actual del usuario
3. HUB abre nueva ventana/pestaña con: `https://cycling.asciende.pro?session_token=${token}`
4. Satélite recibe el token → Lo guarda en localStorage → Establece hasToken=true INMEDIATAMENTE
5. Satélite valida el token en background llamando a `${HUB_URL}/functions/v1/auth-me`
6. Usuario ve la aplicación sin necesidad de re-autenticación

### Código recomendado para el botón en el HUB:
```javascript
const openCyclingSatellite = () => {
  const sessionToken = getCurrentUserToken(); // Token actual del usuario en HUB
  const satelliteUrl = 'https://cycling.asciende.pro';
  window.open(`${satelliteUrl}?session_token=${sessionToken}`, '_blank');
};
```

### Logout
- Llama a `${HUB_URL}/functions/v1/auth-logout` → Limpia localStorage → Redirige al HUB

## IMPORTANTE para el HUB
- ❌ NO usar `supabase.auth.setSession()` en el satélite (el token NO es de Supabase)
- ✅ El satélite YA captura automáticamente el token del URL
- ✅ Solo necesitas pasar `?session_token=${token}` en el URL
