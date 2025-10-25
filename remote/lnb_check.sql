SELECT id, auth_id, nombre, nombre_display, partidos, victorias, derrotas, goles, asistencias, mvps, nivel, xp, fechaPrimerPartido, fechaUltimoPartido, updated_at
FROM jugadores
WHERE auth_id IN ('9M4tWPS5APaUyvxOc7ebVHm4lNYE-R7cLWQoiQifvDs','UrDYjYsl2EJMa7cqVPS0IpRXpR9s7FA9TCXCZsRala0');

SELECT id, auth_id, nombre, nombre_display
FROM jugadores
WHERE nombre LIKE 'RИ ИФT THΞ ɮФʏ%'
ORDER BY id DESC
LIMIT 10;
