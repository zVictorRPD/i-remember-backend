import cron from "node-cron";
import { checkAndSendEmails } from "./emailService";

// Para rodar todos os dias às 6 da manhã, use a expressão: "0 6 * * *"
const scheduledTask = cron.schedule(
  "0 6 * * *",
  () => {
    console.log(
      "Executando a tarefa agendada: verificação e envio de e-mails."
    );
    checkAndSendEmails();
  },
  {
    timezone: "America/Sao_Paulo",
  }
);

export const startCron = () => {
  scheduledTask.start();
};
