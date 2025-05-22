export interface Client {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  fechaNacimiento: string; // o Date si lo parseás
  preferredTheme: string;
  autoThemeByHour: boolean;
}
