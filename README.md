# Fintech SecurePay — Evaluación Parcial Práctica
**Universidad de las Fuerzas Armadas ESPE**  
Departamento de Ciencias de la Computación | Ingeniería de Software  
Arquitecturas Distribuidas — 2026

---

## Bitácora de Evaluación

### Fase 1 — Refactorización SOLID (`feature/01-refactor-solid`)

**Rama:** `feature/01-refactor-solid` → merge a `main`  
**Commit:** `refactor(solid): segregar logica del monolito e inyectar dependencias por constructor`

Se descompuso el monolito `transaction.monolith.service.js` en cuatro módulos con responsabilidad única:

| Servicio | Responsabilidad |
|---|---|
| `validation.service.js` | Verificación de existencia de cuentas y reglas de negocio |
| `ledger.service.js` | Deducción/crédito de saldos y registro en historial |
| `notification.service.js` | Envío simulado de correos (console.log) |
| `transaction.service.js` | Orquestador que recibe los tres servicios por constructor (DIP) |

El contenedor `src/config/container.js` instancia y ensambla todas las dependencias.

---

### Fase 2 — Autenticación Stateless JWT RS256 (`feature/02-auth-jwt`)

**Rama:** `feature/02-auth-jwt` → merge a `main`  
**Commit:** `feat(jwt): implementar firmado asimetrico rs256 y middleware de validacion autonoma public-key`

- Par de llaves generado con `./keypair.sh` (OpenSSL PKCS#8, 2048 bits).
- `jwt.service.js` firma con `private.pem` y verifica con `public.pem`, algoritmo RS256, expiración 2 minutos.
- `auth.middleware.js` extrae el Bearer Token, verifica con clave pública autónoma y adjunta el payload a `req.user`.

#### Captura Postman — Token generado (POST /v1/auth/login)

> 📸 _Agregar captura aquí_

#### Captura Postman — Acceso válido con token (GET /v1/account-alpha/balance)

> 📸 _Agregar captura aquí_

#### Captura Postman — Token expirado (401)

> 📸 _Agregar captura aquí_

---

### Fase 3 — Observabilidad Sentry (`feature/03-observabilidad`)

**Rama:** `feature/03-observabilidad` → merge a `main`  
**Commit:** `feat(sentry): instrumentar backend y separar manejo de excepciones logicas 401 de fallos operacionales 500`

**Regla de observabilidad distribuida implementada:**

| Tipo de error | HTTP | ¿Reporta a Sentry? |
|---|---|---|
| Token expirado / malformado (lógico) | 401 | ❌ NO |
| Caída de conexión al clúster (operacional) | 500 | ✅ SÍ, con Tag `affected_user_id` |

`src/instrument.js` es importado como primera línea de `index.js` antes de Express.

#### Captura Sentry — Error operacional 500 con Tag de usuario

> 📸 _Agregar captura aquí_

---

## Árbol de commits Git

```
main
├── feat(sentry): instrumentar backend y separar manejo de excepciones logicas 401 de fallos operacionales 500
├── feat(jwt): implementar firmado asimetrico rs256 y middleware de validacion autonoma public-key
└── refactor(solid): segregar logica del monolito e inyectar dependencias por constructor
```

---

## Estructura del proyecto

```
fintech-securepay-base/
├── src/
│   ├── config/
│   │   ├── container.js        ← Contenedor DIP
│   │   ├── database.js         ← Base de datos en memoria
│   │   └── env.js
│   ├── controllers/
│   │   ├── account.controller.js
│   │   ├── auth.controller.js
│   │   └── transfer.controller.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── account.routes.js
│   │   ├── transfer.routes.js
│   │   └── index.js
│   ├── services/
│   │   ├── jwt.service.js
│   │   ├── ledger.service.js
│   │   ├── notification.service.js
│   │   ├── transaction.service.js
│   │   └── validation.service.js
│   └── instrument.js           ← Sentry (primer import)
├── index.js
├── keypair.sh
├── .env.example
├── .gitignore
└── README.md
```

---

*© 2026 Universidad de las Fuerzas Armadas ESPE — "Honor, Disciplina, Lealtad"*