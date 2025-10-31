# Contributing to Heart Disease Prediction System

Thank you for your interest in contributing to the Heart Disease Prediction System! We welcome contributions from the community to help improve this important healthcare tool.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [How to Contribute](#how-to-contribute)
4. [Development Process](#development-process)
5. [Coding Standards](#coding-standards)
6. [Testing](#testing)
7. [Documentation](#documentation)
8. [Pull Request Process](#pull-request-process)
9. [Community](#community)

## Code of Conduct

This project adheres to the Contributor Covenant Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/heart-disease-prediction.git
   ```
3. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## How to Contribute

### Reporting Bugs
- Use the GitHub issue tracker
- Include detailed steps to reproduce
- Provide information about your environment
- Include screenshots if applicable

### Suggesting Enhancements
- Describe the enhancement in detail
- Explain why it would be useful
- Provide examples of how it would work

### Code Contributions
- Fix bugs
- Implement new features
- Improve documentation
- Optimize performance
- Add tests

## Development Process

### Setting Up the Development Environment

1. Follow the setup instructions in the [Deployment Guide](DEPLOYMENT_GUIDE.md)
2. Install development dependencies:
   ```bash
   # Backend
   pip install -r backend/requirements-dev.txt
   
   # Frontend
   npm install
   ```

### Project Structure
```
heart-disease-prediction/
├── backend/              # Python Flask API
│   ├── api/              # API endpoints and configuration
│   ├── src/              # Source code
│   │   ├── data_processing/  # Data preprocessing
│   │   ├── model_training/   # Model training
│   │   └── prediction/       # Prediction service
│   ├── tests/            # Unit and integration tests
│   └── notebooks/        # Jupyter notebooks
├── frontend/             # React frontend
│   ├── src/              # Source code
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── styles/       # CSS and styling
│   └── public/           # Static assets
├── docker/               # Docker configuration
├── docs/                 # Documentation
└── scripts/              # Utility scripts
```

## Coding Standards

### Backend (Python)
- Follow PEP 8 style guide
- Use type hints where possible
- Write docstrings for all functions and classes
- Keep functions small and focused
- Use meaningful variable names

Example:
```python
def calculate_bmi(weight: float, height: float) -> float:
    """
    Calculate Body Mass Index (BMI).
    
    Args:
        weight (float): Weight in kilograms
        height (float): Height in meters
        
    Returns:
        float: BMI value
        
    Raises:
        ValueError: If weight or height is not positive
    """
    if weight <= 0 or height <= 0:
        raise ValueError("Weight and height must be positive")
    
    return weight / (height ** 2)
```

### Frontend (JavaScript/React)
- Follow Airbnb JavaScript Style Guide
- Use functional components with hooks
- Use PropTypes for component props
- Keep components small and focused
- Use meaningful variable and function names

Example:
```jsx
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ text, onClick, variant = 'primary' }) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger'])
};

export default Button;
```

## Testing

### Backend Testing
- Use pytest for unit and integration tests
- Aim for >80% code coverage
- Test edge cases and error conditions
- Use fixtures for test data

Running tests:
```bash
cd backend
pytest tests/ -v
pytest --cov=src tests/
```

### Frontend Testing
- Use Jest and React Testing Library
- Test component rendering and behavior
- Test user interactions
- Mock API calls

Running tests:
```bash
cd frontend
npm test
```

### Writing Tests
```python
# backend/tests/test_example.py
import pytest
from src.example_module import example_function

def test_example_function():
    """Test example function with valid input."""
    result = example_function(2, 3)
    assert result == 5

def test_example_function_invalid_input():
    """Test example function with invalid input."""
    with pytest.raises(ValueError):
        example_function(-1, 3)
```

## Documentation

### Code Documentation
- Write clear docstrings for all public functions and classes
- Use examples in docstrings when helpful
- Document complex algorithms and business logic

### User Documentation
- Update README.md for major changes
- Add sections to user guides for new features
- Keep API documentation up to date

### Inline Comments
- Explain why, not what
- Comment complex or non-obvious code
- Keep comments up to date with code changes

## Pull Request Process

1. **Before Submitting**
   - Ensure all tests pass
   - Update documentation if needed
   - Follow coding standards
   - Write clear commit messages

2. **Creating Pull Request**
   - Use a clear, descriptive title
   - Provide a detailed description of changes
   - Reference any related issues
   - Include screenshots for UI changes

3. **Review Process**
   - At least one maintainer review required
   - Address all review comments
   - CI checks must pass
   - Squash and merge after approval

4. **After Merge**
   - Delete the feature branch
   - Update your fork's main branch

### Commit Message Guidelines
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests liberally

Example:
```
feat: add batch prediction endpoint

Implement batch prediction functionality to allow processing
multiple patients at once. This improves efficiency for healthcare
providers who need to process large numbers of patients.

Closes #123
```

## Community

### Communication
- Join our Slack/Discord community
- Participate in discussions
- Help other contributors
- Share your experiences

### Recognition
- Contributors will be listed in CONTRIBUTORS.md
- Significant contributions may receive special recognition
- We appreciate all forms of contribution, not just code

### Getting Help
- Check existing issues and documentation
- Ask questions in the community channels
- Contact maintainers for complex issues

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Heart Disease Prediction System! Your efforts help make healthcare more accessible and improve patient outcomes.