try { 
    const rolesModule = require('./roles_persistent_system.js'); 
    console.log('Module loaded:', Object.keys(rolesModule)); 
} catch(e) { 
    console.error('Error:', e.message); 
}
