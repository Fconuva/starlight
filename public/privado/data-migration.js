// Data Migration Module
// Handles migration from IndexedDB to Firebase

const DB_NAME = 'EvaluacionDB';

export class DataMigration {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
        this.db = null;
    }

    async checkMigrationNeeded() {
        try {
            // Check if IndexedDB has data
            const indexedDBData = await this.getIndexedDBData();
            if (indexedDBData.totalRecords > 0) {
                // Check if Firebase has data
                const firebaseCourses = await this.firebaseService.getAll('courses');
                const firebaseStudents = await this.firebaseService.getAll('students');
                const firebaseTasks = await this.firebaseService.getAll('tasks');
                const firebaseEvaluations = await this.firebaseService.getEvaluations();

                const firebaseTotal = firebaseCourses.length + firebaseStudents.length +
                                    firebaseTasks.length + firebaseEvaluations.length;

                return firebaseTotal === 0; // Migrate if Firebase is empty but IndexedDB has data
            }
            return false;
        } catch (error) {
            console.error('Error checking migration need:', error);
            return false;
        }
    }

    async getIndexedDBData() {
        return new Promise((resolve) => {
            const request = indexedDB.open(DB_NAME + this.firebaseService.docenteId, 1);
            request.onerror = () => resolve({ totalRecords: 0 });
            request.onsuccess = async (e) => {
                this.db = e.target.result;
                try {
                    const courses = await this.getAllFromIndexedDB('courses');
                    const students = await this.getAllFromIndexedDB('students');
                    const tasks = await this.getAllFromIndexedDB('tasks');
                    const evaluations = await this.getAllFromIndexedDB('evaluations');
                    resolve({
                        totalRecords: courses.length + students.length + tasks.length + evaluations.length,
                        courses, students, tasks, evaluations
                    });
                } catch (error) {
                    resolve({ totalRecords: 0 });
                }
            };
            request.onupgradeneeded = (e) => {
                this.db = e.target.result;
                ['courses', 'students', 'tasks', 'evaluations'].forEach(store => {
                    if (!this.db.objectStoreNames.contains(store)) {
                        this.db.createObjectStore(store, { keyPath: 'id', autoIncrement: true });
                    }
                });
            };
        });
    }

    async getAllFromIndexedDB(storeName) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve([]);
                return;
            }

            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }

    async migrateToFirebase() {
        try {
            console.log('🚀 Iniciando migración de IndexedDB a Firebase...');

            const indexedDBData = await this.getIndexedDBData();
            console.log(`📊 Datos encontrados en IndexedDB: ${indexedDBData.totalRecords} registros`);

            // Create progress modal
            const progressModal = this.createProgressModal();

            let progress = 0;
            const totalSteps = 4;

            // Migrate courses
            this.updateProgressModal(progressModal, ++progress / totalSteps * 100, 'Migrando cursos...');
            for (const course of indexedDBData.courses) {
                await this.firebaseService.add('courses', course);
                console.log(`✅ Migrado curso: ${course.name}`);
            }

            // Migrate students
            this.updateProgressModal(progressModal, ++progress / totalSteps * 100, 'Migrando estudiantes...');
            for (const student of indexedDBData.students) {
                await this.firebaseService.add('students', student);
                console.log(`✅ Migrado estudiante: ${student.firstNames} ${student.lastNames}`);
            }

            // Migrate tasks
            this.updateProgressModal(progressModal, ++progress / totalSteps * 100, 'Migrando tareas...');
            for (const task of indexedDBData.tasks) {
                await this.firebaseService.add('tasks', task);
                console.log(`✅ Migrada tarea: ${task.name}`);
            }

            // Migrate evaluations
            this.updateProgressModal(progressModal, ++progress / totalSteps * 100, 'Migrando evaluaciones...');
            for (const evaluation of indexedDBData.evaluations) {
                await this.firebaseService.add('evaluations', evaluation);
                console.log(`✅ Migrada evaluación: ${evaluation.taskId} - ${evaluation.studentId}`);
            }

            // Complete migration
            this.updateProgressModal(progressModal, 100, '¡Migración completada!');
            console.log('🎉 Migración completada exitosamente!');

            // Wait a moment then remove modal
            setTimeout(() => {
                this.removeProgressModal(progressModal);
                alert('¡Migración completada! Tus datos ahora están en la nube.');
            }, 1500);

            return true;
        } catch (error) {
            console.error('❌ Error durante la migración:', error);
            alert('Error durante la migración. Por favor, contacta al soporte.');
            return false;
        }
    }

    createProgressModal() {
        const modal = document.createElement('div');
        modal.id = 'migrationModal';
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">Migrando datos a Firebase</div>
                <div style="padding: 20px; text-align: center;">
                    <div style="margin-bottom: 20px;">
                        <i class="fas fa-cloud-upload-alt" style="font-size: 48px; color: #667eea;"></i>
                    </div>
                    <p id="migrationMessage">Estamos migrando tus datos locales a la nube de Firebase para un mejor acceso y respaldo.</p>
                    <p style="font-size: 14px; color: #666; margin-top: 10px;">Esto puede tomar unos momentos...</p>
                    <div style="margin-top: 20px;">
                        <div class="progress-bar">
                            <div class="progress-fill" id="migrationProgress" style="width: 0%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    updateProgressModal(modal, percentage, message) {
        const progressFill = modal.querySelector('#migrationProgress');
        const messageEl = modal.querySelector('#migrationMessage');

        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        if (messageEl) {
            messageEl.textContent = message;
        }
    }

    removeProgressModal(modal) {
        if (modal && modal.parentElement) {
            document.body.removeChild(modal);
        }
    }
}