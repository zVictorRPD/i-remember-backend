import cron from "node-cron";
import { checkAndSendEmails } from "./emailService";

// Agenda a tarefa para ser executada a cada 15 minutos
const scheduledTask = cron.schedule(
  "*/5 * * * *",
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
