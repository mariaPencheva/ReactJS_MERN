import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  allTasks as apiAllTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
  takeTask as apiTakeTask,
  completeTask as apiCompleteTask,
  getCompletedTasks as apiGetCompletedTasks,
  getCreatedTasks as apiGetCreatedTasks,
  getTakenTasks as apiGetTakenTasks,
  getTaskDetails as apiGetTaskDetails,
  /*archiveTasks as apiArchiveTasks*/
} from '../api';

// const initialState = {
//   tasks: [],
//   isLoading: false,
//   error: null,
//   taskDetails: null,
// };
const initialState = {
  tasks: [],
  isLoading: false,
  error: null,
  taskDetails: null,
  createdTasks: [],
  takenTasks: [],
  completedTasks: [],
  // archivedTasks: []
  incompletedTasks: [] 
};

export const allTasks = createAsyncThunk(
  'tasks/allTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiAllTasks();

      const tasks = response.data;
      const uniqueTasks = Array.from(new Set(tasks.map(task => task._id)))
      .map(id => {
        return tasks.find(task => task._id === id);
      });
    
    // console.log('Unique Tasks:', uniqueTasks);
      return uniqueTasks;

      // return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { /*dispatch,*/ rejectWithValue }) => {
    try {
      const response = await apiCreateTask(taskData);
      // console.log('TaskSlice: Creating task with data:', taskData);

      // const newTask = response.data;
      // dispatch(allTasks()); 
      // dispatch(createdTasks()); 
      // dispatch(takenTasks()); 
      // dispatch(completedTasks()); 
      return response.data;

    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const response = await apiUpdateTask(id, taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await apiDeleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const takeTask = createAsyncThunk(
  'tasks/takeTask',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiTakeTask(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const completeTask = createAsyncThunk(
  'tasks/completeTask',
  async (id, { /*dispatch,*/ rejectWithValue }) => {
    try {
      const response = await apiCompleteTask(id);
      // dispatch(allTasks());
      // dispatch(takenTasks());
      // dispatch(completedTasks());

      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);
// export const completeTask = createAsyncThunk(
//   'tasks/completeTask',
//   async (taskId, { getState, rejectWithValue }) => {
//     try {
//       const { user } = getState().auth;
//       const response = await apiCompleteTask(taskId);
//       return {
//         ...response.data,
//         completedBy: user, 
//       };
//     } catch (error) {
//       return rejectWithValue(error.response ? error.response.data : error.message);
//     }
//   }
// );

export const createdTasks = createAsyncThunk(
  'tasks/createdTasks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;

      if (!user) {
        throw new Error('User not logged in');
      }

      const response = await apiGetCreatedTasks();
      
      const userCreatedTasks = response.data.filter(task => task.createdBy._id === user._id);

      return userCreatedTasks;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const takenTasks = createAsyncThunk(
  'tasks/takenTasks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user) {
        throw new Error('User not logged in');
      }
      const response = await apiGetTakenTasks();
      return response.data.filter(task => task.takenBy?._id === user._id && !task.completed);
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// export const completedTasks = createAsyncThunk(
//   'tasks/completedTasks',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const { user } = getState().auth;
//       if (!user) {
//         throw new Error('User not logged in');
//       }
//       const response = await apiGetCompletedTasks();

    
//       // const completedByID = response.data.map(task => task.completedBy._id);
//       // const completedByUsername = response.data.map(task => task.completedBy.username);
//       // console.log(`Completed By IDs: ${completedByID.join(', ')}, Usernames: ${completedByUsername.join(', ')} from TS redux.`);
//       // console.log('Response data from TS redux.:', response.data);

//       return response.data.filter(task => task.completedBy._id === user._id);

//     } catch (error) {
//       return rejectWithValue(error.response ? error.response.data : error.message);
//     }
//   }
// );

export const completedTasks = createAsyncThunk(
  'tasks/completedTasks',
  async (_, { rejectWithValue }) => {
    try {
       const response = await apiGetCompletedTasks();

      // const completedByID = response.data.map(task => task.completedBy._id);
      // const completedByUsername = response.data.map(task => task.completedBy.username);
      // console.log(`Completed By IDs: ${completedByID.join(', ')}, Usernames: ${completedByUsername.join(', ')} from TS redux.`);
      // console.log('Response data from TS redux.:', response.data);

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const taskDetails = createAsyncThunk(
  'tasks/taskDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiGetTaskDetails(id);

      // console.log('Response data from TS redux.:', response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  } 
);

//todo
// export const archivedTasks = createAsyncThunk(
//   'tasks/archivedTasks',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const { user } = getState().auth;
//       const response = await apiGetCreatedTasks();
//       return response.data.filter(task => task.createdBy._id === user._id && task.archived);
//     } catch (error) {
//       return rejectWithValue(error.response ? error.response.data : error.message);
//     }
//   }
// );
// export const archiveTask = createAsyncThunk(
//   'tasks/archiveTask',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await apiArchiveTasks(id);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response ? error.response.data : error.message);
//     }
//   }
// );

export const allIncompletedTasks = createAsyncThunk(
  'tasks/allIncompletedTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiAllTasks();
      const tasks = response.data;

      const incompletedTasks = tasks.filter(task => !task.completed);
      return incompletedTasks;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
      builder
          .addCase(allTasks.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(allTasks.fulfilled, (state, action) => {
            state.isLoading = false;
            state.tasks = action.payload;
          })
          .addCase(allTasks.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
          })
          .addCase(createTask.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(createTask.fulfilled, (state, action) => {
            state.isLoading = false;
            state.tasks.push(action.payload);
          })
          .addCase(createTask.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
          })
          .addCase(updateTask.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(updateTask.fulfilled, (state, action) => {
            state.isLoading = false;
            const index = state.tasks.findIndex(task => task._id === action.payload._id);
            if (index !== -1) {
              state.tasks[index] = action.payload;
            }
          })
          .addCase(updateTask.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
          })
          .addCase(deleteTask.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(deleteTask.fulfilled, (state, action) => {
            state.isLoading = false;
            state.tasks = state.tasks.filter(task => task._id !== action.payload);
          })
          .addCase(deleteTask.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
          })
          .addCase(takeTask.fulfilled, (state, action) => {
              const index = state.tasks.findIndex(task => task.id === action.payload.id);
              if (index !== -1) {
                  state.tasks[index] = action.payload;
              }
          })
          .addCase(completeTask.pending, (state) => {
            state.isLoading = true;
            
          })
          .addCase(completeTask.fulfilled, (state, action) => {
            state.isLoading = false;

            state.tasks = state.tasks.map(task =>
              task._id === action.payload._id ? action.payload : task
            );
            // state.tasks = state.tasks.filter(task => task._id !== action.payload._id);
            // state.takenTasks = state.takenTasks.filter(task => task._id !== action.payload._id);
            // state.completedTasks.push(action.payload);
          })
          // .addCase(completeTask.fulfilled, (state, action) => {
          //   state.isLoading = false;
          //   const completedTask = action.payload;
          //   state.tasks = state.tasks.map(task => 
          //     task._id === completedTask._id ? completedTask : task
          //   );
          //   if (completedTask.createdBy._id === state.auth.user._id) {
          //     state.archiveTasks.push(completedTask);
          //     state.createdTasks = state.createdTasks.filter(task => task._id !== completedTask._id);
          //   }
          // })

          .addCase(allIncompletedTasks.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(allIncompletedTasks.fulfilled, (state, action) => {
            state.isLoading = false;
            state.incompletedTasks = action.payload;
          })
          .addCase(allIncompletedTasks.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
          })

          .addCase(completeTask.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
          })
          .addCase(taskDetails.fulfilled, (state, action) => {
            state.taskDetails = action.payload;
          })
          .addCase(createdTasks.fulfilled, (state, action) => {
              state.createdTasks = action.payload;
          })
          .addCase(completedTasks.pending, (state) => {
            state.isLoading = true;
            // state.error = null;
          })
          .addCase(completedTasks.fulfilled, (state, action) => {
            state.isLoading = false;
            state.completedTasks = action.payload;
          })
          .addCase(completedTasks.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
          })
          .addCase(takenTasks.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(takenTasks.fulfilled, (state, action) => {
            state.isLoading = false;
            state.takenTasks = action.payload;
          })
          .addCase(takenTasks.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
          });
          //todo
          // .addCase(archivedTasks.pending, (state) => {
          //   state.isLoading = true;
          //   state.error = null;
          // })
          // .addCase(archivedTasks.fulfilled, (state, action) => {
          //   state.isLoading = false;
          //   state.archivedTasks = action.payload;
          // })
          // .addCase(archivedTasks.rejected, (state, action) => {
          //   state.isLoading = false;
          //   state.error = action.error.message;
          // })
          // .addCase(archiveTask.fulfilled, (state, action) => {
          //   const archivedTask = action.payload;
          //   state.tasks = state.tasks.filter(task => task._id !== archivedTask._id);
          //   state.archivedTasks.push(archivedTask);
          // });
  }
});

export default taskSlice.reducer;
