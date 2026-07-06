export interface ITask {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date;
  isCompleted: boolean;
}
