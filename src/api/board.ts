import { apiFetch } from "@/lib/api";

export async function uploadBoardImage(caseId: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiFetch(
    `/cases/${caseId}/board/images`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao enviar imagem");
  }

  const data = await response.json();

  return data.url;
}