// Migración: vip_memberships por auth_id (y preparación de jugadores.auth_id)
// Ejecutar con: node remote/database/migrate_vip_auth_id.js

(async () => {
  const { executeQuery } = require('../../config/database');

  const q = async (sql, label = null) => {
    try {
      await executeQuery(sql);
      console.log('OK:', label || sql);
    } catch (e) {
      console.log('INFO:', (label || sql), '-', e.message);
    }
  };

  try {
    console.log('— Preparando jugadores.auth_id —');
    await q("ALTER TABLE jugadores ADD COLUMN auth_id VARCHAR(255) NULL", 'ALTER jugadores ADD auth_id');
    await q("UPDATE jugadores SET auth_id = COALESCE(auth_id, uid)", 'Backfill jugadores.auth_id desde uid');
    await q("CREATE UNIQUE INDEX uq_jugadores_auth_id ON jugadores(auth_id)", 'UNIQUE INDEX jugadores(auth_id)');

    console.log('— Ajustando vip_memberships a auth_id —');
    await q("ALTER TABLE vip_memberships ADD COLUMN auth_id VARCHAR(255) NULL AFTER player_name", 'ALTER vip_memberships ADD auth_id');

    // Eliminar cualquier FK existente a jugadores(nombre)
    const rows = await executeQuery(
      "SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE " +
      "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME='vip_memberships' AND REFERENCED_TABLE_NAME='jugadores'"
    );
    if (Array.isArray(rows)) {
      for (const r of rows) {
        const cname = r.CONSTRAINT_NAME;
        try {
          await executeQuery(`ALTER TABLE vip_memberships DROP FOREIGN KEY ${cname}`);
          console.log('OK: DROP FK', cname);
        } catch (e) {
          console.log('INFO: DROP FK', cname, '-', e.message);
        }
      }
    }

    // Indices
    await q("DROP INDEX idx_player_active ON vip_memberships", 'DROP INDEX vip_memberships.idx_player_active');
    await q("CREATE INDEX idx_vip_auth_active ON vip_memberships(auth_id, is_active)", 'CREATE INDEX vip_memberships(auth_id,is_active)');

    // FK por auth_id
    await q(
      "ALTER TABLE vip_memberships " +
      "ADD CONSTRAINT fk_vip_auth FOREIGN KEY (auth_id) REFERENCES jugadores(auth_id) ON DELETE CASCADE",
      'ADD FK vip_memberships(auth_id) -> jugadores(auth_id)'
    );

    // NOT NULL para auth_id (no hay membresías actuales)
    await q("ALTER TABLE vip_memberships MODIFY auth_id VARCHAR(255) NOT NULL", 'MODIFY vip_memberships.auth_id NOT NULL');

    console.log('✓ Migración completada');
    process.exit(0);
  } catch (e) {
    console.error('✗ MIGRATION ERROR:', e);
    process.exit(1);
  }
})();