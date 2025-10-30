// UI Helpers Module
// Handles DOM manipulation and UI-related functions

export class UIHelpers {
    static showLoading(message = 'Cargando...') {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loadingOverlay';
        loadingOverlay.innerHTML = `
            <div class="spinner"></div>
            <p>${message}</p>
        `;
        document.body.appendChild(loadingOverlay);
    }

    static hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            document.body.removeChild(loadingOverlay);
        }
    }

    static showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    static closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    static showAlert(message, type = 'info') {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;

        // Add to page
        document.body.appendChild(alertDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 5000);
    }

    static createStudentRow(student, courseTasks, evalMap) {
        const apellidos = (student.lastNames || '').trim().split(/\s+/);
        const paterno = apellidos[0] || '';
        const materno = apellidos.slice(1).join(' ') || '';
        let puntos = 0;
        const isRetirado = student.retirado || false;
        const rowClass = isRetirado ? 'student-retirado' : '';

        let html = `<tr class="${rowClass}">`;
        html += `<td class="col-num">${student.number || ''}</td>`;
        html += `<td class="col-apellido-p">${paterno}</td>`;
        html += `<td class="col-apellido-m">${materno}</td>`;
        html += `<td class="col-nombre">${student.firstNames}</td>`;

        courseTasks.forEach(task => {
            const existing = evalMap.get(task.id + ':' + student.id);
            const checked = existing ? !!existing.value : false;
            if (checked && !isRetirado) puntos++;
            html += `<td><input type="checkbox" ${checked ? 'checked' : ''} onchange="upsertEvaluation('${task.id}', '${student.id}', this.checked)" ${isRetirado ? 'disabled' : ''}></td>`;
        });

        const max = courseTasks.length || 1;
        const nota = max > 0 ? (1 + (puntos/max)*6).toFixed(1) : '1.0';
        html += `<td class="col-puntos">${puntos}</td>`;
        html += `<td class="col-nota">${nota}</td>`;
        html += `<td class="col-acciones"><button class="btn-small" onclick="editStudent('${student.id}')">Editar</button></td>`;
        html += '</tr>';

        return html;
    }

    static createTaskHeader(task, oaData) {
        let oaInfo = '';
        if (task.oa && oaData[task.oa]) {
            oaInfo = '<br><small style="color: #666;">' + task.oa + '</small>';
            if (task.indicators && task.indicators.length > 0) {
                oaInfo += '<br><small style="color: #888; font-size: 9px;">' + task.indicators.length + ' indicador(es)</small>';
            }
        }
        oaInfo += '<br><button class="btn-small" onclick="editTask(\'' + task.id + '\')" style="font-size: 9px; padding: 2px 4px; margin-top: 2px;">Editar</button>';
        return '<th class="task-header">' + task.name + oaInfo + '<span class="task-subtitle">' + (task.date || '') + '</span></th>';
    }

    static updateCourseSelect(courses) {
        const select = document.getElementById('courseSelect');
        select.innerHTML = '<option value="">-- Seleccionar --</option>';
        courses.forEach(course => {
            const opt = document.createElement('option');
            opt.value = course.id;
            opt.textContent = `${course.name} (${course.letter}-${course.type})`;
            select.appendChild(opt);
        });
        console.log('✅ Dropdown de cursos actualizado con', courses.length, 'cursos');
    }

    static updateMetaInfo(course, activeStudents, courseTasks) {
        const meta = document.getElementById('meta');
        meta.textContent = `${course?.name || ''} - ${activeStudents.length} estudiantes activos (${courseStudents.length} total), ${courseTasks.length} tareas`;
    }

    static clearFormFields(...fieldIds) {
        fieldIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = '';
            }
        });
    }

    static setFormFieldValue(fieldId, value) {
        const element = document.getElementById(fieldId);
        if (element) {
            element.value = value;
        }
    }

    static getFormFieldValue(fieldId) {
        const element = document.getElementById(fieldId);
        return element ? element.value : '';
    }

    static enableButton(button, enabled = true) {
        if (button) {
            button.disabled = !enabled;
            button.innerHTML = enabled ? button.originalText || button.innerHTML : '<span class="ai-loading"></span>Procesando...';
        }
    }

    static createProgressModal(title, message) {
        const modal = document.createElement('div');
        modal.id = 'progressModal';
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">${title}</div>
                <div style="padding: 20px; text-align: center;">
                    <div style="margin-bottom: 20px;">
                        <i class="fas fa-cloud-upload-alt" style="font-size: 48px; color: #667eea;"></i>
                    </div>
                    <p>${message}</p>
                    <div style="margin-top: 20px;">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill" style="width: 0%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    static updateProgress(percentage) {
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
    }

    static removeProgressModal() {
        const modal = document.getElementById('progressModal');
        if (modal) {
            document.body.removeChild(modal);
        }
    }
}

// Utility functions for common operations
export const uiHelpers = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    calculateGrade(points, totalTasks) {
        if (totalTasks === 0) return '1.0';
        return (1 + (points / totalTasks) * 6).toFixed(1);
    },

    validateRequired(value, fieldName) {
        if (!value || value.trim() === '') {
            throw new Error(`${fieldName} es obligatorio`);
        }
        return value.trim();
    }
};