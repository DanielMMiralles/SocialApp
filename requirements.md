# CrossLine - Red Social

## 📋 Requisitos Funcionales

### 1. 👤 Usuarios y Autenticación

#### Registro de Usuario
- **Formulario de registro** con campos:
  - Email (validación de formato)
  - Nombre de usuario (único)
  - Contraseña (validación de seguridad)
- **Validaciones**:
  - Formato de email válido
  - Contraseña segura (mínimo 8 caracteres, mayúsculas, números)
  - Verificación de usuario único

#### Inicio de Sesión
- **Autenticación** con email/contraseña
- **Opción "Recuérdame"** para sesiones persistentes
- **Manejo de errores** de credenciales incorrectas

#### Gestión de Perfil
- **Editar foto de perfil** (subida y recorte de imagen)
- **Actualizar biografía/descripción** (máximo 160 caracteres)
- **Cambiar contraseña** con validación de contraseña actual
- **Cerrar sesión**

---

### 2. 📝 Publicaciones (Funcionalidad Principal)

#### Creación de Publicaciones
- **Editor de texto** con límite de 500 caracteres
- **Soporte para imágenes** (1 imagen por publicación)
- **Vista previa** antes de publicar
- **Botón de publicación** con confirmación

#### Visualización del Feed
- **Feed cronológico inverso** (publicaciones más recientes primero)
- **Información mostrada**:
  - Avatar del usuario
  - Nombre de usuario
  - Timestamp (tiempo transcurrido)
  - Contenido de texto
  - Imagen (si existe)

#### Interacciones
- **Sistema de Likes** ❤️
  - Contador visible de likes
  - Toggle like/unlike
- **Sistema de Comentarios**
  - Botón para ver/ocultar comentarios
  - Contador de comentarios
- **Eliminación de publicaciones**
  - Solo disponible para el autor
  - Confirmación antes de eliminar

---

### 3. 💬 Sistema de Comentarios

#### Añadir Comentarios
- **Campo de texto** bajo cada publicación
- **Límite de 200 caracteres**
- **Botón de envío** con validación

#### Visualización
- **Lista expandible** bajo cada publicación
- **Información mostrada**:
  - Avatar del comentarista
  - Nombre de usuario
  - Contenido del comentario
  - Timestamp

#### Gestión
- **Eliminación de comentarios**:
  - Autor del comentario puede eliminar
  - Dueño de la publicación puede eliminar cualquier comentario

---

### 4. 👥 Relaciones Sociales

#### Sistema de Seguimiento
- **Botón "Seguir/Dejar de seguir"** en perfiles de usuario
- **Contadores visibles**:
  - Número de seguidores
  - Número de usuarios seguidos
- **Estados de seguimiento** claramente indicados

#### Feed Personalizado
- **Filtro de contenido**: mostrar solo publicaciones de usuarios seguidos
- **Opción de alternar** entre feed completo y personalizado

---

### 5. 🔍 Perfiles de Usuario

#### Página Pública de Perfil
- **Información visual**:
  - Foto de perfil
  - Imagen de portada (opcional)
  - Biografía/descripción
- **Estadísticas**:
  - Número de publicaciones
  - Número de seguidores
  - Número de seguidos
- **Lista de publicaciones propias** (cronológica inversa)

#### Funcionalidad de Búsqueda
- **Barra de búsqueda** para encontrar usuarios
- **Búsqueda por nombre de usuario**
- **Resultados con vista previa** del perfil

---

### 6. 🔔 Sistema de Notificaciones

#### Tipos de Notificaciones
- **Nuevos seguidores**
- **Likes en publicaciones propias**
- **Comentarios en publicaciones propias**

#### Interfaz
- **Icono de campana** en la navegación
- **Contador de notificaciones** no leídas
- **Lista de notificaciones** con timestamps
- **Marcar como leídas**

---

## 🛠️ Stack Tecnológico

- **Frontend**: React.js con JavaScript
- **Build Tool**: SWC (Speedy Web Compiler)
- **Estilos**: Tailwind CSS
- **Linting**: ESLint
- **Gestión de Estado**: Context API / Redux (por definir)
- **Routing**: React Router
- **Backend**: Por definir (Node.js/Express recomendado)
- **Base de Datos**: Por definir (MongoDB/PostgreSQL)

---

## 📱 Consideraciones de UX/UI

- **Diseño responsive** para móviles y desktop
- **Tema claro/oscuro** (opcional)
- **Carga lazy** de imágenes
- **Estados de carga** y feedback visual
- **Manejo de errores** user-friendly
- **Accesibilidad** (ARIA labels, contraste de colores)

---

## 🚀 Fases de Desarrollo Sugeridas

### Fase 1: Fundación
- Configuración del proyecto (React + SWC + Tailwind)
- Sistema de autenticación básico
- Estructura de componentes base

### Fase 2: Core Features
- Sistema de publicaciones
- Feed básico
- Perfiles de usuario

### Fase 3: Interacciones
- Sistema de likes
- Sistema de comentarios
- Seguimiento de usuarios

### Fase 4: Características Avanzadas
- Notificaciones
- Búsqueda de usuarios
- Optimizaciones de rendimiento