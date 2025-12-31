// Script to generate PWA icons
// Run with: node scripts/generate-icons.js
// Requires: npm install sharp

const fs = require('fs');
const path = require('path');

// Create a simple SVG icon (Solo Leveling themed)
const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a1a"/>
      <stop offset="100%" style="stop-color:#1a1a3a"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed"/>
      <stop offset="100%" style="stop-color:#9333ea"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="512" height="512" rx="80" fill="url(#bg)"/>
  <!-- Outer ring -->
  <circle cx="256" cy="256" r="180" fill="none" stroke="url(#glow)" stroke-width="12" opacity="0.6"/>
  <!-- Inner design - stylized "S" for Solo/Shadow -->
  <path d="M320 160 C320 160, 280 160, 256 180 C220 208, 200 240, 200 280 C200 320, 230 352, 280 352 C310 352, 340 340, 340 340" 
        fill="none" stroke="#ffd700" stroke-width="24" stroke-linecap="round"/>
  <path d="M192 352 C192 352, 232 352, 256 332 C292 304, 312 272, 312 232 C312 192, 282 160, 232 160 C202 160, 172 172, 172 172" 
        fill="none" stroke="#ffd700" stroke-width="24" stroke-linecap="round"/>
  <!-- Level indicator dots -->
  <circle cx="256" cy="420" r="12" fill="#7c3aed"/>
  <circle cx="296" cy="410" r="8" fill="#7c3aed" opacity="0.7"/>
  <circle cx="216" cy="410" r="8" fill="#7c3aed" opacity="0.7"/>
</svg>
`;

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Save the SVG as a base icon
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon.trim());

console.log('SVG icon created at public/icons/icon.svg');
console.log('');
console.log('To generate PNG icons, you can:');
console.log('1. Use an online tool like https://realfavicongenerator.net/');
console.log('2. Or install sharp and run this updated script:');
console.log('   npm install sharp');
console.log('');
console.log('For now, creating placeholder PNG files...');

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create simple placeholder message
const placeholderNote = `
PNG icons need to be generated from the SVG.

You can use online tools like:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

Upload public/icons/icon.svg and download the generated icons.
`;

fs.writeFileSync(path.join(iconsDir, 'README.md'), placeholderNote.trim());

// Try to use sharp if available
try {
  const sharp = require('sharp');
  
  const svgBuffer = Buffer.from(svgIcon);
  
  Promise.all(
    sizes.map(size => 
      sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(iconsDir, `icon-${size}x${size}.png`))
        .then(() => console.log(`Created icon-${size}x${size}.png`))
    )
  ).then(() => {
    console.log('All PNG icons generated successfully!');
  }).catch(err => {
    console.error('Error generating PNGs:', err.message);
  });
} catch (e) {
  console.log('Sharp not installed. Creating simple colored PNG placeholders...');
  
  // Create very simple PNG files (1x1 pixel purple, will need replacement)
  // This is just so the manifest doesn't error - real icons should be generated
  sizes.forEach(size => {
    const filename = path.join(iconsDir, `icon-${size}x${size}.png`);
    if (!fs.existsSync(filename)) {
      // Create a minimal valid PNG (purple pixel)
      const pngHeader = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
        0x00, 0x00, 0x00, 0x0D, // IHDR length
        0x49, 0x48, 0x44, 0x52, // IHDR
        0x00, 0x00, 0x00, 0x01, // width: 1
        0x00, 0x00, 0x00, 0x01, // height: 1
        0x08, 0x02, // 8-bit RGB
        0x00, 0x00, 0x00, // compression, filter, interlace
        0x90, 0x77, 0x53, 0xDE, // CRC
        0x00, 0x00, 0x00, 0x0C, // IDAT length
        0x49, 0x44, 0x41, 0x54, // IDAT
        0x08, 0xD7, 0x63, 0x60, 0x60, 0x60, 0x00, 0x00, 0x00, 0x04, 0x00, 0x01, // compressed data
        0x27, 0x34, 0x0A, 0x3A, // CRC
        0x00, 0x00, 0x00, 0x00, // IEND length
        0x49, 0x45, 0x4E, 0x44, // IEND
        0xAE, 0x42, 0x60, 0x82  // CRC
      ]);
      fs.writeFileSync(filename, pngHeader);
    }
  });
  
  console.log('Placeholder PNGs created. For proper icons:');
  console.log('1. Run: npm install sharp');
  console.log('2. Run: node scripts/generate-icons.js');
  console.log('Or use an online PNG generator with the SVG file.');
}
