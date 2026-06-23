const lucide = require('lucide-react');
console.log('Keys count:', Object.keys(lucide).length);
console.log('Git keys:', Object.keys(lucide).filter(k => k.toLowerCase().includes('git')));
console.log('Link keys:', Object.keys(lucide).filter(k => k.toLowerCase().includes('link')));
console.log('Linkedin keys:', Object.keys(lucide).filter(k => k.toLowerCase().includes('linkedin')));
console.log('Github keys:', Object.keys(lucide).filter(k => k.toLowerCase().includes('github')));
