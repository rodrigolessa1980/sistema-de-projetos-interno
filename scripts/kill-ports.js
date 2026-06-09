#!/usr/bin/env node

const { execSync } = require("child_process");

const DEFAULT_PORTS = [8022, 4011];
const ports = process.argv.slice(2).map(Number).filter(Boolean);

if (ports.length === 0) {
  ports.push(...DEFAULT_PORTS);
}

function killPort(port) {
  const isWin = process.platform === "win32";

  try {
    if (isWin) {
      const output = execSync(`netstat -ano | findstr :${port}`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"],
      });

      const pids = new Set();
      for (const line of output.split("\n")) {
        const match = line.trim().match(/LISTENING\s+(\d+)\s*$/);
        if (match) {
          pids.add(match[1]);
        }
      }

      for (const pid of pids) {
        if (pid === "0") continue;
        try {
          execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
          console.log(`Porta ${port}: processo ${pid} encerrado.`);
        } catch {
          // processo já encerrado
        }
      }

      if (pids.size === 0) {
        console.log(`Porta ${port}: livre.`);
      }
    } else {
      execSync(`lsof -ti:${port} | xargs -r kill -9`, { stdio: "ignore" });
      console.log(`Porta ${port}: processos encerrados.`);
    }
  } catch {
    console.log(`Porta ${port}: livre.`);
  }
}

for (const port of ports) {
  killPort(port);
}
