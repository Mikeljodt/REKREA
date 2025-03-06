export interface Client {
  id: number;
  name: string;
  businessType: string;
  owner: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  taxId: string;
  morningOpenTime: string;
  morningCloseTime: string | null | undefined;
  eveningOpenTime: string | null | undefined;
  eveningCloseTime: string;
  closingDay: string;
  machines: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DB {
  getAll: (store: string) => Promise<any[]>;
  get: (store: string, id: number | string) => Promise<any>;
  add: (store: string, data: any) => Promise<any>;
  put: (store: string, data: any) => Promise<any>;
  delete: (store: string, id: number | string) => Promise<void>;
}

// Simulación de una base de datos en memoria
class MemoryDB implements DB {
  private stores: { [key: string]: any[] } = {
    clients: [],
    backups: []
  };

  async getAll(store: string): Promise<any[]> {
    return this.stores[store] || [];
  }

  async get(store: string, id: number | string): Promise<any> {
    const items = this.stores[store] || [];
    return items.find(item => item.id === id);
  }

  async add(store: string, data: any): Promise<any> {
    if (!this.stores[store]) {
      this.stores[store] = [];
    }
    this.stores[store].push(data);
    return data;
  }

  async put(store: string, data: any): Promise<any> {
    if (!this.stores[store]) {
      this.stores[store] = [];
    }
    
    const index = this.stores[store].findIndex(item => item.id === data.id);
    if (index !== -1) {
      // Actualizar solo los campos proporcionados, manteniendo los datos existentes
      const existingData = this.stores[store][index];
      this.stores[store][index] = {
        ...existingData,
        ...data,
        updatedAt: new Date().toISOString()
      };
      return this.stores[store][index];
    } else {
      // Si no existe, añadirlo
      return this.add(store, data);
    }
  }

  async delete(store: string, id: number | string): Promise<void> {
    if (!this.stores[store]) {
      return;
    }
    
    this.stores[store] = this.stores[store].filter(item => item.id !== id);
  }
}

let dbInstance: DB | null = null;

/**
 * Inicializa la base de datos y asegura que todas las tiendas (stores) necesarias
 * estén creadas y listas para usar.
 */
export const initDB = async (): Promise<DB> => {
  // Inicializa y devuelve la instancia de DB
  return getDB();
};

export const getDB = async (): Promise<DB> => {
  if (!dbInstance) {
    // En un entorno real, aquí se inicializaría IndexedDB o SQLite
    // Para este ejemplo, usamos una DB en memoria
    dbInstance = new MemoryDB();
  }
  
  return dbInstance;
};

/**
 * Exporta toda la base de datos a formato JSON
 * @returns Una cadena JSON con todos los datos de la base de datos
 */
export const exportDBToJSON = async (): Promise<string> => {
  const db = await getDB();
  const exportData: { [key: string]: any[] } = {};
  
  // Exportar clientes
  exportData.clients = await db.getAll('clients');
  
  // Exportar backups (solo metadatos, no los datos completos)
  const backups = await db.getAll('backups');
  exportData.backupsMetadata = backups.map(backup => ({
    id: backup.id,
    metadata: backup.metadata,
    createdAt: backup.createdAt
  }));
  
  return JSON.stringify(exportData, null, 2);
};

/**
 * Importa datos desde una cadena JSON a la base de datos
 * @param jsonData La cadena JSON con los datos a importar
 */
export const importDBFromJSON = async (jsonData: string): Promise<void> => {
  try {
    const db = await getDB();
    const importData = JSON.parse(jsonData);
    
    // Importar clientes
    if (importData.clients && Array.isArray(importData.clients)) {
      // Primero eliminar todos los clientes existentes
      const existingClients = await db.getAll('clients');
      for (const client of existingClients) {
        await db.delete('clients', client.id);
      }
      
      // Luego importar los nuevos
      for (const client of importData.clients) {
        await db.add('clients', client);
      }
    }
    
    // Nota: No importamos los backups completos, solo sus metadatos
    // En un caso real, se manejaría esto de forma diferente
    
    console.log('Importación completada con éxito');
  } catch (error) {
    console.error('Error al importar datos:', error);
    throw new Error('Error al importar datos desde JSON');
  }
};
