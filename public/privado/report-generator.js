// Report Generator Module
// Handles report generation and AI analysis

export class ReportGenerator {
    constructor(firebaseService, oaData) {
        this.firebaseService = firebaseService;
        this.oaData = oaData;
    }

    async generateReport(type, studentId = null) {
        const [courses, students, tasks, evalMap] = await Promise.all([
            this.firebaseService.getAll('courses'),
            this.firebaseService.getAll('students'),
            this.firebaseService.getAll('tasks'),
            this.firebaseService.getEvaluationsMap()
        ]);

        const course = courses.find(c => c.id === this.firebaseService.docenteId);
        const courseStudents = students.filter(s => s.courseId === this.firebaseService.docenteId && !s.retirado);
        const courseTasks = tasks.filter(t => t.courseId === this.firebaseService.docenteId);

        if (type === 'grupal') {
            return this.generateGroupReport(course, courseStudents, courseTasks, evalMap);
        } else if (type === 'individual' && studentId) {
            const student = students.find(s => s.id === studentId);
            return this.generateIndividualReport(course, student, courseTasks, evalMap);
        } else if (type === 'students') {
            return this.generateStudentsAnalysis(course, courseStudents, courseTasks, evalMap);
        }
    }

    generateGroupReport(course, students, tasks, evalMap) {
        // Calculate statistics
        let stats = this.calculateGroupStats(students, tasks, evalMap);

        let html = '<div class="report-container">';
        html += '<div class="report-header">';
        html += '<h2><i class="fas fa-chart-bar"></i> Reporte Grupal - ' + (course?.name || '') + '</h2>';
        html += '<div class="student-info">Análisis de desempeño del curso completo</div>';
        html += '</div>';

        // Metrics
        html += this.generateMetricsSection(stats);

        // Task performance chart
        html += this.generateTaskChartSection(stats.taskCompletion);

        // OA progress
        html += this.generateOAProgressSection(stats.oaAnalysis);

        html += '</div>';
        return html;
    }

    generateIndividualReport(course, student, tasks, evalMap) {
        let html = '<div class="report-container">';
        html += '<div class="report-header">';
        html += '<h2><i class="fas fa-user-graduate"></i> Reporte Individual</h2>';
        html += '<div class="student-info">' + student.firstNames + ' ' + student.lastNames + '</div>';
        html += '</div>';

        // Individual metrics
        const studentStats = this.calculateIndividualStats(student, tasks, evalMap);
        html += this.generateIndividualMetricsSection(studentStats);

        // Task details
        html += this.generateTaskDetailsSection(studentStats.taskDetails);

        // OA achievements
        html += this.generateIndividualOASection(studentStats.oaProgress);

        html += '</div>';
        return html;
    }

    generateStudentsAnalysis(course, students, tasks, evalMap) {
        const analysis = this.analyzeStudentPerformance(students, tasks, evalMap);

        let html = '<div class="report-container">';
        html += '<div class="report-header">';
        html += '<h2><i class="fas fa-users"></i> Análisis de Estudiantes</h2>';
        html += '<div class="student-info">Distribución de rendimiento del curso</div>';
        html += '</div>';

        html += this.generatePerformanceDistribution(analysis);
        html += '</div>';
        return html;
    }

    calculateGroupStats(students, tasks, evalMap) {
        let stats = {
            totalStudents: students.length,
            totalTasks: tasks.length,
            completedTasks: 0,
            studentsCompletedAll: 0,
            taskCompletion: [],
            oaAnalysis: {}
        };

        students.forEach(st => {
            let studentCompleted = 0;
            tasks.forEach(t => {
                const existing = evalMap.get(t.id + ':' + st.id);
                if (existing && existing.value) {
                    studentCompleted++;
                    stats.completedTasks++;
                    if (t.oa) {
                        stats.oaAnalysis[t.oa] = stats.oaAnalysis[t.oa] || { completed: 0, total: 0 };
                        stats.oaAnalysis[t.oa].completed++;
                    }
                }
                if (t.oa) {
                    stats.oaAnalysis[t.oa] = stats.oaAnalysis[t.oa] || { completed: 0, total: 0 };
                    stats.oaAnalysis[t.oa].total++;
                }
            });
            if (studentCompleted === tasks.length) stats.studentsCompletedAll++;
        });

        tasks.forEach(t => {
            let completed = 0;
            students.forEach(st => {
                const existing = evalMap.get(t.id + ':' + st.id);
                if (existing && existing.value) completed++;
            });
            const percentage = ((completed/students.length)*100).toFixed(0);
            stats.taskCompletion.push({
                name: t.name,
                oa: t.oa,
                completed: completed,
                total: students.length,
                percentage: percentage
            });
        });

        return stats;
    }

