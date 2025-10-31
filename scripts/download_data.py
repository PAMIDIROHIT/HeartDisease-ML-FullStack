#!/usr/bin/env python3
"""
Data Download Script for Heart Disease Prediction System
"""

import os
import sys
import urllib.request
import zipfile

def download_heart_disease_data():
    """Download the heart disease dataset from UCI repository"""
    print("⬇️  Downloading Heart Disease Dataset...")
    
    # Create data directory
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'backend', 'data', 'raw')
    os.makedirs(data_dir, exist_ok=True)
    
    # Dataset URL (using a reliable source)
    # Note: The original UCI dataset may not be directly downloadable via HTTP
    # For this example, we'll provide instructions instead
    print("⚠️  Manual download required:")
    print("   Please download the heart.csv dataset from:")
    print("   https://archive.ics.uci.edu/ml/datasets/heart+disease")
    print("")
    print("   Alternative sources:")
    print("   1. Kaggle: https://www.kaggle.com/datasets/johnsmith88/heart-disease-dataset")
    print("   2. GitHub: Search for 'heart.csv' in machine learning repositories")
    print("")
    print("   Save the file as 'heart.csv' in:")
    print(f"   {data_dir}")
    
    # For demonstration, let's create a placeholder file
    placeholder_path = os.path.join(data_dir, 'heart.csv')
    if not os.path.exists(placeholder_path):
        with open(placeholder_path, 'w') as f:
            f.write("# Heart Disease Dataset\n")
            f.write("# Please replace this file with the actual dataset\n")
            f.write("# Columns: age,sex,cp,trestbps,chol,fbs,restecg,thalach,exang,oldpeak,slope,ca,thal,target\n")
            f.write("63,1,3,145,233,1,0,150,0,2.3,0,0,1,1\n")
            f.write("37,1,2,130,250,0,1,187,0,3.5,0,0,2,0\n")
        print(f"📝 Created placeholder file at {placeholder_path}")
        print("   Please replace it with the actual dataset")

def main():
    """Main function"""
    print("📥 Heart Disease Prediction System - Data Download")
    print("=" * 50)
    
    download_heart_disease_data()
    
    print("\n✅ Data setup completed!")
    print("Next steps:")
    print("1. Replace the placeholder heart.csv with the actual dataset")
    print("2. Run the model training script: python scripts/train_model.py")

if __name__ == "__main__":
    main()