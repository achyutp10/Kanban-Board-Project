import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { KanbanState } from '../types';

const App: React.FC = () => {
  const initialState: KanbanState = {
    tasks: {
      'task-1': { id: 'task-1', content: 'Take out the garbage', columnId: 'column-1' },
      'task-2': { id: 'task-2', content: 'Watch my favorite show', columnId: 'column-1' },
      'task-3': { id: 'task-3', content: 'Charge my phone', columnId: 'column-2' },
    },
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'To do',
        taskIds: ['task-1', 'task-2'],
      },
      'column-2': {
        id: 'column-2',
        title: 'In progress',
        taskIds: ['task-3'],
      },
      'column-3': {
        id: 'column-3',
        title: 'Done',
        taskIds: [],
      },
    },
    columnOrder: ['column-1', 'column-2', 'column-3'],
  };
  

  
  const [state, setState] = useState<KanbanState>(() => {
    const saved = localStorage.getItem('kanbanState');
    return saved ? JSON.parse(saved) : initialState;
  });


  useEffect(() => {
    localStorage.setItem('kanbanState', JSON.stringify(state));
  }, [state]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = state.columns[source.droppableId];
    const destColumn = state.columns[destination.droppableId];
    
    if (sourceColumn === destColumn) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      };

      setState({
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      });
    } else {
      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      sourceTaskIds.splice(source.index, 1);
      const newSourceColumn = {
        ...sourceColumn,
        taskIds: sourceTaskIds,
      };

      const destTaskIds = Array.from(destColumn.taskIds);
      destTaskIds.splice(destination.index, 0, draggableId);
      const newDestColumn = {
        ...destColumn,
        taskIds: destTaskIds,
      };

      setState({
        ...state,
        tasks: {
          ...state.tasks,
          [draggableId]: {
            ...state.tasks[draggableId],
            columnId: destination.droppableId,
          },
        },
        columns: {
          ...state.columns,
          [newSourceColumn.id]: newSourceColumn,
          [newDestColumn.id]: newDestColumn,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Kanban Board</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          {state.columnOrder.map((columnId) => {
            const column = state.columns[columnId];
            const tasks = column.taskIds.map(taskId => state.tasks[taskId]);

            return (
              <div key={column.id} className="w-72">
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-4 rounded-lg bg-gray-200 min-h-[500px] ${
                        snapshot.isDraggingOver ? 'bg-gray-300' : ''
                      }`}
                    >
                      <h2 className="font-semibold text-lg mb-4">{column.title}</h2>
                      {tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 mb-2 bg-white rounded shadow ${
                                snapshot.isDragging ? 'shadow-lg' : ''
                              }`}
                            >
                              {task.content}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default App;