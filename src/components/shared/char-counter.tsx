/**
 * Contador ao vivo de caracteres para inputs/textareas.
 * Fica âmbar ao passar de 90% do limite e vermelho ao atingi-lo — o usuário
 * enxerga o quão perto está do máximo antes mesmo de tentar salvar.
 */
export function CharCounter({ value, max }: { value?: string | null; max: number }) {
  const len = value?.length ?? 0;
  const cls = len >= max ? "text-red-400" : len >= max * 0.9 ? "text-amber-400" : "text-zinc-600";
  return <span className={`text-[10px] tabular-nums ${cls}`}>{len}/{max}</span>;
}
