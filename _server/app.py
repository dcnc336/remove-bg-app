import os
from flask import Flask, request, jsonify, send_file ,make_response,render_template
from flask_cors import CORS
from time import perf_counter
# from backgroundremover import utilities
# from backgroundremover.bg import remove

def remove_image_background(input_path, output_path, debugger=False):
    ''' NOTE: Models and modules will take some extra time to load during your first execution.\n
        NOTE: If you want to play around with the default parameters, check https://github.com/nadermx/backgroundremover see what they mean.\n
        Set 'debugger=True' to see execution debugs.\n
    '''

    # Set default parameters for background remover function.
    default_parameters = {
    'model': 'u2net',
    'alpha_matting': False,
    'alpha_matting_foreground_threshold': 240,
    'alpha_matting_background_threshold': 10,
    'alpha_matting_erode_size': 10,
    'alpha_matting_base_size': 1000,
    }

    # Convert paths to absolute paths.
    input_path, output_path = os.path.abspath(input_path), os.path.abspath(output_path)

    # Check if paths exist.
    if not os.path.exists(input_path):
        raise OSError(f'Path {input_path} does not exist.')
    if not os.path.exists(os.path.dirname(output_path)):
        raise OSError(f'Path {output_path} does not exist.')
    
    # Load modules if running for the first time.
    if 'modules_imported' not in globals():
        global modules_imported, remove, utilities
        if debugger: print("Running app for the first time, importing modules.")
        
        modules_imported = ''

    # Open input image.
    with open(input_path, 'rb') as file:
        image = file.read()

    # Load model for the first time.
    if 'model_loaded' not in globals():
        global model_loaded
        if debugger: print('Loading model...')
        model_loaded = ''
    
    # Remove background from the image and return it as a bytes object.
    t1 = perf_counter()
    img_removed_bg_bytes = remove(image, model_name=default_parameters['model'],alpha_matting=default_parameters['alpha_matting'], alpha_matting_foreground_threshold=default_parameters['alpha_matting_foreground_threshold'],alpha_matting_background_threshold=default_parameters['alpha_matting_background_threshold'],alpha_matting_erode_structure_size=default_parameters['alpha_matting_erode_size'],alpha_matting_base_size=default_parameters['alpha_matting_base_size'])
    if debugger: print(f"{output_path} done. Took {(perf_counter()-t1):003} seconds.")

    # Write bytes object to your output path.
    with open(output_path, 'wb') as file:
        file.write(img_removed_bg_bytes)

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
        print(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
        # remove_image_background(f"uploads/{file.filename}", f"outputs/{file.filename}")
        return make_response(send_file(f"uploads/{file.filename}",download_name=file.filename,as_attachment=True))

if __name__ == '__main__':
    app.run(host='0.0.0.0',port='8000', debug=True)

