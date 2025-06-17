/**
 * Storage Manager Module
 * 
 * Handles data persistence using browser localStorage.
 */

class StorageManager {
    constructor() {
        this.storageKey = 'strategic-resilience-planner';
    }
    
    /**
     * Save an assessment to localStorage
     * @param {Object} assessment - The assessment object to save
     * @param {string} [id] - Optional ID for updating an existing assessment
     * @returns {string} - The ID of the saved assessment
     */
    saveAssessment(assessment, id = null) {
        // Get existing assessments
        const assessments = this.getSavedAssessments() || [];
        
        // Generate an ID if not provided
        const assessmentId = id || this.generateId();
        
        // Prepare assessment data
        const assessmentData = {
            id: assessmentId,
            name: assessment.name || 'Unnamed Assessment',
            timestamp: assessment.timestamp || Date.now(),
            data: assessment
        };
        
        // Update existing or add new
        const existingIndex = assessments.findIndex(a => a.id === assessmentId);
        if (existingIndex >= 0) {
            assessments[existingIndex] = assessmentData;
        } else {
            assessments.push(assessmentData);
        }
        
        // Save to localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(assessments));
        
        return assessmentId;
    }
    
    /**
     * Get a saved assessment by ID
     * @param {string} id - The ID of the assessment to retrieve
     * @returns {Object|null} - The assessment object or null if not found
     */
    getAssessment(id) {
        const assessments = this.getSavedAssessments() || [];
        const assessment = assessments.find(a => a.id === id);
        
        return assessment ? assessment.data : null;
    }
    
    /**
     * Get all saved assessments
     * @returns {Array} - Array of assessment metadata objects
     */
    getSavedAssessments() {
        const data = localStorage.getItem(this.storageKey);
        
        try {
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error parsing saved assessments:', error);
            return [];
        }
    }
    
    /**
     * Delete an assessment by ID
     * @param {string} id - The ID of the assessment to delete
     * @returns {boolean} - True if successfully deleted, false otherwise
     */
    deleteAssessment(id) {
        const assessments = this.getSavedAssessments() || [];
        const initialLength = assessments.length;
        
        const filteredAssessments = assessments.filter(a => a.id !== id);
        
        if (filteredAssessments.length < initialLength) {
            localStorage.setItem(this.storageKey, JSON.stringify(filteredAssessments));
            return true;
        }
        
        return false;
    }
    
    /**
     * Export an assessment as JSON
     * @param {Object} assessment - The assessment to export
     * @returns {string} - JSON string representation of the assessment
     */
    exportAssessment(assessment) {
        return JSON.stringify(assessment, null, 2);
    }
    
    /**
     * Import an assessment from JSON
     * @param {string} json - JSON string representation of an assessment
     * @returns {Object|null} - The imported assessment object or null if invalid
     */
    importAssessment(json) {
        try {
            return JSON.parse(json);
        } catch (error) {
            console.error('Error importing assessment:', error);
            return null;
        }
    }
    
    /**
     * Generate a unique ID
     * @returns {string} - A unique ID string
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    /**
     * Clear all saved assessments
     * @returns {boolean} - True if successfully cleared
     */
    clearAllAssessments() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error clearing assessments:', error);
            return false;
        }
    }
    
    /**
     * Check if localStorage is available
     * @returns {boolean} - True if localStorage is available
     */
    isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
}