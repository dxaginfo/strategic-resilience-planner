/**
 * Assessment Engine Module
 * 
 * Core logic for evaluating dependencies and calculating risk scores.
 */

class AssessmentEngine {
    constructor() {
        // Initialize any assessment engine configuration
    }
    
    /**
     * Calculate the overall resilience score for an assessment
     * @param {Object} assessment - The assessment object containing dependencies and contingencies
     * @returns {number} - A resilience score from 0-100
     */
    calculateResilienceScore(assessment) {
        if (!assessment || !assessment.assets || !assessment.dependencies) {
            return 0;
        }
        
        // Get risk scores for all assets
        const riskScores = this.calculateRiskScores(assessment);
        
        // If there are no risk scores, return 0
        if (riskScores.length === 0) {
            return 0;
        }
        
        // Calculate the base risk score (inverted - lower is better)
        const averageRiskScore = riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length;
        const baseRiskScore = 100 - (averageRiskScore * 10); // Convert to 0-100 scale and invert
        
        // Apply contingency bonuses if available
        let contingencyBonus = 0;
        if (assessment.contingencies && assessment.contingencies.length > 0) {
            const contingencyScores = assessment.contingencies.map(c => {
                // Calculate average of backup, knowledge sharing, and documentation
                return (c.backup + c.knowledgeSharing + c.documentation) / 3;
            });
            
            const averageContingencyScore = contingencyScores.reduce((sum, score) => sum + score, 0) / contingencyScores.length;
            contingencyBonus = averageContingencyScore * 2; // Scale to a 0-20 bonus
        }
        
        // Calculate final resilience score
        let resilienceScore = baseRiskScore + contingencyBonus;
        
        // Apply industry-specific adjustments
        if (assessment.organizationProfile && assessment.organizationProfile.industry) {
            const industryAdjustment = this.getIndustryAdjustment(assessment.organizationProfile.industry);
            resilienceScore += industryAdjustment;
        }
        
        // Apply organization size adjustments
        if (assessment.organizationProfile && assessment.organizationProfile.size) {
            const sizeAdjustment = this.getSizeAdjustment(assessment.organizationProfile.size);
            resilienceScore += sizeAdjustment;
        }
        
        // Ensure score is within 0-100 range
        return Math.max(0, Math.min(100, resilienceScore));
    }
    
    /**
     * Calculate risk scores for all assets in the assessment
     * @param {Object} assessment - The assessment object
     * @returns {Array} - An array of risk scores
     */
    calculateRiskScores(assessment) {
        const riskScores = [];
        
        assessment.assets.forEach(asset => {
            const dependency = assessment.dependencies.find(d => d.assetId === asset.id);
            
            if (dependency) {
                // Calculate risk score based on importance, replaceability, and concentration
                // Formula: (Importance * Replaceability * Concentration) / 100
                // This produces a risk score from 0.1 to 10
                const importance = dependency.importance || 5;
                const replaceability = dependency.replaceability || 5;
                const concentration = dependency.concentration || 5;
                
                const riskScore = (importance * replaceability * concentration) / 100;
                riskScores.push(riskScore);
            }
        });
        
        return riskScores;
    }
    
    /**
     * Get adjustment value based on industry
     * @param {string} industry - The industry value
     * @returns {number} - An adjustment value
     */
    getIndustryAdjustment(industry) {
        // Different industries have different baseline resilience characteristics
        const industryAdjustments = {
            'sports': -2, // Sports teams often have high star player dependency
            'technology': -1, // Tech companies often have key system dependencies
            'finance': 2, // Financial organizations typically have strong redundancy
            'healthcare': 1, // Healthcare typically has regulated backup requirements
            'retail': 0, // Neutral adjustment
            'manufacturing': -1, // Manufacturing often has facility dependencies
            'education': 1, // Education typically has distributed knowledge
            'professional': -1, // Professional services often have key people dependencies
            'entertainment': -3, // Entertainment has high star talent dependency
            'other': 0 // Neutral adjustment for other
        };
        
        return industryAdjustments[industry] || 0;
    }
    
    /**
     * Get adjustment value based on organization size
     * @param {string} size - The organization size value
     * @returns {number} - An adjustment value
     */
    getSizeAdjustment(size) {
        // Organization size affects resilience characteristics
        const sizeAdjustments = {
            'micro': -3, // Very small organizations often lack redundancy
            'small': -1, // Small organizations have some limitations
            'medium': 1, // Medium organizations typically have more resources
            'large': 3 // Large organizations typically have more redundancy
        };
        
        return sizeAdjustments[size] || 0;
    }
    
    /**
     * Identify the top risks in the assessment
     * @param {Object} assessment - The assessment object
     * @param {number} limit - Maximum number of risks to return (default: 3)
     * @returns {Array} - An array of risk objects
     */
    identifyTopRisks(assessment, limit = 3) {
        if (!assessment || !assessment.assets || !assessment.dependencies) {
            return [];
        }
        
        const risks = [];
        
        assessment.assets.forEach(asset => {
            const dependency = assessment.dependencies.find(d => d.assetId === asset.id);
            
            if (dependency) {
                // Calculate risk score
                const importance = dependency.importance || 5;
                const replaceability = dependency.replaceability || 5;
                const concentration = dependency.concentration || 5;
                const timeToReplace = dependency.timeToReplace || 'weeks';
                
                const riskScore = (importance * replaceability * concentration) / 100;
                
                // Determine risk reason
                let reason = '';
                if (importance >= 8 && replaceability >= 8) {
                    reason = 'Critical asset with very difficult replaceability.';
                } else if (importance >= 8) {
                    reason = 'Highly important to operations.';
                } else if (replaceability >= 8) {
                    reason = 'Extremely difficult to replace.';
                } else if (concentration >= 8) {
                    reason = 'Highly concentrated dependency.';
                } else if (timeToReplace === 'years') {
                    reason = 'Would take years to replace.';
                } else if (timeToReplace === 'months') {
                    reason = 'Would take months to replace.';
                } else {
                    reason = 'Moderate overall risk.';
                }
                
                risks.push({
                    assetId: asset.id,
                    riskScore: riskScore,
                    reason: reason
                });
            }
        });
        
        // Sort risks by score (highest first) and limit the results
        return risks.sort((a, b) => b.riskScore - a.riskScore).slice(0, limit);
    }
    
