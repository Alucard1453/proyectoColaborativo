-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-06-2020 a las 21:39:19
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `workteams`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calificacionusuario`
--

CREATE TABLE `calificacionusuario` (
  `idCalificacion` int(11) NOT NULL,
  `idProyecto` int(11) NOT NULL,
  `idCalificador` int(11) NOT NULL,
  `idCalificado` int(11) NOT NULL,
  `calificacion` int(11) NOT NULL,
  `comentario` varchar(200) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentariosproyecto`
--

CREATE TABLE `comentariosproyecto` (
  `idComPro` int(11) NOT NULL,
  `idProyecto` int(11) NOT NULL,
  `fechaHora` varchar(22) COLLATE utf8_spanish_ci NOT NULL,
  `comentario` varchar(500) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentariosrelease`
--

CREATE TABLE `comentariosrelease` (
  `idComentario` int(11) NOT NULL,
  `idRelease` int(11) NOT NULL,
  `fechaHora` varchar(22) COLLATE utf8_spanish_ci NOT NULL,
  `comentario` varchar(500) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado`
--

CREATE TABLE `estado` (
  `idEstado` int(11) NOT NULL,
  `nomEstado` varchar(20) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `estado`
--

INSERT INTO `estado` (`idEstado`, `nomEstado`) VALUES
(1, 'Sin Asignar'),
(2, 'En Curso'),
(3, 'Finalizado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `participantes`
--

CREATE TABLE `participantes` (
  `idProyecto` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `rol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyecto`
--

CREATE TABLE `proyecto` (
  `idProyecto` int(11) NOT NULL,
  `propietario` int(11) NOT NULL,
  `nombre` varchar(30) COLLATE utf8_spanish_ci NOT NULL,
  `descripcion` varchar(512) COLLATE utf8_spanish_ci NOT NULL,
  `fechaInicio` varchar(12) COLLATE utf8_spanish_ci NOT NULL,
  `fechaFin` varchar(12) COLLATE utf8_spanish_ci NOT NULL,
  `numRelease` int(11) NOT NULL,
  `estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `proyecto`
--

INSERT INTO `proyecto` (`idProyecto`, `propietario`, `nombre`, `descripcion`, `fechaInicio`, `fechaFin`, `numRelease`, `estado`) VALUES
(1, 13, 'Proyecto Prueba', 'Proyecto para desarrollar', '09/06/2020', '12/12/2020', 10, 1),
(2, 13, 'Prueba dos', 'Proyecto para desarrollar con todo', '05/05/2020', '10/09/2020', 15, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `release`
--

CREATE TABLE `release` (
  `idRelease` int(11) NOT NULL,
  `idProyecto` int(11) NOT NULL,
  `fechaInicio` varchar(12) COLLATE utf8_spanish_ci NOT NULL,
  `fechaFin` varchar(12) COLLATE utf8_spanish_ci NOT NULL,
  `estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `idRol` int(11) NOT NULL,
  `nombreRol` varchar(12) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`idRol`, `nombreRol`) VALUES
(1, 'Lider'),
(2, 'Stakeholder'),
(3, 'Programador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarea`
--

CREATE TABLE `tarea` (
  `idTarea` int(11) NOT NULL,
  `idProyecto` int(11) NOT NULL,
  `nombreTarea` varchar(30) COLLATE utf8_spanish_ci NOT NULL,
  `numTarea` int(11) NOT NULL,
  `descripcion` varchar(300) COLLATE utf8_spanish_ci NOT NULL,
  `asignado` int(11) NOT NULL,
  `estado` int(11) NOT NULL,
  `puntos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tareasrelease`
--

CREATE TABLE `tareasrelease` (
  `idRelease` int(11) NOT NULL,
  `idTarea` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL,
  `nombre` varchar(25) COLLATE utf8_spanish_ci NOT NULL,
  `aPaterno` varchar(25) COLLATE utf8_spanish_ci NOT NULL,
  `aMaterno` varchar(25) COLLATE utf8_spanish_ci NOT NULL,
  `usuario` varchar(15) COLLATE utf8_spanish_ci NOT NULL,
  `contrasena` varchar(12) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idUsuario`, `nombre`, `aPaterno`, `aMaterno`, `usuario`, `contrasena`) VALUES
(13, 'Jorge Alberto', 'López', 'Aragón', 'jlopeza', '123456');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `calificacionusuario`
--
ALTER TABLE `calificacionusuario`
  ADD PRIMARY KEY (`idCalificacion`),
  ADD KEY `idProyecto` (`idProyecto`),
  ADD KEY `idCalificador` (`idCalificador`),
  ADD KEY `idCalificado` (`idCalificado`);

--
-- Indices de la tabla `comentariosproyecto`
--
ALTER TABLE `comentariosproyecto`
  ADD PRIMARY KEY (`idComPro`),
  ADD KEY `idProyecto` (`idProyecto`);

--
-- Indices de la tabla `comentariosrelease`
--
ALTER TABLE `comentariosrelease`
  ADD PRIMARY KEY (`idComentario`),
  ADD KEY `idRelease` (`idRelease`);

--
-- Indices de la tabla `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`idEstado`);

--
-- Indices de la tabla `participantes`
--
ALTER TABLE `participantes`
  ADD KEY `idProyecto` (`idProyecto`),
  ADD KEY `idUsuario` (`idUsuario`),
  ADD KEY `rol` (`rol`);

--
-- Indices de la tabla `proyecto`
--
ALTER TABLE `proyecto`
  ADD PRIMARY KEY (`idProyecto`),
  ADD KEY `propietario` (`propietario`),
  ADD KEY `estado` (`estado`);

--
-- Indices de la tabla `release`
--
ALTER TABLE `release`
  ADD PRIMARY KEY (`idRelease`),
  ADD KEY `idProyecto` (`idProyecto`),
  ADD KEY `estado` (`estado`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`idRol`);

--
-- Indices de la tabla `tarea`
--
ALTER TABLE `tarea`
  ADD PRIMARY KEY (`idTarea`),
  ADD KEY `idProyecto` (`idProyecto`),
  ADD KEY `asignado` (`asignado`),
  ADD KEY `estado` (`estado`);

--
-- Indices de la tabla `tareasrelease`
--
ALTER TABLE `tareasrelease`
  ADD KEY `idRelease` (`idRelease`),
  ADD KEY `idTarea` (`idTarea`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `calificacionusuario`
--
ALTER TABLE `calificacionusuario`
  MODIFY `idCalificacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comentariosproyecto`
--
ALTER TABLE `comentariosproyecto`
  MODIFY `idComPro` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comentariosrelease`
--
ALTER TABLE `comentariosrelease`
  MODIFY `idComentario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estado`
--
ALTER TABLE `estado`
  MODIFY `idEstado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `proyecto`
--
ALTER TABLE `proyecto`
  MODIFY `idProyecto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `release`
--
ALTER TABLE `release`
  MODIFY `idRelease` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `idRol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tarea`
--
ALTER TABLE `tarea`
  MODIFY `idTarea` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `calificacionusuario`
--
ALTER TABLE `calificacionusuario`
  ADD CONSTRAINT `calificacionusuario_ibfk_1` FOREIGN KEY (`idProyecto`) REFERENCES `proyecto` (`idProyecto`),
  ADD CONSTRAINT `calificacionusuario_ibfk_2` FOREIGN KEY (`idCalificador`) REFERENCES `usuario` (`idUsuario`),
  ADD CONSTRAINT `calificacionusuario_ibfk_3` FOREIGN KEY (`idCalificado`) REFERENCES `usuario` (`idUsuario`);

--
-- Filtros para la tabla `comentariosproyecto`
--
ALTER TABLE `comentariosproyecto`
  ADD CONSTRAINT `comentariosproyecto_ibfk_1` FOREIGN KEY (`idProyecto`) REFERENCES `proyecto` (`idProyecto`);

--
-- Filtros para la tabla `comentariosrelease`
--
ALTER TABLE `comentariosrelease`
  ADD CONSTRAINT `comentariosrelease_ibfk_1` FOREIGN KEY (`idRelease`) REFERENCES `release` (`idRelease`);

--
-- Filtros para la tabla `participantes`
--
ALTER TABLE `participantes`
  ADD CONSTRAINT `participantes_ibfk_1` FOREIGN KEY (`idProyecto`) REFERENCES `proyecto` (`idProyecto`),
  ADD CONSTRAINT `participantes_ibfk_2` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`),
  ADD CONSTRAINT `participantes_ibfk_3` FOREIGN KEY (`rol`) REFERENCES `rol` (`idRol`);

--
-- Filtros para la tabla `proyecto`
--
ALTER TABLE `proyecto`
  ADD CONSTRAINT `proyecto_ibfk_1` FOREIGN KEY (`propietario`) REFERENCES `usuario` (`idUsuario`),
  ADD CONSTRAINT `proyecto_ibfk_2` FOREIGN KEY (`estado`) REFERENCES `estado` (`idEstado`);

--
-- Filtros para la tabla `release`
--
ALTER TABLE `release`
  ADD CONSTRAINT `release_ibfk_1` FOREIGN KEY (`estado`) REFERENCES `estado` (`idEstado`),
  ADD CONSTRAINT `release_ibfk_2` FOREIGN KEY (`idProyecto`) REFERENCES `proyecto` (`idProyecto`);

--
-- Filtros para la tabla `tarea`
--
ALTER TABLE `tarea`
  ADD CONSTRAINT `tarea_ibfk_1` FOREIGN KEY (`idProyecto`) REFERENCES `proyecto` (`idProyecto`),
  ADD CONSTRAINT `tarea_ibfk_2` FOREIGN KEY (`asignado`) REFERENCES `usuario` (`idUsuario`),
  ADD CONSTRAINT `tarea_ibfk_3` FOREIGN KEY (`estado`) REFERENCES `estado` (`idEstado`);

--
-- Filtros para la tabla `tareasrelease`
--
ALTER TABLE `tareasrelease`
  ADD CONSTRAINT `tareasrelease_ibfk_1` FOREIGN KEY (`idRelease`) REFERENCES `release` (`idRelease`),
  ADD CONSTRAINT `tareasrelease_ibfk_2` FOREIGN KEY (`idTarea`) REFERENCES `tarea` (`idTarea`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
