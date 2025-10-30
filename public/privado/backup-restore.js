// Backup and Restore Module
// Handles data backup and restore functionality

export class BackupRestore {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }

    // Create a complete backup of all data
    async createBackup() {
        try {
            console.log('📦 Creating backup...');

            const [courses, students, tasks, evaluations] = await Promise.all([
                this.firebaseService.getAll('courses'),
                this.firebaseService.getAll('students'),
                this.firebaseService.getAll('tasks'),
                this.firebaseService.getEvaluations()
            ]);

            const backupData = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                docenteId: this.firebaseService.docenteId,
                data: {
                    courses,
                    students,
                    tasks,
                    evaluations
                },
                metadata: {
                    totalCourses: courses.length,
                    totalStudents: students.length,
                    totalTasks: tasks.length,
                    totalEvaluations: evaluations.length
                }
            };

            console.log('✅ Backup created:', backupData.metadata);
            return backupData;
        } catch (error) {
            console.error('❌ Error creating backup:', error);
            throw error;
        }
    }

    // Download backup as JSON file
    async downloadBackup() {
        try {
            const backupData = await this.createBackup();
            const dataStr = JSON.stringify(backupData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `backup_docente_${this.firebaseService.docenteId}_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log('📥 Backup downloaded successfully');
            return true;
        } catch (error) {
            console.error('❌ Error downloading backup:', error);
            throw error;
        }
    }

    // Restore data from backup file
    async restoreFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const backupData = JSON.parse(e.target.result);
                    await this.restoreBackup(backupData);
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Error reading file'));
            reader.readAsText(file);
        });
    }

    // Restore data from backup object
    async restoreBackup(backupData) {
        try {
            console.log('🔄 Starting restore process...');

            // Validate backup format
            if (!backupData.version || !backupData.data) {
                throw new Error('Invalid backup format');
            }

            // Confirm restore operation
            const confirmMessage = `¿Restaurar datos desde backup?

Backup del: ${new Date(backupData.timestamp).toLocaleString()}
Docente: ${backupData.docenteId}

Datos a restaurar:
- ${backupData.metadata.totalCourses} cursos
- ${backupData.metadata.totalStudents} estudiantes
- ${backupData.metadata.totalTasks} tareas
- ${backupData.metadata.totalEvaluations} evaluaciones

⚠️ Esto reemplazará todos los datos actuales. ¿Continuar?`;

            if (!confirm(confirmMessage)) {
                return false;
            }

            // Clear existing data
            console.log('🧹 Clearing existing data...');
            await this.clearAllData();

            // Restore data in order
            const { courses, students, tasks, evaluations } = backupData.data;

            // Restore courses
            console.log('📚 Restoring courses...');
            for (const course of courses) {
                await this.firebaseService.add('courses', course);
            }

            // Restore students
            console.log('👥 Restoring students...');
            for (const student of students) {
                await this.firebaseService.add('students', student);
            }

            // Restore tasks
            console.log('📋 Restoring tasks...');
            for (const task of tasks) {
                await this.firebaseService.add('tasks', task);
            }

            // Restore evaluations
            console.log('✅ Restoring evaluations...');
            for (const evaluation of evaluations) {
                await this.firebaseService.add('evaluations', evaluation);
            }

            console.log('🎉 Restore completed successfully!');
            return true;

        } catch (error) {
            console.error('❌ Error during restore:', error);
            throw error;
        }
    }

    // Clear all data for the current docente
    async clearAllData() {
        try {
            const [courses, students, tasks, evaluations] = await Promise.all([
                this.firebaseService.getAll('courses'),
                this.firebaseService.getAll('students'),
                this.firebaseService.getAll('tasks'),
                this.firebaseService.getEvaluations()
            ]);

            // Delete in reverse order to avoid dependency issues
            for (const evaluation of evaluations) {
                await this.firebaseService.delete('evaluations', evaluation.id);
            }

            for (const task of tasks) {
                await this.firebaseService.delete('tasks', task.id);
            }

            for (const student of students) {
                await this.firebaseService.delete('students', student.id);
            }

            for (const course of courses) {
                await this.firebaseService.delete('courses', course.id);
            }

            console.log('🗑️ All data cleared');
        } catch (error) {
            console.error('❌ Error clearing data:', error);
            throw error;
        }
    }

    // Export data to CSV format
    async exportToCSV() {
        try {
            const [courses, students, tasks, evaluations] = await Promise.all([
                this.firebaseService.getAll('courses'),
                this.firebaseService.getAll('students'),
                this.firebaseService.getAll('tasks'),
                this.firebaseService.getEvaluations()
            ]);

            // Create CSV content
            let csvContent = 'Curso,Estudiante,Tarea,Estado,Fecha,Puntos\n';

            for (const course of courses) {
                const courseStudents = students.filter(s => s.courseId === course.id);
                const courseTasks = tasks.filter(t => t.courseId === course.id);

                for (const student of courseStudents) {
                    for (const task of courseTasks) {
                        const evaluation = evaluations.find(e =>
                            e.taskId === task.id && e.studentId === student.id
                        );
                        const status = evaluation ? (evaluation.value ? 'Completado' : 'Pendiente') : 'No evaluado';
                        const points = evaluation && evaluation.value ? '1' : '0';

                        csvContent += `"${course.name}","${student.firstNames} ${student.lastNames}","${task.name}","${status}","${task.date || ''}","${points}"\n`;
                    }
                }
            }

            // Download CSV
            const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `evaluaciones_docente_${this.firebaseService.docenteId}_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log('📊 CSV export completed');
            return true;
        } catch (error) {
            console.error('❌ Error exporting to CSV:', error);
            throw error;
        }
    }

    // Get backup statistics
    async getBackupStats() {
        try {
            const [courses, students, tasks, evaluations] = await Promise.all([
                this.firebaseService.getAll('courses'),
                this.firebaseService.getAll('students'),
                this.firebaseService.getAll('tasks'),
                this.firebaseService.getEvaluations()
            ]);

            return {
                courses: courses.length,
                students: students.length,
                tasks: tasks.length,
                evaluations: evaluations.length,
                lastBackup: localStorage.getItem(`lastBackup_${this.firebaseService.docenteId}`) || null
            };
        } catch (error) {
            console.error('❌ Error getting backup stats:', error);
            return null;
        }
    }

    // Auto-backup functionality
    async scheduleAutoBackup(intervalHours = 24) {
        const lastBackup = localStorage.getItem(`lastBackup_${this.firebaseService.docenteId}`);
        const now = Date.now();

        if (!lastBackup || (now - parseInt(lastBackup)) > (intervalHours * 60 * 60 * 1000)) {
            try {
                await this.createBackup();
                localStorage.setItem(`lastBackup_${this.firebaseService.docenteId}`, now.toString());
                console.log('🔄 Auto-backup completed');
            } catch (error) {
                console.error('❌ Auto-backup failed:', error);
            }
        }
    }
}