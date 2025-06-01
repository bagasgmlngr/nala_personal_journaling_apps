// scripts/generate-icons.js
// Simple HTML to generate PWA icons
// Save this as an HTML file and open in browser, then run in console

const generateIconHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>NALA Icon Generator</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .icon-preview { margin: 10px; text-align: center; }
        canvas { border: 1px solid #ccc; margin: 5px; }
        .download-btn { background: #4f46e5; color: white; padding: 5px 10px; margin: 5px; border: none; border-radius: 3px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>NALA PWA Icon Generator</h1>
    <p>This will generate all required PWA icons for NALA app</p>
    
    <div id="icons-container"></div>
    
    <script>
        // NALA App Icon Design
        function drawNALAIcon(canvas, size) {
            const ctx = canvas.getContext('2d');
            const centerX = size / 2;
            const centerY = size / 2;
            
            // Background
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, '#4f46e5');
            gradient.addColorStop(1, '#7c3aed');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);
            
            // Book Icon (similar to lucide BookOpen)
            ctx.strokeStyle = 'white';
            ctx.fillStyle = 'white';
            ctx.lineWidth = size * 0.02;
            
            const bookWidth = size * 0.5;
            const bookHeight = size * 0.4;
            const bookX = centerX - bookWidth / 2;
            const bookY = centerY - bookHeight / 2;
            
            // Book pages
            ctx.fillRect(bookX, bookY, bookWidth, bookHeight);
            
            // Binding
            ctx.strokeStyle = '#e0e7ff';
            ctx.lineWidth = size * 0.015;
            ctx.beginPath();
            ctx.moveTo(centerX, bookY);
            ctx.lineTo(centerX, bookY + bookHeight);
            ctx.stroke();
            
            // Pages lines
            ctx.strokeStyle = '#c7d2fe';
            ctx.lineWidth = size * 0.008;
            for (let i = 1; i <= 3; i++) {
                const y = bookY + (bookHeight * i / 4);
                ctx.beginPath();
                ctx.moveTo(bookX + size * 0.05, y);
                ctx.lineTo(bookX + bookWidth - size * 0.05, y);
                ctx.stroke();
            }
        }
        
        // Icon sizes for PWA
        const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
        const container = document.getElementById('icons-container');
        
        iconSizes.forEach(size => {
            const div = document.createElement('div');
            div.className = 'icon-preview';
            
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            canvas.style.width = Math.min(size, 100) + 'px';
            canvas.style.height = Math.min(size, 100) + 'px';
            
            drawNALAIcon(canvas, size);
            
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.textContent = \`Download \${size}x\${size}\`;
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.download = \`icon-\${size}x\${size}.png\`;
                link.href = canvas.toDataURL();
                link.click();
            };
            
            const label = document.createElement('div');
            label.textContent = \`\${size}x\${size}\`;
            
            div.appendChild(canvas);
            div.appendChild(downloadBtn);
            div.appendChild(label);
            container.appendChild(div);
        });
        
        // Generate all icons at once
        const downloadAllBtn = document.createElement('button');
        downloadAllBtn.style.cssText = 'background: #059669; color: white; padding: 10px 20px; margin: 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;';
        downloadAllBtn.textContent = 'Download All Icons (ZIP)';
        downloadAllBtn.onclick = () => {
            alert('Right-click each Download button and save to public/icons/ folder');
        };
        
        document.body.insertBefore(downloadAllBtn, container);
    </script>
</body>
</html>
`;

console.log('Copy the HTML below and save as icon-generator.html, then open in browser:');
console.log(generateIconHTML);