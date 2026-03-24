import http from "node:http";
import next from "next";

function readOption(args, optionName) {
  const index = args.findIndex(
    (argument) =>
      argument === optionName || argument.startsWith(`${optionName}=`)
  );

  if (index === -1) {
    return undefined;
  }

  const argument = args[index];

  if (argument.includes("=")) {
    return argument.split("=")[1];
  }

  return args[index + 1];
}

const args = process.argv.slice(2);
const dev = args.includes("--dev");
const port = Number(readOption(args, "--port") ?? process.env.PORT ?? 3000);
const hostname = readOption(args, "--hostname") ?? process.env.HOSTNAME ?? "0.0.0.0";
const mapPath = readOption(args, "--map");
const bookingsPath = readOption(args, "--bookings");

if (mapPath) {
  process.env.MAP_PATH = mapPath;
}

if (bookingsPath) {
  process.env.BOOKINGS_PATH = bookingsPath;
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => handle(req, res));

  server.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
