import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  // Fixa a raiz do workspace no diretório do projeto.
  // Sem isto, se houver um package-lock.json acidental em uma pasta acima,
  // o Turbopack escolhe a pasta-pai como raiz e passa a vigiar (file-watch)
  // toda a árvore externa — no Windows isso explode em centenas de processos
  // node e trava a máquina. Ver node_modules/next/dist/docs/.../turbopack.md
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
