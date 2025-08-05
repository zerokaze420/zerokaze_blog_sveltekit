export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}
export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}