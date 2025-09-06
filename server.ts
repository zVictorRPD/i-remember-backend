import dotenv from "dotenv";
dotenv.config();
// prettier-ignore
import app from "./src/app";


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`Acesse em http://localhost:${PORT}`);
});
