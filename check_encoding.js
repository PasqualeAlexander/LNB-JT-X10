const fs = require('fs');

console.log('Checking encoding and invisible characters...');

try {
    const buffer = fs.readFileSync('./BOTLNBCODE.js');
    const code = buffer.toString('utf8');
    const lines = code.split('\n');
    
    // Check first 50 lines for non-printable characters
    console.log('First 50 lines character analysis:');
    for (let i = 0; i < Math.min(50, lines.length); i++) {
        const line = lines[i];
        const hasNonAscii = /[^\x20-\x7E\r\n\t]/.test(line);
        
        if (hasNonAscii) {
            console.log(`Line ${i + 1} has non-ASCII characters:`);
            console.log(`  Content: "${line}"`);
            console.log(`  Hex: ${Buffer.from(line).toString('hex')}`);
            
            // Show character codes
            const chars = [];
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                const code = line.charCodeAt(j);
                if (code < 32 || code > 126) {
                    chars.push(`[${j}]=${char}(${code})`);
                }
            }
            if (chars.length > 0) {
                console.log(`  Non-printable chars: ${chars.join(', ')}`);
            }
        }
    }
    
    // Try to identify the actual syntax error location more precisely
    console.log('\nTrying to find exact syntax error...');
    
    // Test each line incrementally
    let cumulativeCode = '';
    for (let i = 0; i < lines.length; i++) {
        cumulativeCode += lines[i] + '\n';
        
        try {
            new Function(cumulativeCode);
        } catch (error) {
            console.log(`❌ Syntax error after line ${i + 1}`);
            console.log(`Error: ${error.message}`);
            console.log(`Line ${i + 1}: "${lines[i]}"`);
            console.log(`Hex of line: ${Buffer.from(lines[i]).toString('hex')}`);
            break;
        }
    }
    
} catch (error) {
    console.error('Error:', error.message);
}
