/**
 * UI Controller Module
 * 
 * Manages all user interface interactions and state.
 */

class UIController {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        
        // Initialize event listeners for UI interactions
        this.initEventListeners();
    }
    
    /**
     * Initialize event listeners for UI elements
     */
    initEventListeners() {
        // Add any additional UI-specific event listeners here
    }
    
    /**
     * Show the assessment wizard and hide the welcome screen
     */
    showAssessmentWizard() {
        document.getElementById('welcomeScreen').classList.add('d-none');
        document.getElementById('assessmentWizard').classList.remove('d-none');
        this.updateProgressBar();
    }
    
    /**
     * Reset the wizard to its initial state
     */
    resetWizard() {
        this.currentStep = 1;
        this.updateProgressBar();
        this.showStep(1);
        
        // Clear form inputs
        document.getElementById('orgName').value = '';
        document.getElementById('industrySector').value = '';
        document.getElementById('orgSize').value = '';
        document.getElementById('primaryObjectives').value = '';
        
        // Clear asset list
        this.clearAssetList();
        
        // Clear dependency assessment
        document.getElementById('dependencyAssessmentList').innerHTML = `
            <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                Please add assets in Step 2 before proceeding with the dependency assessment.
            </div>
        `;
        
        // Clear contingency evaluation
        document.getElementById('contingencyEvaluationList').innerHTML = '';
        
        // Show welcome screen
        document.getElementById('welcomeScreen').classList.remove('d-none');
        document.getElementById('assessmentWizard').classList.add('d-none');
        
        // Disable next step button if appropriate
        this.updateStepNavigation();
    }
    
    /**
     * Move to the next step in the assessment wizard
     */
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateProgressBar();
            this.updateStepNavigation();
        }
    }
    
    /**
     * Move to the previous step in the assessment wizard
     */
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgressBar();
            this.updateStepNavigation();
        }
    }
    
    /**
     * Show a specific step in the assessment wizard
     * @param {number} stepNumber - The step number to display
     */
    showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.assessment-step').forEach(step => {
            step.classList.add('d-none');
        });
        
        // Show the requested step
        document.getElementById(`step${stepNumber}`).classList.remove('d-none');
        
        // Update step indicator
        document.getElementById('currentStepIndicator').textContent = `Step ${stepNumber} of ${this.totalSteps}`;
    }
    
    /**
     * Update the progress bar based on current step
     */
    updateProgressBar() {
        const progressPercentage = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
        document.getElementById('progressBar').style.width = `${progressPercentage}%`;
    }
    
    /**
     * Update the state of the navigation buttons
     */
    updateStepNavigation() {
        // Previous button should be disabled on first step
        document.getElementById('prevStepBtn').disabled = (this.currentStep === 1);
        
        // Next button text should change on last step
        const nextBtn = document.getElementById('nextStepBtn');
        if (this.currentStep === this.totalSteps - 1) {
            nextBtn.innerHTML = 'Generate Results <i class="bi bi-check-circle ms-1"></i>';
        } else {
            nextBtn.innerHTML = 'Next <i class="bi bi-arrow-right ms-1"></i>';
        }
        
        // Next button visibility on last step
        if (this.currentStep === this.totalSteps) {
            nextBtn.classList.add('d-none');
        } else {
            nextBtn.classList.remove('d-none');
        }
    }
    
    /**
     * Enable navigation to all steps
     */
    enableAllSteps() {
        // This could be used when loading a completed assessment
    }
    
    /**
     * Get the current step number
     * @returns {number} The current step number
     */
    getCurrentStep() {
        return this.currentStep;
    }
    
    /**
     * Add an asset to the asset list in the UI
     * @param {Object} asset - The asset object to add
     */
    addAssetToList(asset) {
        const assetList = document.getElementById('assetList');
        
        // Create asset item
        const assetItem = document.createElement('div');
        assetItem.className = `card shadow-sm mb-3 asset-item ${asset.category}`;
        assetItem.id = `asset-${asset.id}`;
        
        // Create asset content
        assetItem.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 class="card-title">${asset.name}</h5>
                        <div class="text-muted small mb-2">Category: ${this.formatCategory(asset.category)}</div>
                        <div>${asset.description || 'No description provided.'}</div>
                    </div>
                    <button class="btn btn-sm btn-outline-danger delete-asset-btn" data-asset-id="${asset.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add delete functionality
        assetItem.querySelector('.delete-asset-btn').addEventListener('click', (e) => {
            const assetId = e.currentTarget.getAttribute('data-asset-id');
            this.deleteAsset(assetId);
        });
        
        // Add to the list
        assetList.appendChild(assetItem);
    }
    
    /**
     * Delete an asset from the UI
     * @param {string} assetId - The ID of the asset to delete
     */
    deleteAsset(assetId) {
        // Remove from UI
        const assetElement = document.getElementById(`asset-${assetId}`);
        if (assetElement) {
            assetElement.remove();
        }
        
        // This would typically also update the application state
        // and remove any dependency assessments for this asset
    }
    
    /**
     * Clear the asset list in the UI
     */
    clearAssetList() {
        document.getElementById('assetList').innerHTML = '';
    }
    
    /**
     * Format a category value for display
     * @param {string} category - The category value
     * @returns {string} The formatted category name
     */
    formatCategory(category) {
        const categoryMap = {
            'people': 'People',
            'systems': 'Systems & Technology',
            'relationships': 'Partnerships & Relationships',
            'facilities': 'Facilities & Equipment',
            'knowledge': 'Intellectual Property',
            'market': 'Market Access & Channels',
            'other': 'Other'
        };
        
        return categoryMap[category] || category;
    }
    
    /**
     * Update dependency assessment forms based on assets
     * @param {Array} assets - The array of asset objects
     */
    updateDependencyAssessmentForms(assets) {
        const dependencyAssessmentList = document.getElementById('dependencyAssessmentList');
        dependencyAssessmentList.innerHTML = '';
        
        if (!assets || assets.length === 0) {
            dependencyAssessmentList.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    Please add assets in Step 2 before proceeding with the dependency assessment.
                </div>
            `;
            return;
        }
        
        assets.forEach(asset => {
            const assetForm = document.createElement('div');
            assetForm.className = 'card shadow-sm mb-4';
            assetForm.id = `dependency-form-${asset.id}`;
            
            assetForm.innerHTML = `
                <div class="card-header">
                    <h5 class="mb-0">${asset.name}</h5>
                    <div class="text-muted small">${this.formatCategory(asset.category)}</div>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label for="importance-${asset.id}" class="form-label">Importance: How critical is this asset to your operations?</label>
                        <input type="range" class="form-range dependency-slider" id="importance-${asset.id}" min="1" max="10" value="5">
                        <div class="rating-labels">
                            <span>Low Importance</span>
                            <span>Medium</span>
                            <span>Critical</span>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="replaceability-${asset.id}" class="form-label">Replaceability: How difficult would it be to replace?</label>
                        <input type="range" class="form-range dependency-slider" id="replaceability-${asset.id}" min="1" max="10" value="5">
                        <div class="rating-labels">
                            <span>Easily Replaceable</span>
                            <span>Moderate</span>
                            <span>Very Difficult</span>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="timeToReplace-${asset.id}" class="form-label">Time to Replace: How long would replacement take?</label>
                        <select class="form-select" id="timeToReplace-${asset.id}">
                            <option value="days">Days</option>
                            <option value="weeks" selected>Weeks</option>
                            <option value="months">Months</option>
                            <option value="years">Years</option>
                        </select>
                    </div>
                    
                    <div class="mb-3">
                        <label for="concentration-${asset.id}" class="form-label">Concentration Risk: How concentrated is your dependency?</label>
                        <input type="range" class="form-range dependency-slider" id="concentration-${asset.id}" min="1" max="10" value="5">
                        <div class="rating-labels">
                            <span>Well Distributed</span>
                            <span>Moderate</span>
                            <span>Highly Concentrated</span>
                        </div>
                    </div>
                </div>
            `;
            
            dependencyAssessmentList.appendChild(assetForm);
        });
    }
    
    /**
     * Update contingency evaluation forms
     * @param {Array} assets - The array of asset objects
     * @param {Array} dependencies - The array of dependency objects
     */
    updateContingencyForms(assets, dependencies) {
        const contingencyEvaluationList = document.getElementById('contingencyEvaluationList');
        contingencyEvaluationList.innerHTML = '';
        
        if (!assets || assets.length === 0) {
            contingencyEvaluationList.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    Please add assets and complete the dependency assessment before evaluating contingencies.
                </div>
            `;
            return;
        }
        
        // Sort assets by risk level (if dependencies are available)
        let assetList = [...assets];
        if (dependencies && dependencies.length > 0) {
            assetList.sort((a, b) => {
                const depA = dependencies.find(d => d.assetId === a.id);
                const depB = dependencies.find(d => d.assetId === b.id);
                
                if (!depA || !depB) return 0;
                
                const riskA = (depA.importance * depA.replaceability * depA.concentration) / 100;
                const riskB = (depB.importance * depB.replaceability * depB.concentration) / 100;
                
                return riskB - riskA; // Sort descending by risk
            });
        }
        
        assetList.forEach(asset => {
            const contingencyForm = document.createElement('div');
            contingencyForm.className = 'card shadow-sm mb-4';
            contingencyForm.id = `contingency-form-${asset.id}`;
            
            // Calculate risk level if dependencies are available
            let riskLevel = 'Unknown';
            let riskClass = '';
            
            if (dependencies) {
                const dep = dependencies.find(d => d.assetId === asset.id);
                if (dep) {
                    const riskScore = (dep.importance * dep.replaceability * dep.concentration) / 100;
                    
                    if (riskScore > 7) {
                        riskLevel = 'High Risk';
                        riskClass = 'risk-high';
                    } else if (riskScore > 4) {
                        riskLevel = 'Medium Risk';
                        riskClass = 'risk-medium';
                    } else {
                        riskLevel = 'Low Risk';
                        riskClass = 'risk-low';
                    }
                }
            }
            
            contingencyForm.innerHTML = `
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="mb-0">${asset.name}</h5>
                            <div class="text-muted small">${this.formatCategory(asset.category)}</div>
                        </div>
                        <span class="badge ${riskClass}">${riskLevel}</span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label for="backup-${asset.id}" class="form-label">Backup/Redundancy: Do you have backup systems or alternatives?</label>
                        <input type="range" class="form-range dependency-slider" id="backup-${asset.id}" min="1" max="10" value="5">
                        <div class="rating-labels">
                            <span>No Backup</span>
                            <span>Partial</span>
                            <span>Full Redundancy</span>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="knowledgeSharing-${asset.id}" class="form-label">Knowledge Sharing: Is knowledge distributed across multiple people?</label>
                        <input type="range" class="form-range dependency-slider" id="knowledgeSharing-${asset.id}" min="1" max="10" value="5">
                        <div class="rating-labels">
                            <span>No Sharing</span>
                            <span>Moderate</span>
                            <span>Widespread</span>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="documentation-${asset.id}" class="form-label">Documentation: How well documented are processes and systems?</label>
                        <input type="range" class="form-range dependency-slider" id="documentation-${asset.id}" min="1" max="10" value="5">
                        <div class="rating-labels">
                            <span>Poor</span>
                            <span>Moderate</span>
                            <span>Excellent</span>
                        </div>
                    </div>
                </div>
            `;
            
            contingencyEvaluationList.appendChild(contingencyForm);
        });
    }
}