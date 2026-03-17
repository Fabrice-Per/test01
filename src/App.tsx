import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ClipboardList, Moon, Sun, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

type Todo = {
  id: string
  title: string
  done: boolean
}

type Filter = 'all' | 'active' | 'done'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [value, setValue] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('darkMode', String(darkMode))
  }, [darkMode])

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((todo) => !todo.done)
    if (filter === 'done') return todos.filter((todo) => todo.done)
    return todos
  }, [filter, todos])

  const doneCount = todos.filter((todo) => todo.done).length

  const addTodo = () => {
    const title = value.trim()
    if (!title) return

    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        title,
        done: false,
      },
      ...prev,
    ])
    setValue('')
  }

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
    )
  }

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-10">
      <Card className="w-full border-orange-200/80 bg-white/75 shadow-xl backdrop-blur-sm dark:border-orange-900/40 dark:bg-gray-900/80">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-500 p-2 text-white shadow">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold tracking-tight">Focus Todos</CardTitle>
              <p className="text-sm text-muted-foreground">
                Organise ta journee avec React, Tailwind et shadcn/ui
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') addTodo()
              }}
              placeholder="Ajouter une tache..."
              className="h-11 bg-white dark:bg-gray-800"
            />
            <Button onClick={addTodo} className="h-11 px-5">
              Ajouter
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{todos.length} total</Badge>
            <Badge className="bg-emerald-700 text-white hover:bg-emerald-700">
              {doneCount} terminees
            </Badge>
            <div className="ml-auto flex gap-1 rounded-lg bg-secondary p-1">
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Toutes
              </Button>
              <Button
                variant={filter === 'active' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('active')}
              >
                Actives
              </Button>
              <Button
                variant={filter === 'done' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('done')}
              >
                Finies
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          {visibleTodos.length === 0 ? (
            <div className="rounded-lg border border-dashed border-orange-200 px-4 py-8 text-center text-sm text-muted-foreground dark:border-orange-900/50">
              Aucune tache ici. Commence par en ajouter une.
            </div>
          ) : (
            visibleTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 rounded-lg border border-orange-100 bg-white px-3 py-2 dark:border-orange-900/30 dark:bg-gray-800/60"
              >
                <Checkbox
                  checked={todo.done}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  aria-label={`Terminer ${todo.title}`}
                />
                <span
                  className={`flex-1 text-sm ${
                    todo.done ? 'text-muted-foreground line-through' : 'text-foreground'
                  }`}
                >
                  {todo.title}
                </span>
                {todo.done && <CheckCircle2 className="h-4 w-4 text-emerald-700" />}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTodo(todo.id)}
                  aria-label={`Supprimer ${todo.title}`}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  )
}

export default App
