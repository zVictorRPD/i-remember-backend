import dotenv from "dotenv";
dotenv.config();
// prettier-ignore
import app from "./src/app";


const PORT = 80;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`Acesse em http://localhost:${PORT}`);
});
