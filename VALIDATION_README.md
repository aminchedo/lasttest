# End-to-End System Validation

This directory contains a comprehensive validation suite for the ML Training Platform, designed to perform behavioral validation of all system components.

## Overview

The validation system tests the complete functionality of the ML platform including:

- **Model Download Pipeline**: Catalog inspection, download initiation, progress tracking, and resource inventory integration
- **Training Pipeline**: Job initialization, real-time metrics streaming, and lifecycle management (start, pause, resume, stop)
- **Analytics and Reporting**: Historical data retrieval, run selection, and multi-run switching
- **Cross-Component Consistency**: Data integrity across different system components

## Files

- `validation-script.js` - Main validation script with all test cases
- `package-validation.json` - Dependencies for the validation script
- `run-validation.sh` - Automated test runner with service management
- `VALIDATION_README.md` - This documentation file

## Quick Start

### Prerequisites

1. Node.js 18+ installed
2. Backend server running on `http://localhost:3001`
3. Frontend server running on `http://localhost:5173`

### Running Validation

#### Option 1: Automated Runner (Recommended)
```bash
# Run with automatic service startup
./run-validation.sh

# Run with verbose output
./run-validation.sh --verbose

# Skip service checks (if services are already running)
./run-validation.sh --skip-services
```

#### Option 2: Manual Execution
```bash
# Install dependencies
npm install node-fetch@^3.3.2 --save-dev

# Run validation
node validation-script.js

# Run with verbose output
node validation-script.js --verbose

# Save detailed report
node validation-script.js --output=my-report.json
```

## Test Categories

### Part 1: Model Download Pipeline Validation

#### Test 1.1: Catalog Inspection
- **Purpose**: Verify the system can retrieve and display available models
- **Checks**: API response structure, model data integrity, Persian model availability
- **Expected**: Returns array of models with proper structure

#### Test 1.2: Download Initiation
- **Purpose**: Test model download start functionality
- **Checks**: Download API response, job ID generation, status tracking
- **Expected**: Download job created successfully with valid job ID

#### Test 1.3: Download Progress Tracking
- **Purpose**: Verify real-time progress updates during download
- **Checks**: Progress API responses, status updates, completion detection
- **Expected**: Progress updates received and tracked correctly

#### Test 1.4: Resource Inventory Integration
- **Purpose**: Ensure downloaded models are properly registered in system inventory
- **Checks**: Assets API, model registration, metadata persistence
- **Expected**: Downloaded models appear in assets inventory

### Part 2: Training Pipeline Validation

#### Test 2.1: Training Initialization
- **Purpose**: Verify training job creation and configuration
- **Checks**: Training start API, job creation, configuration validation
- **Expected**: Training job created with valid configuration

#### Test 2.2: Training Metrics Streaming
- **Purpose**: Test real-time metrics updates during training
- **Checks**: Metrics API responses, data streaming, metric accuracy
- **Expected**: Live metrics updates (loss, accuracy, throughput) received

#### Test 2.3: Training Lifecycle Management
- **Purpose**: Verify training job control operations
- **Checks**: Pause, resume, stop functionality, state transitions
- **Expected**: All lifecycle operations execute successfully

### Part 3: Analytics and Reporting Validation

#### Test 3.1: Analytics Page Structure
- **Purpose**: Verify analytics data retrieval and structure
- **Checks**: Training jobs API, data format, historical data availability
- **Expected**: Historical training data retrieved successfully

#### Test 3.2: Run Selection and Data Loading
- **Purpose**: Test individual run data loading
- **Checks**: Run-specific data retrieval, metrics loading, log access
- **Expected**: Detailed run data loaded with metrics and logs

#### Test 3.3: Multi-Run Switching
- **Purpose**: Verify switching between different training runs
- **Checks**: Multiple run data loading, data consistency, UI updates
- **Expected**: Seamless switching between different runs

### Cross-Component Validation

#### Test 4.1: Data Consistency
- **Purpose**: Ensure data integrity across system components
- **Checks**: Model-asset consistency, job-model references, data synchronization
- **Expected**: No data inconsistencies found

## Configuration

### Environment Variables

- `API_BASE`: Backend API base URL (default: `http://localhost:3001/api`)
- `FRONTEND_URL`: Frontend URL (default: `http://localhost:5173`)

### Command Line Options

- `--verbose`: Enable detailed logging output
- `--output=file.json`: Save detailed report to specified file
- `--help`: Show help message

## Output and Reporting

### Console Output

The validation script provides real-time feedback with:
- ✅ Success indicators for passed tests
- ❌ Error indicators for failed tests
- ⚠️ Warning indicators for non-critical issues
- 📊 Summary statistics at completion

### Detailed Report

A comprehensive JSON report is generated containing:
- Test execution timestamps
- Individual test results and metrics
- Error details and stack traces
- Performance metrics and timing data
- System configuration used

### Sample Report Structure

```json
{
  "startTime": "2024-01-15T10:00:00.000Z",
  "endTime": "2024-01-15T10:05:30.000Z",
  "totalTests": 11,
  "passedTests": 10,
  "failedTests": 1,
  "warnings": 2,
  "errors": [...],
  "testResults": {
    "Model Catalog Inspection": {
      "totalModels": 15,
      "persianModels": 3,
      "validModels": 15
    },
    ...
  },
  "summary": {
    "successRate": "90.91%",
    "duration": 330000
  }
}
```

## Troubleshooting

### Common Issues

1. **Service Not Running**
   - Ensure backend is running on port 3001
   - Ensure frontend is running on port 5173
   - Use `--skip-services` flag if services are already running

2. **API Connection Errors**
   - Check API_BASE environment variable
   - Verify backend server is accessible
   - Check for firewall or network issues

3. **Test Failures**
   - Review detailed error messages in console output
   - Check validation-report.json for specific failure details
   - Ensure database is properly initialized

4. **Permission Issues**
   - Ensure run-validation.sh has execute permissions
   - Check file ownership and permissions

### Debug Mode

Run with verbose output to see detailed execution information:
```bash
./run-validation.sh --verbose
```

## Integration with CI/CD

The validation script is designed to integrate with continuous integration systems:

```yaml
# Example GitHub Actions workflow
- name: Run E2E Validation
  run: |
    ./run-validation.sh --skip-services
  env:
    API_BASE: ${{ env.BACKEND_URL }}/api
    FRONTEND_URL: ${{ env.FRONTEND_URL }}
```

## Contributing

When adding new validation tests:

1. Follow the existing test structure and naming conventions
2. Include proper error handling and logging
3. Add test documentation to this README
4. Update the test count in the summary generation
5. Ensure tests are deterministic and can run in any order

## Support

For issues or questions regarding the validation system:

1. Check the troubleshooting section above
2. Review the detailed validation report
3. Check system logs for additional context
4. Ensure all prerequisites are met