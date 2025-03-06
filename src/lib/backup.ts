import { getDB, exportDBToJSON, importDBFromJSON } from './db';

const BACKUP_INTERVAL = 1000 * 60 * 60; // 1 hora
const MAX_BACKUPS = 5; // Mantener solo los últimos 5 backups

interface BackupMetadata {
  timestamp: string;
  size: number;
  version: string;
}

let backupInterval: number | null = null;

export async function startAutoBackup() {
  if (backupInterval) {
    return; // Ya está corriendo
  }

  // Realizar backup inicial
  await performBackup();

  // Configurar intervalo de backup
  backupInterval = window.setInterval(async () => {
    await performBackup();
  }, BACKUP_INTERVAL);
}

export function stopAutoBackup() {
  if (backupInterval) {
    window.clearInterval(backupInterval);
    backupInterval = null;
  }
}

async function performBackup() {
  try {
    const backupData = await exportDBToJSON();
    const backupBlob = new Blob([backupData], { type: 'application/json' });
    
    // Crear metadata del backup
    const metadata: BackupMetadata = {
      timestamp: new Date().toISOString(),
      size: backupBlob.size,
      version: '1.0'
    };

    // Guardar backup en IndexedDB
    const db = await getDB();
    const backupId = `backup_${Date.now()}`;
    
    await db.add('backups', {
      id: backupId,
      data: backupBlob,
      metadata,
      createdAt: new Date().toISOString()
    });

    // Limpiar backups antiguos
    await cleanupOldBackups();

    console.log('Backup realizado con éxito:', backupId);
  } catch (error) {
    console.error('Error al realizar backup:', error);
  }
}

async function cleanupOldBackups() {
  try {
    const db = await getDB();
    const backups = await db.getAll('backups');
    
    if (backups.length > MAX_BACKUPS) {
      // Ordenar por fecha (más recientes primero)
      backups.sort((a, b) => 
        new Date(b.metadata.timestamp).getTime() - new Date(a.metadata.timestamp).getTime()
      );
      
      // Eliminar backups antiguos
      const backupsToDelete = backups.slice(MAX_BACKUPS);
      for (const backup of backupsToDelete) {
        await db.delete('backups', backup.id);
      }
    }
  } catch (error) {
    console.error('Error al limpiar backups antiguos:', error);
  }
}

export async function restoreFromBackup(backupId: string) {
  try {
    const db = await getDB();
    const backup = await db.get('backups', backupId);
    
    if (!backup) {
      throw new Error('Backup no encontrado');
    }

    // Leer el contenido del backup
    const backupText = await backup.data.text();
    
    // Restaurar la base de datos
    await importDBFromJSON(backupText);
    
    console.log('Backup restaurado con éxito:', backupId);
    return true;
  } catch (error) {
    console.error('Error al restaurar backup:', error);
    throw error;
  }
}

export async function downloadBackup(backupId: string) {
  try {
    const db = await getDB();
    const backup = await db.get('backups', backupId);
    
    if (!backup) {
      throw new Error('Backup no encontrado');
    }

    // Crear URL del blob
    const url = URL.createObjectURL(backup.data);
    
    // Crear enlace de descarga
    const a = document.createElement('a');
    a.href = url;
    a.download = `rekreativ_backup_${new Date(backup.metadata.timestamp).toISOString()}.json`;
    
    // Trigger descarga
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Limpiar URL
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error al descargar backup:', error);
    throw error;
  }
}
