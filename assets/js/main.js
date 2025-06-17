/**
 * Strategic Resilience Planner - Main Application Script
 * 
 * This script initializes the application and connects all components.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI Controller
    const uiController = new UIController();
    
    // Initialize Storage Manager
    const storageManager = new StorageManager();
    
    // Initialize Assessment Engine
    const assessmentEngine = new AssessmentEngine();
    
    // Initialize Visualization Module
    const visualization = new Visualization();
    
    // Initialize Recommendation System
    const recommendations = new RecommendationSystem();
    
    // Application State
    let currentAssessment = null;
    let currentAssessmentId = null;
    
    // Event Listeners
    document.getElementById('startAssessmentBtn').addEventListener('click', function() {
        uiController.showAssessmentWizard();
    });
    
    document.getElementById('nextStepBtn').addEventListener('click', function() {
        uiController.nextStep();
        if (uiController.getCurrentStep() === 5) {
            // Generate results when reaching the final step
            generateResults();
        }
    });
    
    document.getElementById('prevStepBtn').addEventListener('click', function() {
        uiController.previousStep();
    });
    
    document.getElementById('addAssetBtn').addEventListener('click', function() {
        const assetName = document.getElementById('assetName').value;
        const assetCategory = document.getElementById('assetCategory').value;
        const assetDescription = document.getElementById('assetDescription').value;
        
        if (assetName && assetCategory) {
            const asset = {
                id: Date.now(),
                name: assetName,
                category: assetCategory,
                description: assetDescription
            };
            
            // Add to assessment
            if (!currentAssessment) {
                currentAssessment = { assets: [] };
            }
            if (!currentAssessment.assets) {
                currentAssessment.assets = [];
            }
            
            currentAssessment.assets.push(asset);
            
            // Update UI
            uiController.addAssetToList(asset);
            
            // Clear form
            document.getElementById('assetName').value = '';
            document.getElementById('assetCategory').value = '';
            document.getElementById('assetDescription').value = '';
            
            // Update Step 3 with dependency assessment forms
            uiController.updateDependencyAssessmentForms(currentAssessment.assets);
        } else {
            alert('Please provide both a name and category for the asset.');
        }
    });
    
    document.getElementById('saveBtn').addEventListener('click', function() {
        // Show save modal
        const saveModal = new bootstrap.Modal(document.getElementById('saveModal'));
        saveModal.show();
    });
    
    document.getElementById('loadBtn').addEventListener('click', function() {
        // Populate saved assessments list
        const savedAssessments = storageManager.getSavedAssessments();
        const savedAssessmentsList = document.getElementById('savedAssessmentsList');
        const noSavedAssessments = document.getElementById('noSavedAssessments');
        
        savedAssessmentsList.innerHTML = '';
        
        if (savedAssessments && savedAssessments.length > 0) {
            noSavedAssessments.classList.add('d-none');
            savedAssessments.forEach(assessment => {
                const item = document.createElement('div');
                item.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
                
                const contentDiv = document.createElement('div');
                const title = document.createElement('h6');
                title.className = 'mb-1';
                title.textContent = assessment.name;
                
                const date = document.createElement('small');
                date.className = 'text-muted';
                date.textContent = new Date(assessment.timestamp).toLocaleString();
                
                contentDiv.appendChild(title);
                contentDiv.appendChild(date);
                
                const btnGroup = document.createElement('div');
                
                const loadBtn = document.createElement('button');
                loadBtn.className = 'btn btn-sm btn-primary me-2';
                loadBtn.textContent = 'Load';
                loadBtn.addEventListener('click', function() {
                    loadAssessment(assessment.id);
                    bootstrap.Modal.getInstance(document.getElementById('loadModal')).hide();
                });
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn btn-sm btn-outline-danger';
                deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    confirmDeleteAssessment(assessment.id);
                });
                
                btnGroup.appendChild(loadBtn);
                btnGroup.appendChild(deleteBtn);
                
                item.appendChild(contentDiv);
                item.appendChild(btnGroup);
                savedAssessmentsList.appendChild(item);
            });
        } else {
            noSavedAssessments.classList.remove('d-none');
        }
        
        // Show load modal
        const loadModal = new bootstrap.Modal(document.getElementById('loadModal'));
        loadModal.show();
    });
    
    document.getElementById('confirmSaveBtn').addEventListener('click', function() {
        const assessmentName = document.getElementById('assessmentName').value || 'Resilience Assessment';
        
        // Gather current assessment data
        currentAssessment.name = assessmentName;
        currentAssessment.timestamp = Date.now();
        currentAssessment.organizationProfile = {
            name: document.getElementById('orgName').value,
            industry: document.getElementById('industrySector').value,
            size: document.getElementById('orgSize').value,
            objectives: document.getElementById('primaryObjectives').value
        };
        
        // Save assessment
        const savedId = storageManager.saveAssessment(currentAssessment, currentAssessmentId);
        currentAssessmentId = savedId;
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('saveModal')).hide();
        
        // Notify user
        alert('Assessment saved successfully!');
    });
    
    document.getElementById('exportReportBtn').addEventListener('click', function() {
        if (currentAssessment) {
            exportReport(currentAssessment);
        }
    });
    
    document.getElementById('restartAssessmentBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to start a new assessment? Any unsaved changes will be lost.')) {
            resetAssessment();
            uiController.resetWizard();
        }
    });
    
    // Initialize a new empty assessment
    function resetAssessment() {
        currentAssessment = {
            assets: [],
            dependencies: [],
            contingencies: [],
            resilienceScore: 0,
            recommendations: {
                quickWins: [],
                mediumTerm: [],
                longTerm: []
            }
        };
        currentAssessmentId = null;
    }
    
    // Load an existing assessment
    function loadAssessment(id) {
        const assessment = storageManager.getAssessment(id);
        if (assessment) {
            currentAssessment = assessment;
            currentAssessmentId = id;
            
            // Populate organization profile
            if (assessment.organizationProfile) {
                document.getElementById('orgName').value = assessment.organizationProfile.name || '';
                document.getElementById('industrySector').value = assessment.organizationProfile.industry || '';
                document.getElementById('orgSize').value = assessment.organizationProfile.size || '';
                document.getElementById('primaryObjectives').value = assessment.organizationProfile.objectives || '';
            }
            
            // Populate asset list
            if (assessment.assets && assessment.assets.length > 0) {
                uiController.clearAssetList();
                assessment.assets.forEach(asset => {
                    uiController.addAssetToList(asset);
                });
                
                // Update dependency assessment forms
                uiController.updateDependencyAssessmentForms(assessment.assets);
                
                // Populate dependency ratings if available
                if (assessment.dependencies && assessment.dependencies.length > 0) {
                    assessment.dependencies.forEach(dep => {
                        const importanceSlider = document.getElementById(`importance-${dep.assetId}`);
                        const replaceabilitySlider = document.getElementById(`replaceability-${dep.assetId}`);
                        const timeToReplaceSelect = document.getElementById(`timeToReplace-${dep.assetId}`);
                        const concentrationSlider = document.getElementById(`concentration-${dep.assetId}`);
                        
                        if (importanceSlider) importanceSlider.value = dep.importance;
                        if (replaceabilitySlider) replaceabilitySlider.value = dep.replaceability;
                        if (timeToReplaceSelect) timeToReplaceSelect.value = dep.timeToReplace;
                        if (concentrationSlider) concentrationSlider.value = dep.concentration;
                    });
                }
                
                // Populate contingency evaluations if available
                if (assessment.contingencies && assessment.contingencies.length > 0) {
                    uiController.updateContingencyForms(assessment.assets, assessment.dependencies);
                    
                    assessment.contingencies.forEach(cont => {
                        const backupSlider = document.getElementById(`backup-${cont.assetId}`);
                        const knowledgeSharingSlider = document.getElementById(`knowledgeSharing-${cont.assetId}`);
                        const documentationSlider = document.getElementById(`documentation-${cont.assetId}`);
                        
                        if (backupSlider) backupSlider.value = cont.backup;
                        if (knowledgeSharingSlider) knowledgeSharingSlider.value = cont.knowledgeSharing;
                        if (documentationSlider) documentationSlider.value = cont.documentation;
                    });
                }
            }
            
            // Show assessment wizard
            uiController.showAssessmentWizard();
            
            // If results are available, allow navigation to results tab
            if (assessment.resilienceScore !== undefined) {
                uiController.enableAllSteps();
            }
        }
    }
    
    // Generate assessment results
    function generateResults() {
        // Gather all data from forms
        gatherAssessmentData();
        
        // Calculate resilience score
        const resilienceScore = assessmentEngine.calculateResilienceScore(currentAssessment);
        currentAssessment.resilienceScore = resilienceScore;
        
        // Generate recommendations
        const recommendationResults = recommendations.generateRecommendations(currentAssessment);
        currentAssessment.recommendations = recommendationResults;
        
        // Update results UI
        updateResultsUI();
    }
    
    // Gather all assessment data from forms
    function gatherAssessmentData() {
        // Organization profile
        currentAssessment.organizationProfile = {
            name: document.getElementById('orgName').value,
            industry: document.getElementById('industrySector').value,
            size: document.getElementById('orgSize').value,
            objectives: document.getElementById('primaryObjectives').value
        };
        
        // Dependency assessments
        currentAssessment.dependencies = [];
        currentAssessment.assets.forEach(asset => {
            const importanceSlider = document.getElementById(`importance-${asset.id}`);
            const replaceabilitySlider = document.getElementById(`replaceability-${asset.id}`);
            const timeToReplaceSelect = document.getElementById(`timeToReplace-${asset.id}`);
            const concentrationSlider = document.getElementById(`concentration-${asset.id}`);
            
            if (importanceSlider && replaceabilitySlider && timeToReplaceSelect && concentrationSlider) {
                const dependency = {
                    assetId: asset.id,
                    importance: parseInt(importanceSlider.value),
                    replaceability: parseInt(replaceabilitySlider.value),
                    timeToReplace: timeToReplaceSelect.value,
                    concentration: parseInt(concentrationSlider.value)
                };
                
                currentAssessment.dependencies.push(dependency);
            }
        });
        
        // Contingency evaluations
        currentAssessment.contingencies = [];
        currentAssessment.assets.forEach(asset => {
            const backupSlider = document.getElementById(`backup-${asset.id}`);
            const knowledgeSharingSlider = document.getElementById(`knowledgeSharing-${asset.id}`);
            const documentationSlider = document.getElementById(`documentation-${asset.id}`);
            
            if (backupSlider && knowledgeSharingSlider && documentationSlider) {
                const contingency = {
                    assetId: asset.id,
                    backup: parseInt(backupSlider.value),
                    knowledgeSharing: parseInt(knowledgeSharingSlider.value),
                    documentation: parseInt(documentationSlider.value)
                };
                
                currentAssessment.contingencies.push(contingency);
            }
        });
    }
    
    // Update the results UI with assessment data
    function updateResultsUI() {
        // Update resilience score display
        const resilienceScoreElement = document.getElementById('resilienceScore');
        const resilienceScoreBar = document.getElementById('resilienceScoreBar');
        const resilienceScoreDescription = document.getElementById('resilienceScoreDescription');
        
        resilienceScoreElement.textContent = Math.round(currentAssessment.resilienceScore);
        resilienceScoreBar.style.width = `${currentAssessment.resilienceScore}%`;
        
        // Set color based on score
        let scoreColor, scoreText;
        if (currentAssessment.resilienceScore < 40) {
            scoreColor = 'bg-danger';
            scoreText = 'Your organization has significant vulnerabilities. Immediate action is recommended.';
        } else if (currentAssessment.resilienceScore < 70) {
            scoreColor = 'bg-warning';
            scoreText = 'Your organization has moderate resilience. There are opportunities for improvement.';
        } else {
            scoreColor = 'bg-success';
            scoreText = 'Your organization demonstrates strong resilience. Continue monitoring and enhancing your strategies.';
        }
        
        resilienceScoreBar.className = 'progress-bar';
        resilienceScoreBar.classList.add(scoreColor);
        resilienceScoreDescription.textContent = scoreText;
        
        // Update key risks list
        const keyRisksList = document.getElementById('keyRisksList');
        keyRisksList.innerHTML = '';
        
        const topRisks = assessmentEngine.identifyTopRisks(currentAssessment);
        
        if (topRisks.length === 0) {
            const noRisksItem = document.createElement('li');
            noRisksItem.className = 'list-group-item';
            noRisksItem.textContent = 'No significant risks identified.';
            keyRisksList.appendChild(noRisksItem);
        } else {
            topRisks.forEach(risk => {
                const asset = currentAssessment.assets.find(a => a.id === risk.assetId);
                if (asset) {
                    const riskItem = document.createElement('li');
                    riskItem.className = 'list-group-item';
                    
                    const riskTitle = document.createElement('div');
                    riskTitle.className = 'fw-bold';
                    
                    const riskLevel = document.createElement('span');
                    riskLevel.className = risk.riskScore > 7 ? 'risk-high' : (risk.riskScore > 4 ? 'risk-medium' : 'risk-low');
                    riskLevel.textContent = `[${risk.riskScore > 7 ? 'High' : (risk.riskScore > 4 ? 'Medium' : 'Low')} Risk] `;
                    
                    riskTitle.appendChild(riskLevel);
                    riskTitle.appendChild(document.createTextNode(asset.name));
                    
                    const riskDetails = document.createElement('div');
                    riskDetails.className = 'small text-muted';
                    riskDetails.textContent = risk.reason;
                    
                    riskItem.appendChild(riskTitle);
                    riskItem.appendChild(riskDetails);
                    keyRisksList.appendChild(riskItem);
                }
            });
        }
        
        // Update recommendations
        const quickWinsList = document.getElementById('quickWinsList');
        const mediumTermList = document.getElementById('mediumTermList');
        const longTermList = document.getElementById('longTermList');
        
        quickWinsList.innerHTML = '';
        mediumTermList.innerHTML = '';
        longTermList.innerHTML = '';
        
        if (currentAssessment.recommendations) {
            // Quick wins
            if (currentAssessment.recommendations.quickWins.length === 0) {
                quickWinsList.innerHTML = '<li class="list-group-item">No quick win recommendations at this time.</li>';
            } else {
                currentAssessment.recommendations.quickWins.forEach(rec => {
                    const item = document.createElement('li');
                    item.className = 'list-group-item recommendation-item quick-win';
                    item.innerHTML = `<strong>${rec.title}</strong><div>${rec.description}</div>`;
                    quickWinsList.appendChild(item);
                });
            }
            
            // Medium term
            if (currentAssessment.recommendations.mediumTerm.length === 0) {
                mediumTermList.innerHTML = '<li class="list-group-item">No medium-term recommendations at this time.</li>';
            } else {
                currentAssessment.recommendations.mediumTerm.forEach(rec => {
                    const item = document.createElement('li');
                    item.className = 'list-group-item recommendation-item medium-term';
                    item.innerHTML = `<strong>${rec.title}</strong><div>${rec.description}</div>`;
                    mediumTermList.appendChild(item);
                });
            }
            
            // Long term
            if (currentAssessment.recommendations.longTerm.length === 0) {
                longTermList.innerHTML = '<li class="list-group-item">No long-term recommendations at this time.</li>';
            } else {
                currentAssessment.recommendations.longTerm.forEach(rec => {
                    const item = document.createElement('li');
                    item.className = 'list-group-item recommendation-item long-term';
                    item.innerHTML = `<strong>${rec.title}</strong><div>${rec.description}</div>`;
                    longTermList.appendChild(item);
                });
            }
        }
        
        // Generate and display dependency heatmap
        visualization.createDependencyHeatmap('dependencyHeatmap', currentAssessment);
    }
    
    // Export assessment as PDF report
    function exportReport(assessment) {
        alert('PDF export functionality would be implemented here. This would generate a detailed report of your assessment results.');
    }
    
    // Confirm deletion of an assessment
    function confirmDeleteAssessment(id) {
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
        
        // Set up the confirm button
        document.getElementById('confirmDeleteBtn').onclick = function() {
            storageManager.deleteAssessment(id);
            deleteModal.hide();
            
            // Refresh the list
            document.getElementById('loadBtn').click();
        };
        
        deleteModal.show();
    }
    
    // Initialize the app
    resetAssessment();
});