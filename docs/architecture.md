# Strategic Resilience Planner: Architecture

## Architecture Overview

The Strategic Resilience Planner is a client-side single-page application (SPA) with no server dependencies. This document outlines the architecture and component structure.

## Component Structure

The application is organized into the following components:

```
strategic-resilience-planner/
├── index.html              # Main entry point
├── assets/                 # Static assets
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript modules
│   └── img/                # Images and icons
├── components/             # UI Components
│   ├── assessment/         # Assessment wizard components
│   ├── dashboard/          # Dashboard visualization components
│   └── common/             # Common UI elements
└── docs/                   # Documentation
```

## Core Modules

### 1. Assessment Engine (`js/assessment-engine.js`)

The assessment engine is responsible for:
- Processing user inputs from assessment forms
- Calculating dependency risk scores
- Generating risk profiles for different assets/dependencies

Key algorithms:
- Dependency Impact Score = Importance * Replaceability * Concentration
- Resilience Index = Weighted sum of diversification, contingency plans, and cross-training

### 2. Visualization Module (`js/visualization.js`)

Handles all data visualization including:
- Risk heat maps
- Dependency radar charts
- Resilience score comparisons
- Scenario impact graphs

Uses Chart.js to render interactive visualizations that help users understand their risk profile.

### 3. Recommendation System (`js/recommendations.js`)

Generates tailored recommendations based on assessment results:
- Diversification strategies for high-risk dependencies
- Contingency planning suggestions
- Cross-training and knowledge sharing recommendations
- Resource allocation priorities

### 4. Storage Manager (`js/storage-manager.js`)

Handles data persistence using browser localStorage:
- Saves assessment data
- Retrieves previous assessments
- Exports/imports assessment data (JSON)
- Manages multiple saved scenarios

### 5. UI Controller (`js/ui-controller.js`)

Orchestrates the user interface:
- Manages navigation between assessment steps
- Controls form validation
- Handles dynamic UI updates
- Manages modal dialogs and notifications

## Data Flow

1. User completes the assessment wizard
2. Assessment data is processed by the Assessment Engine
3. Results are stored by the Storage Manager
4. Visualization Module renders the risk dashboard
5. Recommendation System generates tailored suggestions
6. UI Controller presents the results to the user

## Extensibility

The modular architecture allows for:
- Adding new assessment types
- Implementing additional visualization types
- Extending the recommendation system with new strategies
- Future integration with external data sources (via API if needed)