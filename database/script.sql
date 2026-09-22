USE DEPRECIACION_BD;
GO

-- =========================================
-- TABLA USUARIOS
-- =========================================

CREATE TABLE USUARIOS (
    ID_USU INT IDENTITY(1,1) PRIMARY KEY,
    NOMBRE NVARCHAR(100) NOT NULL,
    APELLIDO NVARCHAR(100) NOT NULL,
    CORREO NVARCHAR(150) NOT NULL UNIQUE,
    NOMBRE_USUARIO NVARCHAR(50) NOT NULL UNIQUE,
    PASSWORD_HASH NVARCHAR(255) NOT NULL,
    ESTADO NVARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    FECHA_REGISTRO DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT CK_USUARIOS_ESTADO
        CHECK (ESTADO IN ('ACTIVO', 'INACTIVO'))
);
GO


-- =========================================
-- TABLA VERIFICACIONES
-- =========================================

CREATE TABLE VERIFICACIONES (
    ID_VER INT IDENTITY(1,1) PRIMARY KEY,
    ID_USU INT NOT NULL,
    CODIGO NVARCHAR(6) NOT NULL,
    EXPIRA DATETIME2 NOT NULL,
    USADO BIT NOT NULL DEFAULT 0,
    FECHA_CREACION DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT FK_VERIF_USUARIOS
        FOREIGN KEY (ID_USU)
        REFERENCES USUARIOS(ID_USU)
);
GO


-- =========================================
-- TABLA CATEGORIAS
-- =========================================

CREATE TABLE CATEGORIAS (
    ID_CAT INT IDENTITY(1,1) PRIMARY KEY,
    NOM_CAT NVARCHAR(100) NOT NULL,
    VID_UTI_ANIOS INT NOT NULL,
    POR_VAL_RES DECIMAL(5,2) NOT NULL,

    CONSTRAINT CK_CAT_VID
        CHECK (VID_UTI_ANIOS > 0),

    CONSTRAINT CK_CAT_RES
        CHECK (POR_VAL_RES >= 0 AND POR_VAL_RES <= 100)
);
GO


-- =========================================
-- DATOS DE CATEGORIAS
-- =========================================

INSERT INTO CATEGORIAS
    (NOM_CAT, VID_UTI_ANIOS, POR_VAL_RES)
VALUES
    ('Edificios e inmuebles', 20, 10),
    ('Tecnologías', 3, 10),
    ('Vehículos', 5, 10);
GO


-- =========================================
-- TABLA TIPOS_ACTIVOS
-- =========================================

CREATE TABLE TIPOS_ACTIVOS (
    ID_TIPO INT IDENTITY(1,1) PRIMARY KEY,
    NOM_TIPO NVARCHAR(100) NOT NULL,
    ID_CAT_PER INT NOT NULL,

    CONSTRAINT FK_TIPOS_CATEGORIAS
        FOREIGN KEY (ID_CAT_PER)
        REFERENCES CATEGORIAS(ID_CAT)
);
GO


-- =========================================
-- DATOS DE TIPOS DE ACTIVOS
-- =========================================

INSERT INTO TIPOS_ACTIVOS
    (NOM_TIPO, ID_CAT_PER)
VALUES
    -- Tecnologías
    ('Computadora', 2),
    ('Laptop', 2),
    ('Impresora', 2),
    ('Monitor', 2),
    ('Servidor', 2),
    ('Proyector', 2),

    -- Vehículos
    ('Moto', 3),
    ('Camioneta', 3),
    ('Automóvil', 3),

    -- Edificios e inmuebles
    ('Edificio', 1),
    ('Oficina', 1),
    ('Bodega', 1);
GO


-- =========================================
-- TABLA ACTIVOS
-- =========================================

CREATE TABLE ACTIVOS (
    ID_ACT INT IDENTITY(1,1) PRIMARY KEY,
    DES_ACT NVARCHAR(200) NOT NULL,
    ID_TIP_PER INT NOT NULL,
    FECHA_COMPRA DATE NOT NULL,
    VALOR_COMPRA DECIMAL(12,2) NOT NULL,
    ID_USU_PER INT NOT NULL,

    CONSTRAINT FK_ACTIVOS_TIPOS
        FOREIGN KEY (ID_TIP_PER)
        REFERENCES TIPOS_ACTIVOS(ID_TIPO),

    CONSTRAINT FK_ACTIVOS_USUARIOS
        FOREIGN KEY (ID_USU_PER)
        REFERENCES USUARIOS(ID_USU),

    CONSTRAINT CK_ACTIVOS_VALOR
        CHECK (VALOR_COMPRA > 0)
);
GO


-- =========================================
-- TABLA DETALLE_DEPRECIACION
-- =========================================

CREATE TABLE DETALLE_DEPRECIACION (
    ID_ACT_PER INT NOT NULL,
    PER_DEP INT NOT NULL,
    FEC_COR DATE NOT NULL,
    MES_DEP INT NOT NULL,
    VAL_INI DECIMAL(12,2) NOT NULL,
    DEP_PER DECIMAL(12,2) NOT NULL,
    DEP_ACU DECIMAL(12,2) NOT NULL,
    VAL_ACT DECIMAL(12,2) NOT NULL,

    CONSTRAINT PK_DETALLE_DEPRECIACION
        PRIMARY KEY (ID_ACT_PER, PER_DEP),

    CONSTRAINT FK_DETALLE_ACTIVOS
        FOREIGN KEY (ID_ACT_PER)
        REFERENCES ACTIVOS(ID_ACT),

    CONSTRAINT CK_DETALLE_PERIODO
        CHECK (PER_DEP > 0),

    CONSTRAINT CK_DETALLE_MESES
        CHECK (MES_DEP >= 0),

    CONSTRAINT CK_DETALLE_VALORES
        CHECK (
            VAL_INI >= 0 AND
            DEP_PER >= 0 AND
            DEP_ACU >= 0 AND
            VAL_ACT >= 0
        )
);
GO