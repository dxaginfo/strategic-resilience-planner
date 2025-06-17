/**
 * Recommendation System Module
 * 
 * Generates tailored recommendations based on assessment results.
 */

class RecommendationSystem {
    constructor() {
        // Initialize recommendation database
        this.initRecommendationDatabase();
    }
    
    /**
     * Initialize the recommendation database
     */
    initRecommendationDatabase() {
        // Define recommendation templates
        this.recommendationTemplates = {
            // Quick wins (immediate actions)
            quickWins: {
                documentation: {
                    title: "Document Critical Processes",
                    description: "Create detailed documentation for critical processes related to {assetName}. Include step-by-step procedures, key contacts, and troubleshooting guides."
                },
                knowledgeSharing: {
                    title: "Implement Knowledge Sharing Sessions",
                    description: "Schedule regular knowledge sharing sessions for {assetName} to ensure multiple team members understand its operation and maintenance."
                },
                crossTraining: {
                    title: "Cross-Train Personnel",
                    description: "Identify and cross-train backup personnel who can step in if the primary resource for {assetName} becomes unavailable."
                },
                riskAssessment: {
                    title: "Conduct Detailed Risk Assessment",
                    description: "Perform a more detailed risk assessment for {assetName} to identify specific vulnerabilities and mitigation strategies."
                },
                contactList: {
                    title: "Create Emergency Contact List",
                    description: "Develop an emergency contact list for {assetName} including all key stakeholders, vendors, and support resources."
                }
            },
            
            // Medium-term plans (3-6 months)
            mediumTerm: {
                redundancy: {
                    title: "Develop Redundancy Strategy",
                    description: "Design and implement a redundancy strategy for {assetName} to ensure business continuity in case of failure or loss."
                },
                alternativeVendors: {
                    title: "Identify Alternative Vendors/Partners",
                    description: "Research and establish relationships with alternative vendors or partners who could serve as backups for {assetName}."
                },
                successorPlanning: {
                    title: "Create Successor Planning Program",
                    description: "Develop a formal successor planning program for key personnel associated with {assetName}."
                },
                distributeResponsibility: {
                    title: "Distribute Responsibility",
                    description: "Reorganize responsibilities related to {assetName} to distribute knowledge and authority across multiple team members."
                },
                continuityDrills: {
                    title: "Conduct Continuity Drills",
                    description: "Plan and execute continuity drills to test resilience without {assetName} and identify gaps in preparedness."
                }
            },
            
            // Long-term strategy (6+ months)
            longTerm: {
                restructure: {
                    title: "Restructure Dependency Architecture",
                    description: "Fundamentally restructure how your organization depends on {assetName} to build greater resilience into your operational model."
                },
                diversification: {
                    title: "Strategic Diversification Plan",
                    description: "Develop a long-term diversification plan to reduce overall dependency on {assetCategory} resources like {assetName}."
                },
                automationDigitization: {
                    title: "Automation and Digitization",
                    description: "Invest in automation and digitization to reduce dependency on individual resources and create more resilient systems around {assetName}."
                },
                resilientDesign: {
                    title: "Implement Resilient Design Principles",
                    description: "Incorporate resilient design principles in all future developments related to {assetCategory} to avoid creating new critical dependencies."
                },
                culturalChange: {
                    title: "Foster Culture of Resilience",
                    description: "Develop training programs and incentives to foster a culture of resilience and preparedness across the organization."
                }
            }
        };
        
        // Industry-specific recommendations
        this.industryRecommendations = {
            sports: [
                {
                    type: "quickWins",
                    title: "Implement Player Wellness Monitoring",
                    description: "Deploy player wellness tracking systems to identify early warning signs of potential injury or performance issues for key players."
                },
                {
                    type: "mediumTerm",
                    title: "Develop Bench Strength",
                    description: "Create a structured development program for bench players to ensure they can effectively substitute for star players when needed."
                },
                {
                    type: "longTerm",
                    title: "Build Team-First Culture",
                    description: "Invest in building a team-first culture that can withstand the loss of individual star players while maintaining performance."
                }
            ],
            technology: [
                {
                    type: "quickWins",
                    title: "Document System Architecture",
                    description: "Create comprehensive documentation of system architecture, dependencies, and recovery procedures."
                },
                {
                    type: "mediumTerm",
                    title: "Implement Service Redundancy",
                    description: "Design and implement redundant services across multiple availability zones or regions to eliminate single points of failure."
                },
                {
                    type: "longTerm",
                    title: "Adopt Microservices Architecture",
                    description: "Gradually migrate from monolithic systems to microservices architecture to improve resilience and scalability."
                }
            ],
            // Additional industries would be included here
        };
    }
    