    /**
     * Calculate resilience metrics by category
     * @param {Object} assessment - The assessment object
     * @returns {Object} - An object containing category metrics
     */
    calculateCategoryMetrics(assessment) {
        if (!assessment || !assessment.assets || !assessment.dependencies) {
            return {};
        }
        
        const categoryMetrics = {};
        
        // Group assets by category
        assessment.assets.forEach(asset => {
            const category = asset.category || 'other';
            
            if (!categoryMetrics[category]) {
                categoryMetrics[category] = {
                    assetCount: 0,
                    riskScores: [],
                    contingencyScores: []
                };
            }
            
            categoryMetrics[category].assetCount++;
            
            // Add risk score if available
            const dependency = assessment.dependencies.find(d => d.assetId === asset.id);
            if (dependency) {
                const importance = dependency.importance || 5;
                const replaceability = dependency.replaceability || 5;
                const concentration = dependency.concentration || 5;
                
                const riskScore = (importance * replaceability * concentration) / 100;
                categoryMetrics[category].riskScores.push(riskScore);
            }
            
            // Add contingency score if available
            const contingency = assessment.contingencies && assessment.contingencies.find(c => c.assetId === asset.id);
            if (contingency) {
                const contingencyScore = (contingency.backup + contingency.knowledgeSharing + contingency.documentation) / 3;
                categoryMetrics[category].contingencyScores.push(contingencyScore);
            }
        });
        
        // Calculate averages for each category
        Object.keys(categoryMetrics).forEach(category => {
            const metrics = categoryMetrics[category];
            
            // Calculate average risk score
            if (metrics.riskScores.length > 0) {
                metrics.avgRiskScore = metrics.riskScores.reduce((sum, score) => sum + score, 0) / metrics.riskScores.length;
            } else {
                metrics.avgRiskScore = 0;
            }
            
            // Calculate average contingency score
            if (metrics.contingencyScores.length > 0) {
                metrics.avgContingencyScore = metrics.contingencyScores.reduce((sum, score) => sum + score, 0) / metrics.contingencyScores.length;
            } else {
                metrics.avgContingencyScore = 0;
            }
            
            // Calculate resilience score for category
            metrics.resilienceScore = 100 - (metrics.avgRiskScore * 10) + (metrics.avgContingencyScore * 2);
            metrics.resilienceScore = Math.max(0, Math.min(100, metrics.resilienceScore));
            
            // Clean up internal arrays
            delete metrics.riskScores;
            delete metrics.contingencyScores;
        });
        
        return categoryMetrics;
    }
    
    /**
     * Evaluate the diversification level of the organization
     * @param {Object} assessment - The assessment object
     * @returns {Object} - An object containing diversification metrics
     */
    evaluateDiversification(assessment) {
        if (!assessment || !assessment.assets || !assessment.dependencies) {
            return { score: 0, level: 'Unknown', recommendations: [] };
        }
        
        // Calculate concentration metrics
        const concentrationScores = assessment.dependencies.map(d => d.concentration || 5);
        const avgConcentration = concentrationScores.length > 0 
            ? concentrationScores.reduce((sum, score) => sum + score, 0) / concentrationScores.length 
            : 5;
        
        // Invert concentration to get diversification (1-10 scale)
        const diversificationScore = 11 - avgConcentration;
        
        // Determine diversification level
        let diversificationLevel = '';
        let recommendations = [];
        
        if (diversificationScore < 3) {
            diversificationLevel = 'Very Low';
            recommendations = [
                'Urgent action needed to reduce dependency concentration',
                'Identify alternative suppliers/partners for key dependencies',
                'Develop backup systems for critical assets'
            ];
        } else if (diversificationScore < 5) {
            diversificationLevel = 'Low';
            recommendations = [
                'Develop formal diversification strategy',
                'Cross-train personnel for key roles',
                'Explore redundancy options for critical systems'
            ];
        } else if (diversificationScore < 7) {
            diversificationLevel = 'Moderate';
            recommendations = [
                'Continue improving diversification efforts',
                'Document knowledge to reduce personnel dependencies',
                'Regularly test contingency measures'
            ];
        } else if (diversificationScore < 9) {
            diversificationLevel = 'High';
            recommendations = [
                'Maintain current diversification practices',
                'Periodically review for new concentration risks',
                'Share best practices across the organization'
            ];
        } else {
            diversificationLevel = 'Very High';
            recommendations = [
                'Maintain excellent diversification practices',
                'Consider optimizing for efficiency where appropriate',
                'Document your approach for organizational knowledge'
            ];
        }
        
        return {
            score: diversificationScore,
            level: diversificationLevel,
            recommendations: recommendations
        };
    }
}