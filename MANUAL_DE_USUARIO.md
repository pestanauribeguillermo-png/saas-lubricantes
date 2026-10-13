# 📖 Manual de Usuario — LUBRIX Pro
### Sistema Integral de Gestión (ERP, POS & CRM) para Lubricadoras y Centros de Servicio Automotriz

Bienvenido a **LUBRIX Pro**. Esta guía interactiva explica paso a paso cómo sacar el máximo provecho de cada módulo del sistema: desde la venta rápida en mostrador hasta el control milimétrico de inventario de tambores y la fidelización de clientes por WhatsApp.

---

## 📑 Tabla de Contenidos
1. [Acceso al Sistema y Roles de Usuario](#1-acceso-al-sistema-y-roles-de-usuario)
2. [Página Comercial (Landing Page)](#2-página-comercial-landing-page)
3. [Módulo POS (Punto de Venta y Facturación)](#3-módulo-pos-punto-de-venta-y-facturación)
4. [Buscador Técnico de Aceites y Filtros por Vehículo](#4-buscador-técnico-de-aceites-y-filtros-por-vehículo)
5. [Control de Inventario y Equivalencias de Volumen](#5-control-de-inventario-y-equivalencias-de-volumen)
6. [CRM Posventa y Recordatorios por WhatsApp](#6-crm-posventa-y-recordatorios-por-whatsapp)
7. [Reportes Financieros y Liquidación de Comisiones](#7-reportes-financieros-y-liquidación-de-comisiones)
8. [Preguntas Frecuentes y Buenas Prácticas](#8-preguntas-frecuentes-y-buenas-prácticas)

---

## 1. Acceso al Sistema y Roles de Usuario

LUBRIX Pro cuenta con autenticación en la nube protegida mediante **Supabase Auth** y soporte para gestión Multi-Tenant (organizaciones).

### Cómo Ingresar:
1. Al abrir la aplicación en tu navegador ([http://localhost:5173](http://localhost:5173)), haz clic en **"Iniciar Sesión"** o **"Ver Demo en Vivo"**.
2. En la ventana modal de acceso tienes dos alternativas:
   - **Acceso Rápido Demo (1-Click):** Permite alternar de inmediato entre los 3 roles del negocio sin necesidad de escribir contraseñas.
   - **Ingreso con Credenciales / Registro de Negocio:** Permite registrar tu lubricadora con RUC/NIT, correo y clave de administrador.

### Roles Disponibles:
- 👑 **Administrador (Dueño / Gerente):** Acceso total a reportes financieros, configuración de stock, precios y liquidación de comisiones.
- 🔧 **Mecánico (Operario de Fosa / Bahía):** Visualización de órdenes de trabajo, comisiones asignadas por servicio e histórico técnico.
- 💳 **Cajera (Facturación y Mostrador):** Emisión rápida de tickets, cobro en efectivo/tarjeta/transferencia y registro de clientes.

---

## 2. Página Comercial (Landing Page)

La página inicial está diseñada para presentar y comercializar la solución a clientes o sucursales:

- **Hero Section:** Resumen de valor del software con accesos directos al panel.
- **Calculadora de Margen de Tambor (208L):** Un simulador interactivo donde puedes mover el costo de adquisición de un tambor de aceite y el precio de venta por cuarto (1 Qt) para calcular en vivo el beneficio neto y el margen de rentabilidad obtenido al fraccionar tambores.
- **Cuadrícula de Funcionalidades:** Explicación de los 6 pilares operativos del taller.
- **Tabla de Precios:** Comparativa entre planes Básico, Pro y Multi-sucursal con descuento para facturación anual.

---

## 3. Módulo POS (Punto de Venta y Facturación)

El módulo POS está optimizado para pantallas táctiles, tablets y lectura de códigos de barras.

### Pasos para Registrar una Venta:
1. **Buscar el Producto:**
   - Escribe en la barra de búsqueda el nombre comercial (ej. *Mobil 1*), la viscosidad (*5W-30*) o el código de filtro (*W712/75*).
   - O filtra por categoría en los botones superiores (*Aceite de Motor, Filtros, Refrigerante, Mano de Obra*).
2. **Seleccionar la Presentación:**
   - Si seleccionas un aceite de motor que se vende en diferentes formatos, se abrirá una ventana para elegir la presentación:
     - *Litro suelto (a granel)*
     - *Cuarto (0.946 L / 1 Qt)*
     - *Galón (3.785 L / 1 Gal)*
     - *Tambor completo (208 L)*
   - El precio y el factor de litros se ajustarán automáticamente en el carrito.
3. **Asignar Cliente y Vehículo (Opcional):**
   - En el panel derecho puedes seleccionar un cliente existente o dejar en *"Consumidor Final"*.
   - Al seleccionar un vehículo registrado, puedes ingresar el **kilometraje actual** (ej. `52,400 km`). Esto alimentará automáticamente el CRM para el próximo cambio de aceite.
4. **Asignar el Mecánico:**
   - Elige el mecánico responsable del servicio en el desplegable.
   - El sistema calculará en tiempo real la comisión ganada de acuerdo a su tasa configurada (ej. 10%).
5. **Seleccionar Método de Pago:**
   - Haz clic en *Efectivo, Tarjeta, Transferencia o Crédito*.
6. **Cobrar y Emitir Comprobante:**
   - Haz clic en **"Cobrar $XX.XX"**.
   - El sistema ejecutará el trigger de PostgreSQL en Supabase, descontando el volumen vendido del inventario.
   - Aparecerá el **Ticket Térmico Digital**, con botones para **"Imprimir Ticket"** o **"Enviar por WhatsApp"** directamente al cliente.

---

## 4. Buscador Técnico de Aceites y Filtros por Vehículo

Evita errores costosos en la viscosidad o tipo de filtro con el catálogo técnico integrado.

### Cómo Consultar un Auto:
1. Dirígete a la pestaña **"Buscador Aceites"** en la barra de navegación.
2. Utiliza los tres selectores en cascada:
   - **Paso 1: Marca** (ej. *Toyota, Chevrolet, Hyundai, Nissan, Ford, Volkswagen*).
   - **Paso 2: Modelo** (ej. *Hilux, Corolla, Aveo, Tucson, D-Max*).
   - **Paso 3: Motor y Años** (ej. *2.8 Turbo Diesel 2016-2024*).
3. **Ficha Técnica Resultante:**
   - **Viscosidad recomendada:** (ej. `5W-30 Low SAPS Full Sintético`).
   - **Capacidad de cárter:** Volumen exacto en Litros (ej. `7.5 L`) y su equivalencia en cuartos.
   - **Códigos de Filtros OEM y Aftermarket:** Filtro de aceite (ej. `90915-YZZD4 / W712/83`), filtro de aire motor y cabina.
   - **Notas del Fabricante:** Especificaciones de norma (ej. *API SP, Dexos 1 Gen 3, ACEA C3 para DPF*).
4. **Cargar Directo al POS:**
   - Haz clic en el botón naranja **"Cargar en el POS"** para enviar la ficha técnica al módulo de facturación y preseleccionar los productos compatibles.

---

## 5. Control de Inventario y Equivalencias de Volumen

Este módulo resuelve el problema tradicional de las lubricadoras: **comprar en tambores grandes y vender en unidades fraccionadas**.

### Indicadores Clave (KPIs):
- **Aceite en Stock Base:** Total de litros almacenados y su conversión inmediata en tambores completos de 208L.
- **Alertas de Stock Crítico:** Cantidad de productos cuyo volumen está por debajo del mínimo de seguridad.
- **Valoración de Bodega:** Valor monetario total del inventario a costo de compra.

### Operaciones:
- **Equivalencias Visuales:** En cada fila de producto puedes observar cuántos tambores, galones y cuartos tienes disponibles sin necesidad de hacer cálculos manuales.
- **Ajuste Rápido de Stock:** Haz clic en el icono del lápiz (✏️) junto a cualquier producto para corregir el inventario físico tras un arqueo de bodega.
- **Crear Nuevo Producto:** Presiona **"+ Nuevo Producto"** para dar de alta aceites, filtros o mano de obra, estableciendo el costo, precio de venta y alertas de stock. Al ingresar un aceite de motor, el sistema crea en automático las presentaciones fraccionadas asociadas.

---

## 6. CRM Posventa y Recordatorios por WhatsApp

El CRM fideliza a los conductores proyectando cuándo necesitarán su próximo servicio preventivo (por kilometraje o por fecha).

### Estados de Mantenimiento:
- 🟢 **Al Día:** El vehículo aún cuenta con kilometraje y tiempo disponible antes de la próxima visita.
- 🔴 **Vencido / Requiere Cambio:** Han transcurrido más de 5,000 km o 6 meses desde su último cambio de aceite registrado.

### Envío de Recordatorio por WhatsApp con 1 Clic:
1. Dirígete a la pestaña **"CRM WhatsApp"**.
2. Filtra por la pestaña **"Vencidos / Requiere Cambio"**.
3. Haz clic en el botón verde **"Enviar WhatsApp"** en la fila del cliente.
4. Se abrirá WhatsApp Web o la aplicación móvil de WhatsApp con un mensaje pre-redactado profesional:
   > *"Hola [Nombre Cliente]! 🏁 Te saludamos de LubriExpress Pro... Te recordamos que tu [Vehículo] con placa [Placa] cumplió su ciclo preventivo de cambio de aceite y filtro (registrado a los XX,XXX km). ¿Deseas agendar tu turno para hoy o mañana?..."*
5. El sistema marcará la casilla de *"WhatsApp enviado"* para evitar duplicar mensajes al mismo cliente.
6. **Registrar Nuevos Clientes:** Usa el botón **"+ Registrar Nuevo Cliente"** para añadir vehículos y sus kilometrajes iniciales.

---

## 7. Reportes Financieros y Liquidación de Comisiones

El módulo de reportes consolida la operación diaria en tiempo real:

- **Facturación Total ($):** Suma acumulada de ventas brutas e IVA.
- **Comisiones de Mecánicos:** Monto total devengado por el equipo técnico pendiente de liquidación.
- **Ticket Promedio:** Valor promedio de consumo por cliente atendido.
- **Tabla de Comisiones por Mecánico:**
  - Nombre del colaborador y rol.
  - Porcentaje de comisión asignado (ej. 10%, 7.5%, 2%).
  - Número de servicios atendidos.
  - Total facturado y monto exacto de comisión ganada a pagar.
- **Desglose por Forma de Pago:** Monitoreo separado de ingresos en *Efectivo, Tarjetas (POS) y Transferencias*.
- **Historial de Facturas:** Listado auditable de todos los tickets generados.

---

## 8. Preguntas Frecuentes y Buenas Prácticas

### ¿Qué pasa con el inventario si vendo medio cuarto o litros fraccionados?
Gracias a la columna `factor_liters` en la base de datos de Supabase, cada venta descuenta exactamente los litros correspondientes del stock global del tambor. Si vendes un cuarto (`0.946 L`), el sistema descuenta `0.946 L`, garantizando exactitud contable.

### ¿Puedo utilizar el sistema en un teléfono móvil en la fosa del taller?
Sí. El sistema cuenta con diseño **Mobile-First**. Al abrir la aplicación en un teléfono celular o tablet, se activa una barra de navegación inferior adaptada a la zona del pulgar (*Thumb-Zone*) para agilizar la interacción con una sola mano.

### ¿Cómo respaldo la información?
Toda la información se sincroniza en tiempo real en la nube de **Supabase (PostgreSQL)** con copias de seguridad automáticas y alta disponibilidad.
