#!/usr/bin/env python3
"""
Model Training Script for Heart Disease Prediction System
"""

import subprocess
import sys
import os

def main():
    """Main training function"""
    print("🤖 Starting Heart Disease Prediction Model Training...")
    
    # Change to backend directory
    backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
    
    try:
        # Run the training script as a subprocess
        print("📊 Running model training...")
        result = subprocess.run([
            sys.executable, 
            '-c', 
            '''
import sys
sys.path.insert(0, ".")
from src.model_training.train import main_training_pipeline
print("Loading and preprocessing data...")
results = main_training_pipeline()
print()
print("✅ Training completed successfully!")
print(f"🏆 Best Model: {results["best_model_name"]}")
print(f"📈 Accuracy: {results["best_metrics"]["accuracy"]:.4f}")
print(f"🎯 F1 Score: {results["best_metrics"]["f1_score"]:.4f}")
print(f"🔒 ROC AUC: {results["best_metrics"]["roc_auc"]:.4f}")
print()
print("💾 Model saved to backend/models/trained_models/")
            '''
        ], 
        cwd=backend_path,
        check=True,
        text=True,
        capture_output=True
        )
        
        print(result.stdout)
        if result.stderr:
            print(result.stderr)
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Training failed with return code {e.returncode}")
        print(f"STDOUT: {e.stdout}")
        print(f"STDERR: {e.stderr}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Training failed: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()