# DeUna Nearby - Backend

## Rol
Persona 1: Backend, Supabase, IA y APIs.

## Tecnologías
- Next.js
- TypeScript
- Supabase
- PostgreSQL

## IA implementada
Se implementó un motor de recomendación contextual que analiza:

- Historial de transacciones
- Categoría favorita del usuario
- Promociones activas
- Proximidad geográfica
- Contexto básico

El score final prioriza comercios con mayor afinidad, mejor beneficio y menor distancia.

## Proximidad
Se implementó cálculo de distancia mediante coordenadas `latitude` y `longitude`.

En producción, la app móvil enviaría la ubicación GPS del usuario y el backend calcularía los comercios cercanos.

## APIs disponibles

### GET /api/recommendations
Devuelve recomendaciones personalizadas.

### GET /api/nearby-moment
Devuelve una notificación inteligente.

### GET /api/promotions
Devuelve promociones activas.

### GET /api/user-history
Devuelve historial de compras.

### GET /api/nearby-summary
Devuelve resumen para dashboard/pitch.

### GET /api/nearby-businesses
Devuelve negocios cercanos ordenados por distancia.

## Tablas Supabase
- businesses
- promotions
- transactions

## Entrega final
Backend listo para que frontend consuma las APIs.