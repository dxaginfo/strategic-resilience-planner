/**
 * Visualization Module
 * 
 * Handles rendering charts and data visualizations.
 */

class Visualization {
    constructor() {
        // Initialize Chart.js configurations
        this.initChartDefaults();
    }
    
    /**
     * Initialize Chart.js default configurations
     */
    initChartDefaults() {
        // Set global chart defaults if needed
        if (typeof Chart !== 'undefined') {
            Chart.defaults.font.family = "'Inter', sans-serif";
            Chart.defaults.color = '#6c757d';
        }
    }
    
    /**
     * Create a dependency heatmap visualization
     * @param {string} canvasId - The ID of the canvas element
     * @param {Object} assessment - The assessment data to visualize
     */
    createDependencyHeatmap(canvasId, assessment) {
        if (!assessment || !assessment.assets || !assessment.dependencies) {
            return;
        }
        
        // Get canvas context
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        // Clear any existing chart
        if (canvas.chart) {
            canvas.chart.destroy();
        }
        
        // Prepare data for the chart
        const assetData = [];
        
        // Process assets and dependencies
        assessment.assets.forEach(asset => {
            const dependency = assessment.dependencies.find(d => d.assetId === asset.id);
            
            if (dependency) {
                const importance = dependency.importance || 5;
                const replaceability = dependency.replaceability || 5;
                
                assetData.push({
                    asset: asset.name,
                    category: asset.category,
                    importance: importance,
                    replaceability: replaceability,
                    riskScore: (importance * replaceability * (dependency.concentration || 5)) / 100
                });
            }
        });
        
        // Sort by risk score (highest first)
        assetData.sort((a, b) => b.riskScore - a.riskScore);
        
        // Limit to top 10 assets for readability
        const chartData = assetData.slice(0, 10);
        
        // Create the chart
        const ctx = canvas.getContext('2d');
        
        canvas.chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Dependencies',
                    data: chartData.map(item => ({
                        x: item.importance,
                        y: item.replaceability,
                        riskScore: item.riskScore,
                        asset: item.asset,
                        category: item.category
                    })),
                    backgroundColor: chartData.map(item => this.getCategoryColor(item.category, 0.7)),
                    borderColor: chartData.map(item => this.getCategoryColor(item.category, 1)),
                    borderWidth: 1,
                    pointRadius: chartData.map(item => 8 + (item.riskScore * 0.8)),
                    pointHoverRadius: chartData.map(item => 10 + (item.riskScore * 0.8))
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Importance'
                        },
                        min: 0,
                        max: 11,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Replaceability'
                        },
                        min: 0,
                        max: 11,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const data = context.raw;
                                return [
                                    `${data.asset}`,
                                    `Importance: ${data.x}`,
                                    `Replaceability: ${data.y}`,
                                    `Risk Score: ${data.riskScore.toFixed(1)}`
                                ];
                            }
                        }
                    },
                    legend: {
                        display: false
                    },
                    annotation: {
                        annotations: {
                            quadrants: {
                                type: 'line',
                                xMin: 5.5,
                                xMax: 5.5,
                                yMin: 0,
                                yMax: 11,
                                borderColor: 'rgba(0, 0, 0, 0.1)',
                                borderWidth: 1,
                                borderDash: [5, 5]
                            },
                            horizontalLine: {
                                type: 'line',
                                yMin: 5.5,
                                yMax: 5.5,
                                xMin: 0,
                                xMax: 11,
                                borderColor: 'rgba(0, 0, 0, 0.1)',
                                borderWidth: 1,
                                borderDash: [5, 5]
                            },
                            criticalZone: {
                                type: 'box',
                                xMin: 5.5,
                                xMax: 11,
                                yMin: 5.5,
                                yMax: 11,
                                backgroundColor: 'rgba(255, 0, 0, 0.05)',
                                borderWidth: 0
                            }
                        }
                    }
                }
            }
        });
        
        // Add labels to the quadrants
        this.addQuadrantLabels(ctx, canvas.width, canvas.height);
    }
    
    /**
     * Add labels to the quadrants of the heatmap
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} width - The canvas width
     * @param {number} height - The canvas height
     */
    addQuadrantLabels(ctx, width, height) {
        // This would be implemented in a production version
        // Requires more complex canvas manipulation outside the Chart.js API
    }
    
    /**
     * Create a resilience radar chart
     * @param {string} canvasId - The ID of the canvas element
     * @param {Object} assessment - The assessment data to visualize
     */
    createResilienceRadar(canvasId, assessment) {
        if (!assessment) {
            return;
        }
        
        // Get canvas context
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        // Clear any existing chart
        if (canvas.chart) {
            canvas.chart.destroy();
        }
        
        // Get category metrics
        const assessmentEngine = new AssessmentEngine();
        const categoryMetrics = assessmentEngine.calculateCategoryMetrics(assessment);
        
        // Prepare data for the chart
        const categories = Object.keys(categoryMetrics);
        const resilienceScores = categories.map(category => categoryMetrics[category].resilienceScore);
        
        // Create the chart
        const ctx = canvas.getContext('2d');
        
        canvas.chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: categories.map(this.formatCategoryName),
                datasets: [{
                    label: 'Resilience Score',
                    data: resilienceScores,
                    backgroundColor: 'rgba(42, 157, 143, 0.2)',
                    borderColor: 'rgba(42, 157, 143, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(42, 157, 143, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(42, 157, 143, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        pointLabels: {
                            font: {
                                size: 12
                            }
                        },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                return `${label}: ${value.toFixed(1)}%`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Create an impact vs. probability matrix
     * @param {string} canvasId - The ID of the canvas element
     * @param {Object} assessment - The assessment data to visualize
     */
    createImpactProbabilityMatrix(canvasId, assessment) {
        if (!assessment || !assessment.assets || !assessment.dependencies) {
            return;
        }
        
        // Get canvas context
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        // Clear any existing chart
        if (canvas.chart) {
            canvas.chart.destroy();
        }
        
        // Prepare data for the chart
        const assetData = [];
        
        // Process assets and dependencies
        assessment.assets.forEach(asset => {
            const dependency = assessment.dependencies.find(d => d.assetId === asset.id);
            
            if (dependency) {
                // Calculate impact based on importance and replaceability
                const impact = (dependency.importance + dependency.replaceability) / 2;
                
                // Calculate probability of loss based on concentration and inverse of backup measures
                let probability = dependency.concentration || 5;
                
                // Adjust probability based on contingency measures if available
                const contingency = assessment.contingencies && assessment.contingencies.find(c => c.assetId === asset.id);
                if (contingency) {
                    // Average backup, knowledge sharing, and documentation scores
                    const contingencyScore = (contingency.backup + contingency.knowledgeSharing + contingency.documentation) / 3;
                    // Adjust probability downward based on contingency score (higher contingency = lower probability)
                    probability = Math.max(1, probability - (contingencyScore / 2));
                }
                
                assetData.push({
                    asset: asset.name,
                    category: asset.category,
                    impact: impact,
                    probability: probability
                });
            }
        });
        
        // Create the chart
        const ctx = canvas.getContext('2d');
        
        canvas.chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Assets',
                    data: assetData.map(item => ({
                        x: item.probability,
                        y: item.impact,
                        asset: item.asset,
                        category: item.category
                    })),
                    backgroundColor: assetData.map(item => this.getCategoryColor(item.category, 0.7)),
                    borderColor: assetData.map(item => this.getCategoryColor(item.category, 1)),
                    borderWidth: 1,
                    pointRadius: 8,
                    pointHoverRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Probability of Loss'
                        },
                        min: 0,
                        max: 11,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Impact'
                        },
                        min: 0,
                        max: 11,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const data = context.raw;
                                return [
                                    `${data.asset}`,
                                    `Impact: ${data.y.toFixed(1)}`,
                                    `Probability: ${data.x.toFixed(1)}`
                                ];
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    /**
     * Get color for a category
     * @param {string} category - The category value
     * @param {number} alpha - The alpha value for the color
     * @returns {string} - A color string in rgba format
     */
    getCategoryColor(category, alpha = 1) {
        const colors = {
            'people': `rgba(76, 201, 240, ${alpha})`,
            'systems': `rgba(72, 149, 239, ${alpha})`,
            'relationships': `rgba(86, 11, 173, ${alpha})`,
            'facilities': `rgba(247, 37, 133, ${alpha})`,
            'knowledge': `rgba(114, 9, 183, ${alpha})`,
            'market': `rgba(58, 12, 163, ${alpha})`,
            'other': `rgba(108, 117, 125, ${alpha})`
        };
        
        return colors[category] || colors.other;
    }
    
    /**
     * Format a category name for display
     * @param {string} category - The category value
     * @returns {string} - The formatted category name
     */
    formatCategoryName(category) {
        const categoryMap = {
            'people': 'People',
            'systems': 'Systems',
            'relationships': 'Relationships',
            'facilities': 'Facilities',
            'knowledge': 'Knowledge',
            'market': 'Market Access',
            'other': 'Other'
        };
        
        return categoryMap[category] || category;
    }
}