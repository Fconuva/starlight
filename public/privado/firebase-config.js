// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, push, update, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDl3Gp320sAbpEeOPf217ryya-4E0QT984",
  authDomain: "profejavi-f48e1.firebaseapp.com",
  databaseURL: "https://profejavi-f48e1-default-rtdb.firebaseio.com",
  projectId: "profejavi-f48e1",
  storageBucket: "profejavi-f48e1.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Database operations
export class FirebaseDB {
  constructor(docenteId) {
    this.docenteId = docenteId;
    this.db = database;
  }

  // Generic CRUD operations
  async getAll(storeName) {
    try {
      const snapshot = await get(ref(this.db, `courses/${this.docenteId}/${storeName}`));
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
      const newRef = push(ref(this.db, `courses/${this.docenteId}/${storeName}`));
      await set(newRef, data);
      return newRef.key;
    } catch (error) {
      console.error(`Error adding to ${storeName}:`, error);
      throw error;
    }
  }

  async update(storeName, id, data) {
    try {
      await update(ref(this.db, `courses/${this.docenteId}/${storeName}/${id}`), data);
    } catch (error) {
      console.error(`Error updating ${storeName}:`, error);
      throw error;
    }
  }

  async delete(storeName, id) {
    try {
      await remove(ref(this.db, `courses/${this.docenteId}/${storeName}/${id}`));
    } catch (error) {
      console.error(`Error deleting from ${storeName}:`, error);
      throw error;
    }
  }

  // Specific methods for evaluations (many-to-many relationship)
  async getEvaluations() {
    try {
      const snapshot = await get(ref(this.db, `courses/${this.docenteId}/evaluations`));
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

export { database };