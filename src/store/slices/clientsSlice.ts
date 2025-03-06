import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getDB, Client } from '@/lib/db';

interface ClientsState {
  clients: Client[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  nextId: number;
}

const initialState: ClientsState = {
  clients: [],
  status: 'idle',
  error: null,
  nextId: 1,
};

export const fetchClients = createAsyncThunk('clients/fetchClients', async () => {
  const db = await getDB();
  const clients = await db.getAll('clients');
  return clients;
});

export const addClient = createAsyncThunk(
  'clients/addClient',
  async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>, { getState }) => {
    const db = await getDB();
    const now = new Date().toISOString();
    const state = getState() as { clients: ClientsState };
    const nextId = state.clients.nextId;
    
    const newClient: Client = {
      ...clientData,
      id: nextId,
      createdAt: now,
      updatedAt: now,
    };
    
    await db.add('clients', newClient);
    return newClient;
  }
);

export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, ...updates }: Partial<Client> & { id: number }) => {
    const db = await getDB();
    const now = new Date().toISOString();
    
    const updatedClient: Client = {
      ...updates,
      id,
      updatedAt: now,
    } as Client;
    
    await db.put('clients', updatedClient);
    return updatedClient;
  }
);

export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (id: number) => {
    const db = await getDB();
    await db.delete('clients', id);
    return id;
  }
);

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action: PayloadAction<Client[]>) => {
        state.status = 'succeeded';
        state.clients = action.payload;
        // Actualizar el siguiente ID basado en el número más alto existente + 1
        const maxId = state.clients.reduce((max, client) => 
          client.id > max ? client.id : max, 0);
        state.nextId = maxId + 1;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch clients';
      })
      .addCase(addClient.fulfilled, (state, action: PayloadAction<Client>) => {
        state.clients.push(action.payload);
        state.nextId = action.payload.id + 1;
      })
      .addCase(updateClient.fulfilled, (state, action: PayloadAction<Client>) => {
        const index = state.clients.findIndex((client) => client.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
      })
      .addCase(deleteClient.fulfilled, (state, action: PayloadAction<number>) => {
        state.clients = state.clients.filter((client) => client.id !== action.payload);
      });
  },
});

export default clientsSlice.reducer;
