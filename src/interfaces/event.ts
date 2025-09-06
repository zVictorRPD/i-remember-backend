export interface IEvent {
  id: number;
  name: string;
  category: string;
  date: string;
  description?: string;
  time?: string;
  location?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  email?: string;
  whatsApp?: string;
  createdAt: string;
}