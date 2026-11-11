/** Tipos padrão de evidência. Qualquer outro texto salvo no caso é um tipo personalizado ("Outra"). */
export const TIPOS_PADRAO = [
  "Digital",
  "DNA",
  "Depoimento",
  "Documental",
  "Física",
  "Audiovisual",
  "Biológica",
  "Motivação",
  "Antecedente",
  "Pericial",
  "Telefônica",
  "Comportamento",
] as const;

/** Valor do seletor que libera o campo para digitar um tipo próprio. */
export const TIPO_OUTRA = "Outra";

/** Tamanho máximo do nome de um tipo personalizado (igual ao do servidor). */
export const TIPO_MAX = 60;

export function isTipoPersonalizado(tipo: string | null | undefined): boolean {
  return !!tipo && !(TIPOS_PADRAO as readonly string[]).includes(tipo);
}
