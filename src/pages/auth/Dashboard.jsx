import { useEffect } from "react";
import { useState } from "react";
import { supabase } from "../../supabase";
function Dashboard() {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    const getTodos = async () => {
      const { data: todos } = await supabase.from("todo").select();

      if (todos) {
        setTodos(todos);
      }
    };

    getTodos();
  }, []);
  return (
    <>
      <div className="bg-image2 h-screen flex flex-col">
        <div className="text-2xl pt-24">User Profile</div>
        <div>
          <ul>
            <li>Hi</li>
            {todos.map((todo) => (
              <div>
                <li key={todo.id}>{todo.name}</li>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