    calculateIndividualStats(student, tasks, evalMap) {
        let completed = 0;
        let taskDetails = [];
        let oaProgress = {};

        tasks.forEach(t => {
            const existing = evalMap.get(t.id + ':' + student.id);
            const taskCompleted = existing ? !!existing.value : false;
            if (taskCompleted) completed++;

            taskDetails.push({
                name: t.name,
                oa: t.oa,
                date: t.date,
                completed: taskCompleted
            });

            if (t.oa) {
                if (!oaProgress[t.oa]) oaProgress[t.oa] = { completed: 0, total: 0 };
                oaProgress[t.oa].total++;
                if (taskCompleted) oaProgress[t.oa].completed++;
            }
        });

        const completionRate = ((completed / tasks.length) * 100).toFixed(0);
        const nota = (1 + (completed/tasks.length)*6).toFixed(1);

        return {
            completed,
            total: tasks.length,
            rate: completionRate,
            nota,
            taskDetails,
            oaProgress
        };
    }

    analyzeStudentPerformance(students, tasks, evalMap) {
        let analysis = {
            highPerformers: [],
            mediumPerformers: [],
            lowPerformers: [],
            distribution: { high: 0, medium: 0, low: 0 }
        };

        students.forEach(st => {
            let completed = 0;
            tasks.forEach(t => {
                const existing = evalMap.get(t.id + ':' + st.id);
                if (existing && existing.value) completed++;
            });

            const rate = ((completed / tasks.length) * 100);
            const student = {
                name: `${st.firstNames} ${st.lastNames}`,
                completed,
                total: tasks.length,
                rate: rate.toFixed(0)
            };

            if (rate >= 80) {
                analysis.highPerformers.push(student);
                analysis.distribution.high++;
            } else if (rate >= 50) {
                analysis.mediumPerformers.push(student);
                analysis.distribution.medium++;
            } else {
                analysis.lowPerformers.push(student);
                analysis.distribution.low++;
            }
        });

        return analysis;
    }

    generateMetricsSection(stats) {
        const promedioCurso = stats.totalStudents > 0 ? (stats.completedTasks / stats.totalStudents).toFixed(1) : '0.0';
        const notaPromedio = stats.totalTasks > 0 ? (1 + (parseFloat(promedioCurso)/stats.totalTasks)*6).toFixed(1) : '1.0';

        let html = '<div class="report-section">';
        html += '<h3><i class="fas fa-tachometer-alt"></i> Métricas Principales</h3>';
        html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">';
        html += `<div class="metric-card"><div class="metric-value">${stats.totalStudents}</div><div class="metric-label">Estudiantes Activos</div></div>`;
        html += `<div class="metric-card"><div class="metric-value">${stats.totalTasks}</div><div class="metric-label">Tareas Totales</div></div>`;
        html += `<div class="metric-card"><div class="metric-value">${stats.studentsCompletedAll}</div><div class="metric-label">Completaron Todo</div></div>`;
        html += `<div class="metric-card"><div class="metric-value">${notaPromedio}</div><div class="metric-label">Nota Promedio</div></div>`;
        html += '</div></div>';

        return html;
    }

    generateTaskChartSection(taskCompletion) {
        let html = '<div class="report-section">';
        html += '<h3><i class="fas fa-chart-line"></i> Desempeño por Tarea</h3>';
        html += '<div class="chart-container"><canvas id="taskChart" width="400" height="200"></canvas></div>';
        html += '<div style="margin-top: 20px;">';
        html += '<table style="width: 100%; border-collapse: collapse; margin-top: 15px;">';
        html += '<thead><tr style="background: #667eea; color: white;"><th style="padding: 10px; text-align: left;">Tarea</th><th style="padding: 10px;">OA</th><th style="padding: 10px;">Completaron</th><th style="padding: 10px;">%</th></tr></thead><tbody>';

        taskCompletion.forEach(t => {
            html += `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;">${t.name}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${t.oa||'-'}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${t.completed}/${t.total}</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${t.percentage}%</strong></td></tr>`;
        });

        html += '</tbody></table></div></div>';
        return html;
    }

    generateOAProgressSection(oaAnalysis) {
        if (!Object.keys(oaAnalysis).length) return '';

        let html = '<div class="report-section">';
        html += '<h3><i class="fas fa-bullseye"></i> Progreso por Objetivos de Aprendizaje</h3>';
        html += '<div class="oa-progress">';

        Object.keys(oaAnalysis).forEach(oa => {
            const data = oaAnalysis[oa];
            const percentage = data.total > 0 ? ((data.completed/data.total)*100).toFixed(0) : 0;
            const oaInfo = this.oaData[oa];
            html += '<div class="oa-card">';
            html += `<h4>${oa} - ${oaInfo?.titulo || 'Sin título'}</h4>`;
            html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">';
            html += `<span>Tareas logradas: ${data.completed}/${data.total}</span>`;
            html += `<span style="font-weight: bold; color: ${percentage >= 70 ? '#28a745' : percentage >= 50 ? '#ffc107' : '#dc3545'};">${percentage}%</span>`;
            html += '</div></div>';
        });

        html += '</div></div>';
        return html;
    }

