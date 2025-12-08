/**
 * Simple Web Server for Yatra Website
 * Serves HTML files on http://localhost:5500
 * 
 * Run: node start-webserver.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5500;
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Decode URL (handles %20 for spaces, %28 for (, etc.)
    let filePath = decodeURIComponent(req.url.split('?')[0]);
    
    // Handle favicon requests gracefully (return 204 No Content)
    if (filePath === '/favicon.ico') {
        res.writeHead(204, { 'Content-Length': 0 });
        res.end();
        return;
    }
    
    // URL aliases for easier access
    const urlAliases = {
        '/': 'Yatra_Admin_With_Room_Pairs (4).html',
        '/admin': 'Yatra_Admin_With_Room_Pairs (4).html',
        '/admin.html': 'Yatra_Admin_With_Room_Pairs (4).html',
        '/Yatra_Admin_With_Room_Pairs': 'Yatra_Admin_With_Room_Pairs (4).html',
        '/Yatra_Admin': 'Yatra_Admin_With_Room_Pairs (4).html',
        '/website': 'Yatra_Website_With_Room_Pairs (2).html',
        '/website.html': 'Yatra_Website_With_Room_Pairs (2).html',
        '/Yatra_Website': 'Yatra_Website_With_Room_Pairs (2).html'
    };
    
    // Check if URL matches an alias
    if (urlAliases[filePath]) {
        filePath = '/' + urlAliases[filePath];
    }
    
    // Remove leading slash
    filePath = filePath.substring(1);
    
    // List of available HTML files
    const htmlFiles = [
        'Yatra_Admin_With_Room_Pairs (4).html',
        'Yatra_Website_With_Room_Pairs (2).html'
    ];
    
    // Check if file exists in current directory
    const fullPath = path.join(__dirname, filePath);
    
    // Get file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Read file
    fs.readFile(fullPath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                const fileList = htmlFiles.map(f => 
                    `<li><a href="/${encodeURIComponent(f)}">${f}</a></li>`
                ).join('');
                res.end(`
                    <h1>404 - File Not Found</h1>
                    <p>Requested: ${filePath}</p>
                    <p>Available files:</p>
                    <ul>${fileList}</ul>
                    <p><a href="/">Go to Admin Panel</a></p>
                `);
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n🌐 Web Server Running!`);
    console.log(`\n📱 Access your website at:`);
    console.log(`\n   🎛️  Admin Panel:`);
    console.log(`      http://localhost:${PORT}/`);
    console.log(`      http://localhost:${PORT}/admin`);
    console.log(`      http://localhost:${PORT}/Yatra_Admin_With_Room_Pairs (4).html`);
    console.log(`\n   🌐 Website:`);
    console.log(`      http://localhost:${PORT}/website`);
    console.log(`      http://localhost:${PORT}/Yatra_Website_With_Room_Pairs (2).html`);
    console.log(`\n✅ Server ready! Keep this window open.\n`);
});