    /**
     * Generate recommendations based on assessment results
     * @param {Object} assessment - The assessment object
     * @returns {Object} - An object containing recommendations categorized by timeframe
     */
    generateRecommendations(assessment) {
        if (!assessment || !assessment.assets || !assessment.dependencies) {
            return {
                quickWins: [],
                mediumTerm: [],
                longTerm: []
            };
        }
        
        // Initialize recommendations
        const recommendations = {
            quickWins: [],
            mediumTerm: [],
            longTerm: []
        };
        
        // Identify high-risk assets
        const highRiskAssets = this.identifyHighRiskAssets(assessment);
        
        // Generate asset-specific recommendations
        highRiskAssets.forEach(riskAsset => {
            const asset = assessment.assets.find(a => a.id === riskAsset.assetId);
            if (!asset) return;
            
            const assetName = asset.name;
            const assetCategory = asset.category;
            
            // Quick wins recommendations
            this.addRecommendation(recommendations.quickWins, this.selectRecommendation(
                this.recommendationTemplates.quickWins,
                { assetName, assetCategory }
            ));
            
            // Medium-term recommendations for very high-risk assets
            if (riskAsset.riskScore > 7) {
                this.addRecommendation(recommendations.mediumTerm, this.selectRecommendation(
                    this.recommendationTemplates.mediumTerm,
                    { assetName, assetCategory }
                ));
                
                // Long-term recommendations for extremely high-risk assets
                if (riskAsset.riskScore > 8.5) {
                    this.addRecommendation(recommendations.longTerm, this.selectRecommendation(
                        this.recommendationTemplates.longTerm,
                        { assetName, assetCategory }
                    ));
                }
            }
        });
        
        // Add industry-specific recommendations
        if (assessment.organizationProfile && assessment.organizationProfile.industry) {
            this.addIndustryRecommendations(recommendations, assessment.organizationProfile.industry);
        }
        
        // Add diversification recommendations
        const assessmentEngine = new AssessmentEngine();
        const diversification = assessmentEngine.evaluateDiversification(assessment);
        
        if (diversification.score < 5) {
            this.addRecommendation(recommendations.mediumTerm, {
                title: "Develop Formal Diversification Strategy",
                description: "Create a comprehensive strategy to diversify dependencies across all critical categories."
            });
        }
        
        // Add category-specific recommendations
        const categoryMetrics = assessmentEngine.calculateCategoryMetrics(assessment);
        this.addCategoryRecommendations(recommendations, categoryMetrics);
        
        // Ensure we have at least one recommendation in each timeframe
        this.ensureMinimumRecommendations(recommendations);
        
        return recommendations;
    }
    
    /**
     * Identify high-risk assets from the assessment
     * @param {Object} assessment - The assessment object
     * @param {number} threshold - Risk score threshold (default: 6)
     * @returns {Array} - Array of high-risk assets with risk scores
     */
    identifyHighRiskAssets(assessment, threshold = 6) {
        const highRiskAssets = [];
        
        assessment.assets.forEach(asset => {
            const dependency = assessment.dependencies.find(d => d.assetId === asset.id);
            
            if (dependency) {
                const importance = dependency.importance || 5;
                const replaceability = dependency.replaceability || 5;
                const concentration = dependency.concentration || 5;
                
                const riskScore = (importance * replaceability * concentration) / 100;
                
                if (riskScore >= threshold) {
                    highRiskAssets.push({
                        assetId: asset.id,
                        riskScore: riskScore
                    });
                }
            }
        });
        
        // Sort by risk score (highest first)
        return highRiskAssets.sort((a, b) => b.riskScore - a.riskScore);
    }
    
