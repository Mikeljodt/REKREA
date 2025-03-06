import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clientsReducer from './slices/clientsSlice';
import machinesReducer from './slices/machinesSlice';
import collectionsReducer from './slices/collectionsSlice';
import expensesReducer from './slices/expensesSlice';
import companyProfileReducer from './slices/companyProfileSlice';
import { fetchMachines } from './slices/machinesSlice';
import { fetchClients } from './slices/clientsSlice';
import { fetchCollections } from './slices/collectionsSlice';
import { fetchExpenses } from './slices/expensesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    machines: machinesReducer,
    collections: collectionsReducer,
    expenses: expensesReducer,
    companyProfile: companyProfileReducer,
  },
});

// Cargar datos iniciales
store.dispatch(fetchMachines());
store.dispatch(fetchClients());
store.dispatch(fetchCollections());
store.dispatch(fetchExpenses());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
