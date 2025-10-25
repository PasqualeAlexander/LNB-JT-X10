SELECT
  COUNT(*) AS total,
  SUM(CASE WHEN auth_id IS NOT NULL AND auth_id <> '' THEN 1 ELSE 0 END) AS con_auth,
  SUM(CASE WHEN auth_id IS NULL OR auth_id = '' THEN 1 ELSE 0 END) AS sin_auth
FROM jugadores;

SELECT id, nombre, nombre_display, auth_id, updated_at
FROM jugadores
WHERE (auth_id IS NULL OR auth_id = '')
ORDER BY id DESC
LIMIT 10;

SELECT id, nombre, nombre_display, auth_id, updated_at
FROM jugadores
WHERE (auth_id IS NOT NULL AND auth_id <> '')
ORDER BY updated_at DESC
LIMIT 10;
