import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

CORS(app)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
        # os.system('')
        return jsonify({"message": "File uploaded successfully"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0',port='8000', debug=True)

