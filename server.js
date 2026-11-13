import { createServer } from 'node:http';
import next from 'next';

const port = Number.parseInt(process.env.PORT || '3000', 10);
const app = next({ dev: false });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        // Rate limits and login lockouts key on the first X-Forwarded-For entry, which any
        // client can forge. Replace it with an address we trust: the socket peer, or — when
        // the peer is the local proxy (LiteSpeed/Passenger on cPanel) — the entry it appended.
        const peer = String(req.socket?.remoteAddress || '').replace(/^::ffff:/, '');
        const isLocalPeer = !peer || peer === '127.0.0.1' || peer === '::1';
        const forwarded = String(req.headers['x-forwarded-for'] || '').split(',').map((part) => part.trim()).filter(Boolean);
        const trusted = isLocalPeer ? forwarded.at(-1) : peer;
        if (trusted) req.headers['x-forwarded-for'] = trusted;
        else delete req.headers['x-forwarded-for'];
        delete req.headers['x-real-ip'];
        await handle(req, res);
      } catch (error) {
        console.error('Request handling failed:', error);

        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
        }

        res.end('Internal Server Error');
      }
    });

    server.listen(port, () => {
      console.log(`The Salon POS started on Passenger port ${port}`);
    });
  })
  .catch((error) => {
    console.error('The Salon POS startup failed:', error);
    process.exit(1);
  });
