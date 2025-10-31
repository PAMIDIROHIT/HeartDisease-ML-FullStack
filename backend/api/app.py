"""
Main Flask Application for Heart Disease Prediction API
"""
import os
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import json

def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(levelname)s %(name)s %(message)s'
    )
    app.logger.setLevel(logging.INFO)
    
    # Enable CORS for all routes
    CORS(app)
    
    # Configure JSON serialization
    app.config['JSON_SORT_KEYS'] = False
    
    # Load configuration from environment variables
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-change-in-production')
    app.config['ENV'] = os.environ.get('FLASK_ENV', 'development')
    
    # Register error handlers
    @app.errorhandler(400)
    def bad_request(error):
        app.logger.error(f"Bad request: {error}")
        return jsonify({
            'error': 'Bad Request',
            'message': str(error),
            'timestamp': datetime.now().isoformat()
        }), 400
    
    @app.errorhandler(404)
    def not_found(error):
        app.logger.error(f"Not found: {error}")
        return jsonify({
            'error': 'Not Found',
            'message': 'The requested resource was not found',
            'timestamp': datetime.now().isoformat()
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error(f"Internal server error: {error}")
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred',
            'timestamp': datetime.now().isoformat()
        }), 500
    
    # Middleware for request logging
    @app.before_request
    def log_request_info():
        app.logger.info('Request: %s %s', 
                       str(request.method), 
                       str(request.url))
    
    @app.after_request
    def log_response_info(response):
        app.logger.info('Response: %s %s -> %s', 
                       str(request.method), 
                       str(request.url), 
                       str(response.status_code))
        return response
    
    # Import and register routes
    from . import routes
    app.register_blueprint(routes.bp, url_prefix='/api')
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'environment': app.config['ENV']
        })
    
    return app

# For running the app directly
if __name__ == '__main__':
    app = create_app()
    
    # Run the app
    app.run(
        host=os.environ.get('HOST', '0.0.0.0'),
        port=int(os.environ.get('PORT', 5000)),
        debug=os.environ.get('FLASK_ENV') == 'development'
    )