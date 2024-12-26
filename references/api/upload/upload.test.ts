import axios from "axios";

const apiUrl = "/api/upload";

const createFileChunk = (fileName: string, size: number, chunkIndex: number) => {
  const chunk = new Blob([new Uint8Array(size)], { type: "application/octet-stream" });
  const formData = new FormData();
  formData.append("token", "test-token");
  formData.append("file", chunk, fileName);
  formData.append("chunkIndex", chunkIndex.toString());
  formData.append("totalChunks", "5");
  return formData;
};

describe("File Upload API", () => {
  it("should upload file chunks concurrently", async () => {
    const fileName = "test-file.txt";
    const chunkSize = 1024 * 512; // 512 KB
    const totalChunks = 5;

    const uploadPromises = [];
    for (let i = 0; i < totalChunks; i++) {
      const chunk = createFileChunk(fileName, chunkSize, i);
      uploadPromises.push(axios.post(apiUrl, chunk));
    }

    const responses = await Promise.all(uploadPromises);

    responses.forEach((response) => {
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("message", "Chunk uploaded successfully");
    });
  });
});
