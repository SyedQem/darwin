import { createClient } from '@/lib/supabase/server';

type Todo = {
  id: string | number;
  name: string;
};

export default async function TodosPage() {
  const supabase = await createClient();
  const { data: todos } = await supabase.from('todos').select();

  return (
    <div className="container-vspr page-shell">
      <span className="section-label">Supabase</span>
      <h1 className="section-title-md mt-4">Todos</h1>

      <div className="surface-panel mt-8 p-6 md:p-8">
        <ul className="space-y-3">
          {(todos as Todo[] | null)?.map((todo) => (
            <li key={todo.id} className="info-tile">
              {todo.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
