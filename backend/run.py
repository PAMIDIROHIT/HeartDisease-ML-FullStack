#!/usr/bin/env python3
"""
Main entry point for the Heart Disease Prediction System backend
"""

import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

def main():
    """Main function to run the Flask application"""
    print("🚀 Starting Heart Disease Prediction System Backend...")
    
    try:
        # Import and create the Flask app
        from api.app import create_app
        
        # Create the app
        app = create_app()
        
        # Get host and port from environment variables or use defaults
        host = os.environ.get('HOST', '0.0.0.0')
        port = int(os.environ.get('PORT', 5000))
        debug = os.environ.get('FLASK_ENV') == 'development'
        
        print(f"📍 Server running on http://{host}:{port}")
        print(f"🔧 Debug mode: {debug}")
        print("📈 Visit http://localhost:5000/health to check if the server is running")
        print("🛑 Press CTRL+C to stop the server")
        
        # Run the app
        app.run(host=host, port=port, debug=debug)
        
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Failed to start server: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()