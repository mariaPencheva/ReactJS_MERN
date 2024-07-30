import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchTasks as apiFetchTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
  takeTask as apiTakeTask,
  completeTask as apiCompleteTask,
  getCompletedTasks as apiGetCompletedTasks,
  getCreatedTasks as apiGetCreatedTasks,
  getTakenTasks as apiGetTakenTasks,
  getTaskDetails as apiGetTaskDetails,
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
};

// Fetch all tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiFetchTasks();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


// Create a new task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiCreateTask(taskData);
      console.log('TaskSlice: Creating task with data:', taskData);

      // const newTask = response.data;
      dispatch(fetchTasks()); 
      dispatch(fetchCreatedTasks()); 
      dispatch(fetchTakenTasks()); 
      dispatch(fetchCompletedTasks()); 
      return response.data;

    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


// Update an existing task
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

// Delete a task
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


// Take a task
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

// Complete a task
export const completeTask = createAsyncThunk(
  'tasks/completeTask',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await apiCompleteTask(id);
      dispatch(fetchTasks());
      dispatch(fetchTakenTasks());
      dispatch(fetchCompletedTasks());
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


// Fetch created tasks
export const fetchCreatedTasks = createAsyncThunk(
  'tasks/fetchCreatedTasks',
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

// Fetch taken tasks
export const fetchTakenTasks = createAsyncThunk(
  'tasks/fetchTakenTasks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const response = await apiGetTakenTasks();
      return response.data.filter(task => task.takenBy?._id === user._id && !task.completed);
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Fetch completed tasks
export const fetchCompletedTasks = createAsyncThunk(
  'tasks/fetchCompletedTasks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const response = await apiGetCompletedTasks();
      return response.data.filter(task => task.completedBy === user._id);
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


// Fetch task details
export const fetchTaskDetails = createAsyncThunk(
  'tasks/fetchTaskDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiGetTaskDetails(id);
      return response.data;
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
          .addCase(fetchTasks.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(fetchTasks.fulfilled, (state, action) => {
            state.isLoading = false;
            state.tasks = action.payload;
          })
          .addCase(fetchTasks.rejected, (state, action) => {
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
            const completedTask = action.payload;
            state.tasks = state.tasks.filter(task => task._id !== completedTask._id);
            state.completedTasks.push(completedTask);
          })
          .addCase(completeTask.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
          })
          .addCase(fetchTaskDetails.fulfilled, (state, action) => {
            state.taskDetails = action.payload;
          })
          .addCase(fetchCreatedTasks.fulfilled, (state, action) => {
              state.createdTasks = action.payload;
          })
          .addCase(fetchCompletedTasks.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(fetchCompletedTasks.fulfilled, (state, action) => {
            state.isLoading = false;
            state.completedTasks = action.payload;
          })
          .addCase(fetchCompletedTasks.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
          })
          .addCase(fetchTakenTasks.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(fetchTakenTasks.fulfilled, (state, action) => {
            state.isLoading = false;
            state.takenTasks = action.payload;
          })
          .addCase(fetchTakenTasks.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
          });
  }
});

export default taskSlice.reducer;
