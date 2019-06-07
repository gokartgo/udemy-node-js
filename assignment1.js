const http = require('http');

const requestListener = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        // res.write('<body><h1>/ Page</h1></body>');
        res.write('<body><form action="/create-user" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/users') {
        res.write('<html>');
        res.write('<body>');
        res.write('<ul><li>User 1</li><li>User 2</li></ul>')
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/create-user' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            console.log('chunk', chunk);
            body.push(chunk);
        });
        return req.on('end', () => {
            console.log(Buffer.concat(body))
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            console.log('parsedBody', parsedBody);
            console.log('message', message)
            res.statusCode = 302;
            res.setHeader('Location', '/');
            return res.end();
        });
    }
}

const server = http.createServer(requestListener);

server.listen(3000);