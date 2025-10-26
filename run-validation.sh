#!/bin/bash

# End-to-End System Validation Runner
# This script sets up and runs the comprehensive validation suite

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VALIDATION_DIR="/workspace"
BACKEND_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:5173"
TIMEOUT=60

echo -e "${BLUE}🚀 ML Platform End-to-End Validation Runner${NC}"
echo "=================================================="

# Function to check if a service is running
check_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1

    echo -e "${YELLOW}⏳ Checking if $service_name is running at $url...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name is running${NC}"
            return 0
        fi
        
        echo -e "${YELLOW}   Attempt $attempt/$max_attempts - waiting for $service_name...${NC}"
        sleep 2
        ((attempt++))
    done
    
    echo -e "${RED}❌ $service_name is not responding after $max_attempts attempts${NC}"
    return 1
}

# Function to start services if needed
start_services() {
    echo -e "${BLUE}🔧 Starting services if needed...${NC}"
    
    # Check if backend is running
    if ! check_service "$BACKEND_URL/api/health" "Backend API"; then
        echo -e "${YELLOW}🚀 Starting backend server...${NC}"
        cd "$VALIDATION_DIR"
        npm run server &
        BACKEND_PID=$!
        echo "Backend PID: $BACKEND_PID"
        
        # Wait for backend to start
        if ! check_service "$BACKEND_URL/api/health" "Backend API"; then
            echo -e "${RED}❌ Failed to start backend server${NC}"
            exit 1
        fi
    fi
    
    # Check if frontend is running
    if ! check_service "$FRONTEND_URL" "Frontend"; then
        echo -e "${YELLOW}🚀 Starting frontend server...${NC}"
        cd "$VALIDATION_DIR/client"
        npm run dev &
        FRONTEND_PID=$!
        echo "Frontend PID: $FRONTEND_PID"
        
        # Wait for frontend to start
        if ! check_service "$FRONTEND_URL" "Frontend"; then
            echo -e "${RED}❌ Failed to start frontend server${NC}"
            exit 1
        fi
    fi
}

# Function to install validation dependencies
install_dependencies() {
    echo -e "${BLUE}📦 Installing validation dependencies...${NC}"
    cd "$VALIDATION_DIR"
    
    if [ ! -f "package-validation.json" ]; then
        echo -e "${RED}❌ package-validation.json not found${NC}"
        exit 1
    fi
    
    # Install node-fetch for the validation script
    npm install node-fetch@^3.3.2 --save-dev
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Function to run validation tests
run_validation() {
    echo -e "${BLUE}🧪 Running validation tests...${NC}"
    cd "$VALIDATION_DIR"
    
    # Set environment variables
    export API_BASE="$BACKEND_URL/api"
    export FRONTEND_URL="$FRONTEND_URL"
    
    # Run validation with verbose output
    node validation-script.js --verbose --output=validation-report.json
    
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✅ All validation tests passed!${NC}"
    else
        echo -e "${RED}❌ Some validation tests failed${NC}"
    fi
    
    return $exit_code
}

# Function to generate summary report
generate_summary() {
    echo -e "${BLUE}📊 Generating summary report...${NC}"
    
    if [ -f "validation-report.json" ]; then
        echo -e "${GREEN}📄 Detailed report available at: validation-report.json${NC}"
        
        # Extract key metrics
        local total_tests=$(jq -r '.totalTests' validation-report.json)
        local passed_tests=$(jq -r '.passedTests' validation-report.json)
        local failed_tests=$(jq -r '.failedTests' validation-report.json)
        local success_rate=$(jq -r '.summary.successRate' validation-report.json)
        
        echo ""
        echo "📈 VALIDATION SUMMARY"
        echo "===================="
        echo "Total Tests: $total_tests"
        echo "Passed: $passed_tests"
        echo "Failed: $failed_tests"
        echo "Success Rate: $success_rate"
        echo ""
        
        if [ "$failed_tests" -gt 0 ]; then
            echo -e "${RED}❌ $failed_tests test(s) failed. Check validation-report.json for details.${NC}"
        else
            echo -e "${GREEN}🎉 All tests passed! System is ready for production.${NC}"
        fi
    else
        echo -e "${RED}❌ Validation report not found${NC}"
    fi
}

# Function to cleanup
cleanup() {
    echo -e "${BLUE}🧹 Cleaning up...${NC}"
    
    # Kill background processes if they were started by this script
    if [ ! -z "$BACKEND_PID" ]; then
        echo "Stopping backend server (PID: $BACKEND_PID)"
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        echo "Stopping frontend server (PID: $FRONTEND_PID)"
        kill $FRONTEND_PID 2>/dev/null || true
    fi
}

# Main execution
main() {
    # Set up signal handlers for cleanup
    trap cleanup EXIT INT TERM
    
    # Parse command line arguments
    VERBOSE=false
    SKIP_SERVICES=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --verbose)
                VERBOSE=true
                shift
                ;;
            --skip-services)
                SKIP_SERVICES=true
                shift
                ;;
            --help)
                echo "Usage: $0 [options]"
                echo "Options:"
                echo "  --verbose        Enable verbose output"
                echo "  --skip-services  Skip service startup checks"
                echo "  --help          Show this help message"
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Install dependencies
    install_dependencies
    
    # Start services if not skipping
    if [ "$SKIP_SERVICES" = false ]; then
        start_services
    fi
    
    # Run validation
    run_validation
    local validation_exit_code=$?
    
    # Generate summary
    generate_summary
    
    # Exit with validation result
    exit $validation_exit_code
}

# Run main function
main "$@"