# Heart Disease Prediction Model Training Script (PowerShell)

Write-Host "🤖 Starting Heart Disease Prediction Model Training..." -ForegroundColor Green

# Change to backend directory
Set-Location -Path "..\backend"

# Activate virtual environment if it exists
if (Test-Path -Path "venv\Scripts\Activate.ps1") {
    Write-Host "🔧 Activating virtual environment..." -ForegroundColor Yellow
    .\venv\Scripts\Activate.ps1
} elseif (Test-Path -Path "venv\Scripts\activate.bat") {
    Write-Host "🔧 Activating virtual environment (batch)..." -ForegroundColor Yellow
    .\venv\Scripts\activate.bat
}

# Run the training script
Write-Host "📊 Running model training..." -ForegroundColor Yellow
python -c "
import sys
sys.path.insert(0, '.')
from src.model_training.train import main_training_pipeline
print('Loading and preprocessing data...')
results = main_training_pipeline()
print('\n✅ Training completed successfully!')
print(f'🏆 Best Model: {results[\"best_model_name\"]}')
print(f'📈 Accuracy: {results[\"best_metrics\"][\"accuracy\"]:.4f}')
print(f'🎯 F1 Score: {results[\"best_metrics\"][\"f1_score\"]:.4f}')
print(f'🔒 ROC AUC: {results[\"best_metrics\"][\"roc_auc\"]:.4f}')
print('\n💾 Model saved to backend/models/trained_models/')
"

# Change back to scripts directory
Set-Location -Path "..\scripts"

Write-Host "🎉 Model training completed!" -ForegroundColor Green