// Firebase Service Module
// Handles all Firebase operations and configuration

let firebaseApp = null;
let firebaseDatabase = null;
let firebaseConfigLoaded = false;

class FirebaseService {
    constructor() {
        this.db = null;
        this.docenteId = null;
    }

    setDocenteId(docenteId) {
        this.docenteId = docenteId;
    }

    async initializeFirebase() {
        if (firebaseConfigLoaded) return;

        try {
            const response = await fetch('/.netlify/functions/firebase-config');
            if (!response.ok) {
                throw new Error('No se pudo cargar la configuración de Firebase');
            }
            const config = await response.json();
            console.log('📋 Config recibida (databaseURL):', config.databaseURL);

            firebaseApp = firebase.initializeApp(config);
            firebaseDatabase = firebase.database();
            firebaseConfigLoaded = true;

            // Test connection
            const testRef = firebaseDatabase.ref('.info/connected');
            testRef.on('value', (snapshot) => {
                if (snapshot.val() === true) {
                    console.log('✅ Firebase conectado exitosamente');
                } else {
                    console.log('⚠️ Firebase desconectado');
                }
            });

            console.log('✅ Firebase inicializado correctamente');
        } catch (error) {
            console.error('❌ Error al inicializar Firebase:', error);
            alert('Error de conexión con Firebase. Verifica tu configuración.');
            throw error;
        }
    }

    getDatabase() {
        return firebaseDatabase;
    }

    // Generic CRUD operations
    async getAll(storeName) {
        try {
            const db = this.getDatabase();
            const path = `courses/${this.docenteId}/${storeName}`;
            console.log(`📖 Leyendo de Firebase: ${path}`);
            const snapshot = await db.ref(path).once('value');
            if (snapshot.exists()) {
                const data = snapshot.val();
                const result = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                console.log(`✅ Datos encontrados en ${storeName}:`, result);
                return result;
            }
            console.log(`⚠️ No hay datos en ${storeName}`);
            return [];
        } catch (error) {
            console.error(`❌ Error getting ${storeName}:`, error);
            return [];
        }
    }

    async add(storeName, data) {
        try {
            const db = this.getDatabase();
            const newRef = db.ref(`courses/${this.docenteId}/${storeName}`).push();
            await newRef.set(data);
            console.log(`✅ Guardado en Firebase: courses/${this.docenteId}/${storeName}/${newRef.key}`, data);
            return newRef.key;
        } catch (error) {
            console.error(`❌ Error adding to ${storeName}:`, error);
            alert(`Error al guardar en Firebase: ${error.message}`);
            throw error;
        }
    }

    async update(storeName, id, data) {
        try {
            const db = this.getDatabase();
            await db.ref(`courses/${this.docenteId}/${storeName}/${id}`).update(data);
        } catch (error) {
            console.error(`Error updating ${storeName}:`, error);
            throw error;
        }
    }

    async delete(storeName, id) {
        try {
            const db = this.getDatabase();
            await db.ref(`courses/${this.docenteId}/${storeName}/${id}`).remove();
        } catch (error) {
            console.error(`Error deleting from ${storeName}:`, error);
            throw error;
        }
    }

    // Specific methods for evaluations (many-to-many relationship)
    async getEvaluations() {
        try {
            const db = this.getDatabase();
            const snapshot = await db.ref(`courses/${this.docenteId}/evaluations`).once('value');
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
}

// Export singleton instance
const firebaseService = new FirebaseService();
export default firebaseService;