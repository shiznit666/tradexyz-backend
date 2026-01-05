# app.py - Backend Flask avec SDK Hyperliquid officiel
from flask import Flask, jsonify, request
from flask_cors import CORS
from hyperliquid.info import Info
from hyperliquid.utils import constants
import os

app = Flask(__name__)
CORS(app)  # Active CORS pour toutes les routes

# Initialiser l'API Hyperliquid
info = Info(constants.MAINNET_API_URL, skip_ws=True)

@app.route('/')
def home():
    return jsonify({
        'status': 'ok',
        'message': 'Trade.xyz Backend API - SDK Hyperliquid',
        'endpoints': {
            'meta': '/api/meta',
            'prices': '/api/prices',
            'user': '/api/user/<address>',
            'fills': '/api/fills/<address>'
        }
    })

@app.route('/api/meta')
def get_meta():
    """Récupérer les métadonnées (liste des assets)"""
    try:
        meta = info.meta()
        return jsonify(meta)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/prices')
def get_prices():
    """Récupérer tous les prix"""
    try:
        prices = info.all_mids()
        return jsonify(prices)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/<address>')
def get_user_state(address):
    """Récupérer l'état d'un utilisateur"""
    try:
        # Valider l'adresse
        if not address or not address.startswith('0x') or len(address) != 42:
            return jsonify({'error': 'Invalid address format'}), 400
        
        user_state = info.user_state(address.lower())
        return jsonify(user_state)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/fills/<address>')
def get_user_fills(address):
    """Récupérer les trades d'un utilisateur"""
    try:
        # Valider l'adresse
        if not address or not address.startswith('0x') or len(address) != 42:
            return jsonify({'error': 'Invalid address format'}), 400
        
        fills = info.user_fills(address.lower())
        return jsonify(fills)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/candles/<coin>')
def get_candles(coin):
    """Récupérer les données de chandelier pour un asset"""
    try:
        interval = request.args.get('interval', '1h')
        start_time = request.args.get('start_time', None)
        end_time = request.args.get('end_time', None)
        
        candles = info.candles_snapshot(
            coin=coin,
            interval=interval,
            start_time=int(start_time) if start_time else None,
            end_time=int(end_time) if end_time else None
        )
        return jsonify(candles)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health():
    """Endpoint de santé"""
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
