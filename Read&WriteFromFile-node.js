const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    const getMessages = () => {
        try {
            const data = fs.readFileSync('message.txt', 'utf8');
            const messages = data.split('\n').filter(message => message.trim() !== ''); 
            return messages.reverse().map(message => `<p>${message}</p>`).join('');
        } catch (err) {
            return '<p>No messages found.</p>';
        }
    };
    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body>');
        res.write('<h2>Messages:</h2>');
        res.write(getMessages());
        res.write('<form action="/message" method="POST">');
        res.write('<input type="text" name="message" placeholder="Enter your message">');
        res.write('<button type="submit">Send</button>');
        res.write('</form>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1].replace(/\+/g, ' '); 
            fs.appendFile('message.txt', message + '\n', (err) => {
                res.statusCode = 302; 
                res.setHeader('Location', '/'); 
                return res.end();
            });
        });
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my Node.js Server</h1></body>');
    res.write('</html>');
    res.end();
});
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
