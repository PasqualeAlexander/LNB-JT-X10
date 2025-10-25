#!/bin/bash
sed -i '9347s|rolesPersistentSystem.updateLastSeen(authID, jugador.name);|nodeUpdateLastSeen(authID, jugador.name).catch(e => console.error(" ❌ Error en nodeUpdateLastSeen:\, e));|' BOTLNBCODE.js
