// Firebase configuration loader
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, set, get, push, update, remove } from 'firebase/database';

let appInstance = null;
let databaseInstance = null;
let configPromise = null;

async function fetchFirebaseConfig() {
  if (!configPromise) {
    configPromise = fetch('/.netlify/functions/firebase-config')
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(`No se pudo cargar la configuración de Firebase: ${error.error || response.statusText}`);
        }
        return response.json();
      })
      .catch((error) => {
        configPromise = null;
        throw error;
      });
  }
  return configPromise;
}

async function getDatabaseInstance() {
  if (databaseInstance) {
    return databaseInstance;
  }

  const config = await fetchFirebaseConfig();

  if (!getApps().length) {
    appInstance = initializeApp(config);
  } else if (!appInstance) {
    appInstance = getApps()[0];
  }

  databaseInstance = getDatabase(appInstance);
  return databaseInstance;
}

// Database operations
export class FirebaseDB {
  constructor(docenteId) {
    this.docenteId = docenteId;
    this.db = null;
  }

  async resolveDb() {
    if (!this.db) {
      this.db = await getDatabaseInstance();
    }
    return this.db;
  }

  // Generic CRUD operations
  async getAll(storeName) {
    try {
      const db = await this.resolveDb();
      const snapshot = await get(ref(db, `courses/${this.docenteId}/${storeName}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({ id: key, ...data[key] }));
      }
      return [];
    } catch (error) {
      console.error(`Error getting ${storeName}:`, error);
      return [];
    }
  }

  async add(storeName, data) {
    try {
      const db = await this.resolveDb();
      const newRef = push(ref(db, `courses/${this.docenteId}/${storeName}`));
      await set(newRef, data);
      return newRef.key;
    } catch (error) {
      console.error(`Error adding to ${storeName}:`, error);
      throw error;
    }
  }

  async update(storeName, id, data) {
    try {
      const db = await this.resolveDb();
      await update(ref(db, `courses/${this.docenteId}/${storeName}/${id}`), data);
    } catch (error) {
      console.error(`Error updating ${storeName}:`, error);
      throw error;
    }
  }

  async delete(storeName, id) {
    try {
      const db = await this.resolveDb();
      await remove(ref(db, `courses/${this.docenteId}/${storeName}/${id}`));
    } catch (error) {
      console.error(`Error deleting from ${storeName}:`, error);
      throw error;
    }
  }

  // Specific methods for evaluations (many-to-many relationship)
  async getEvaluations() {
    try {
      const db = await this.resolveDb();
      const snapshot = await get(ref(db, `courses/${this.docenteId}/evaluations`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({ id: key, ...data[key] }));
      }
      return [];
    } catch (error) {
      console.error('Error getting evaluations:', error);
      return [];
    }
  }

  async upsertEvaluation(taskId, studentId, value) {
    try {
      const evaluations = await this.getEvaluations();
      const existing = evaluations.find(e => e.taskId === taskId && e.studentId === studentId);

      if (existing) {
        await this.update('evaluations', existing.id, { taskId, studentId, value });
      } else {
        await this.add('evaluations', { taskId, studentId, value });
      }
    } catch (error) {
      console.error('Error upserting evaluation:', error);
      throw error;
    }
  }

  async getEvaluationsMap() {
    const evals = await this.getEvaluations();
    const map = new Map();
    evals.forEach(ev => map.set(ev.taskId + ':' + ev.studentId, ev));
    return map;
  }

  // Migration from IndexedDB
  async migrateFromIndexedDB(indexedDB) {
    try {
      console.log('Starting migration from IndexedDB to Firebase...');

      // Migrate courses
      const courses = await indexedDB.getAll('courses');
      for (const course of courses) {
        await this.add('courses', course);
      }
      console.log(`Migrated ${courses.length} courses`);

      // Migrate students
      const students = await indexedDB.getAll('students');
      for (const student of students) {
        await this.add('students', student);
      }
      console.log(`Migrated ${students.length} students`);

      // Migrate tasks
      const tasks = await indexedDB.getAll('tasks');
      for (const task of tasks) {
        await this.add('tasks', task);
      }
      console.log(`Migrated ${tasks.length} tasks`);

      // Migrate evaluations
      const evaluations = await indexedDB.getAll('evaluations');
      for (const evaluation of evaluations) {
        await this.add('evaluations', evaluation);
      }
      console.log(`Migrated ${evaluations.length} evaluations`);

      console.log('Migration completed successfully!');
      return true;
    } catch (error) {
      console.error('Error during migration:', error);
      return false;
    }
  }
}
export async function ensureFirebaseReady() {
  await getDatabaseInstance();
}