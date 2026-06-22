# Fintech SecurePay — Evaluación Parcial Práctica
**Universidad de las Fuerzas Armadas ESPE**  
Departamento de Ciencias de la Computación | Ingeniería de Software  
Arquitecturas Distribuidas NRC:30732 — 2026
Nombre: David Moran
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

<img width="1443" height="944" alt="image" src="https://github.com/user-attachments/assets/1a042bbd-e4fa-4742-91d4-a6623d92c035" />


#### Captura Postman — Acceso válido con token (GET /v1/account-alpha/balance)

<img width="1462" height="730" alt="image" src="https://github.com/user-attachments/assets/c86604f5-3d37-43b0-9ff8-4d01fe59ac83" />


#### Captura Postman — Token expirado (401)

<img width="1456" height="786" alt="image" src="https://github.com/user-attachments/assets/9b2e8709-bc6e-431a-9603-a38657b08e5b" />

---

### Fase 3 — Observabilidad Sentry (`feature/03-observabilidad`)

**Rama:** `feature/03-observabilidad` → merge a `main`  
**Commit:** `feat(sentry): instrumentar backend y separar manejo de excepciones logicas 401 de fallos operacionales 500`

**Regla de observabilidad distribuida implementada:**

| Tipo de error | HTTP | ¿Reporta a Sentry? |
|---|---|---|
| Token expirado / malformado (lógico) | 401 |  NO |
| Caída de conexión al clúster (operacional) | 500 |  SÍ, con Tag `affected_user_id` |

`src/instrument.js` es importado como primera línea de `index.js` antes de Express.

#### Captura Sentry — Error operacional 500 con Tag de usuario

<img width="1531" height="346" alt="image" src="https://github.com/user-attachments/assets/c00f230a-04d2-4908-91af-bcaa14c6b75b" />
<img width="1488" height="961" alt="image" src="https://github.com/user-attachments/assets/52872b80-82d7-4675-8d66-874529cffab9" />
<img width="1283" height="744" alt="image" src="https://github.com/user-attachments/assets/e1460c80-b8dd-4eef-a125-7c714f46723e" />
<img width="1283" height="979" alt="image" src="https://github.com/user-attachments/assets/716c0896-3846-4968-9bd0-0ad705091305" />
<img width="1343" height="915" alt="image" src="https://github.com/user-attachments/assets/bfce1532-9e65-44fc-ad8a-4446985c3bae" />


#### Captura Error Postman

<img width="1445" height="781" alt="image" src="https://github.com/user-attachments/assets/594ebb9e-8fa8-42cf-8328-aa74326619ba" />

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

