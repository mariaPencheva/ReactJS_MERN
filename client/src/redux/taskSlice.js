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
  getTaskDetails as apiGetTaskDetails
} from '../api';

const initialState = {
  tasks: [],
  isLoading: false,
  error: null,
  taskDetails: null,
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching tasks...');
      const response = await apiFetchTasks();
      console.log('Tasks fetched:', response.data);
      return response.data.filter(task => !task.completed); 
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await apiCreateTask(taskData);
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
  async (id, { rejectWithValue }) => {
    try {
      await apiCompleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const fetchCompletedTasks = createAsyncThunk(
  'tasks/fetchCompletedTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetCompletedTasks();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const fetchCreatedTasks = createAsyncThunk(
  'tasks/fetchCreatedTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetCreatedTasks();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const fetchTakenTasks = createAsyncThunk(
  'tasks/fetchTakenTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetTakenTasks();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

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
  reducers: {
    filterTasks: (state) => {
      state.tasks = state.tasks.filter(task => !task.completed);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      })
      .addCase(fetchCompletedTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(fetchCreatedTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(fetchTakenTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(fetchTaskDetails.fulfilled, (state, action) => {
        state.taskDetails = action.payload;
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const { filterTasks } = taskSlice.actions;

export default taskSlice.reducer;