    generateIndividualMetricsSection(stats) {
        let html = '<div class="report-section">';
        html += '<h3><i class="fas fa-chart-pie"></i> Resumen de Desempeño</h3>';
        html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">';
        html += `<div class="metric-card"><div class="metric-value">${stats.completed}/${stats.total}</div><div class="metric-label">Tareas Completadas</div></div>`;
        html += `<div class="metric-card"><div class="metric-value">${stats.rate}%</div><div class="metric-label">Tasa de Éxito</div></div>`;
        html += `<div class="metric-card"><div class="metric-value">${stats.nota}</div><div class="metric-label">Nota Final</div></div>`;
        html += `<div class="metric-card"><div class="metric-value">${Object.keys(stats.oaProgress).length}</div><div class="metric-label">OA Trabajados</div></div>`;
        html += '</div></div>';

        return html;
    }

    generateTaskDetailsSection(taskDetails) {
        let html = '<div class="report-section">';
        html += '<h3><i class="fas fa-tasks"></i> Detalle de Tareas</h3>';
        html += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px;">';

        taskDetails.forEach(t => {
            const statusClass = t.completed ? 'completed' : 'pending';
            const statusIcon = t.completed ? '✓' : '✗';
            html += '<div style="padding: 12px; border: 1px solid #eee; border-radius: 8px; background: ' + (t.completed ? '#f8fff8' : '#fff8f8') + ';">';
            html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">';
            html += `<strong style="font-size: 14px;">${t.name}</strong>`;
            html += `<span class="${statusClass}" style="font-size: 18px; font-weight: bold;">${statusIcon}</span>`;
            html += '</div>';
            html += '<div style="font-size: 12px; color: #666;">';
            if (t.oa) html += `<div>OA: ${t.oa}</div>`;
            if (t.date) html += `<div>Fecha: ${t.date}</div>`;
            html += '</div></div>';
        });

        html += '</div></div>';
        return html;
    }

    generateIndividualOASection(oaProgress) {
        if (!Object.keys(oaProgress).length) return '';

        let html = '<div class="report-section">';
        html += '<h3><i class="fas fa-bullseye"></i> Logros por Objetivos de Aprendizaje</h3>';
        html += '<div class="oa-progress">';

        Object.keys(oaProgress).forEach(oa => {
            const progress = oaProgress[oa];
            const percentage = ((progress.completed/progress.total)*100).toFixed(0);
            const oaInfo = this.oaData[oa];
            const totalTasksForOA = progress.total;
            const completed = progress.completed;

            html += '<div class="oa-card">';
            html += `<h4>${oa} - ${oaInfo?.titulo || 'Sin título'}</h4>`;
            html += '<div style="margin-top: 10px;">';
            html += '<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">';
            html += `<span>Tareas completadas: ${completed}/${totalTasksForOA}</span>`;
            html += `<span style="font-weight: bold; color: ${percentage >= 80 ? '#28a745' : percentage >= 60 ? '#ffc107' : '#dc3545'};">${percentage}%</span>`;
            html += '</div></div>';
        });

        html += '</div></div>';
        return html;
    }

    generatePerformanceDistribution(analysis) {
        let html = '<div class="report-section">';
        html += '<h3><i class="fas fa-chart-bar"></i> Distribución de Rendimiento</h3>';
        html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">';
        html += `<div class="metric-card" style="background: linear-gradient(135deg, #28a745, #20c997);"><div class="metric-value">${analysis.distribution.high}</div><div class="metric-label">Alto (80-100%)</div></div>`;
        html += `<div class="metric-card" style="background: linear-gradient(135deg, #ffc107, #fd7e14);"><div class="metric-value">${analysis.distribution.medium}</div><div class="metric-label">Medio (50-79%)</div></div>`;
        html += `<div class="metric-card" style="background: linear-gradient(135deg, #dc3545, #e83e8c);"><div class="metric-value">${analysis.distribution.low}</div><div class="metric-label">Bajo (<50%)</div></div>`;
        html += '</div>';

        // Student lists
        ['high', 'medium', 'low'].forEach(level => {
            const students = analysis[level + 'Performers'];
            if (students.length > 0) {
                const levelNames = { high: 'Alto Rendimiento', medium: 'Rendimiento Medio', low: 'Bajo Rendimiento' };
                html += `<h4>${levelNames[level]} (${students.length} estudiantes)</h4>`;
                html += '<div style="margin-bottom: 20px;">';
                students.forEach(s => {
                    html += `<div style="padding: 8px; background: white; margin-bottom: 5px; border-radius: 4px; border-left: 3px solid #667eea;">`;
                    html += `${s.name}: ${s.completed}/${s.total} tareas (${s.rate}%)`;
                    html += '</div>';
                });
                html += '</div>';
            }
        });

        html += '</div>';
        return html;
    }
}