    /**
     * Select a recommendation from templates and format with data
     * @param {Object} templates - Recommendation templates
     * @param {Object} data - Data for template substitution
     * @returns {Object} - A formatted recommendation
     */
    selectRecommendation(templates, data) {
        // Get all template keys
        const templateKeys = Object.keys(templates);
        
        // Select a random template
        const randomKey = templateKeys[Math.floor(Math.random() * templateKeys.length)];
        const template = templates[randomKey];
        
        // Format template with data
        return {
            title: template.title,
            description: this.formatTemplate(template.description, data)
        };
    }
    
    /**
     * Format a template string with data
     * @param {string} template - Template string with placeholders
     * @param {Object} data - Data for substitution
     * @returns {string} - Formatted string
     */
    formatTemplate(template, data) {
        return template.replace(/\{(\w+)\}/g, (match, key) => {
            return data[key] || match;
        });
    }
    
    /**
     * Add a recommendation if not already present
     * @param {Array} list - List of recommendations
     * @param {Object} recommendation - Recommendation to add
     */
    addRecommendation(list, recommendation) {
        // Check if a similar recommendation already exists
        const exists = list.some(rec => 
            rec.title === recommendation.title ||
            rec.description === recommendation.description
        );
        
        if (!exists) {
            list.push(recommendation);
        }
    }
    
    /**
     * Add industry-specific recommendations
     * @param {Object} recommendations - Recommendations object
     * @param {string} industry - Industry value
     */
    addIndustryRecommendations(recommendations, industry) {
        const industryRecs = this.industryRecommendations[industry];
        
        if (industryRecs) {
            industryRecs.forEach(rec => {
                this.addRecommendation(recommendations[rec.type], {
                    title: rec.title,
                    description: rec.description
                });
            });
        }
    }
    
    /**
     * Add category-specific recommendations
     * @param {Object} recommendations - Recommendations object
     * @param {Object} categoryMetrics - Category metrics
     */
    addCategoryRecommendations(recommendations, categoryMetrics) {
        // Find the category with the lowest resilience score
        let lowestCategory = null;
        let lowestScore = 100;
        
        Object.entries(categoryMetrics).forEach(([category, metrics]) => {
            if (metrics.resilienceScore < lowestScore) {
                lowestScore = metrics.resilienceScore;
                lowestCategory = category;
            }
        });
        
        if (lowestCategory && lowestScore < 50) {
            const categoryName = this.formatCategoryName(lowestCategory);
            
            this.addRecommendation(recommendations.mediumTerm, {
                title: `${categoryName} Resilience Strategy`,
                description: `Develop a focused resilience strategy for your ${categoryName.toLowerCase()} assets, which currently represent your most vulnerable category.`
            });
        }
    }
    
    /**
     * Format a category name for display
     * @param {string} category - The category value
     * @returns {string} - The formatted category name
     */
    formatCategoryName(category) {
        const categoryMap = {
            'people': 'People',
            'systems': 'Systems & Technology',
            'relationships': 'Partnerships & Relationships',
            'facilities': 'Facilities & Equipment',
            'knowledge': 'Intellectual Property',
            'market': 'Market Access',
            'other': 'Other'
        };
        
        return categoryMap[category] || category;
    }
    
    /**
     * Ensure there is at least one recommendation in each timeframe
     * @param {Object} recommendations - Recommendations object
     */
    ensureMinimumRecommendations(recommendations) {
        // Default recommendations for each timeframe
        const defaults = {
            quickWins: {
                title: "Conduct Comprehensive Resilience Assessment",
                description: "Perform a more detailed resilience assessment across all departments to identify additional vulnerabilities and opportunities for improvement."
            },
            mediumTerm: {
                title: "Develop Organization-Wide Resilience Policy",
                description: "Create a formal resilience policy that establishes guidelines, responsibilities, and procedures for maintaining operational continuity."
            },
            longTerm: {
                title: "Invest in Resilience Training",
                description: "Develop a comprehensive training program to build resilience awareness and skills across all levels of the organization."
            }
        };
        
        // Add default recommendations if lists are empty
        Object.keys(defaults).forEach(timeframe => {
            if (recommendations[timeframe].length === 0) {
                recommendations[timeframe].push(defaults[timeframe]);
            }
        });
    }
}