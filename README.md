# face-annotator-yolo

A tool that detects faces and automatically annotates the size and coordinates of the bounding box. The tool uses [BlazeFace](https://github.com/tensorflow/tfjs-models/tree/master/blazeface) to detect faces. The generated txt files conforms to the format required by YOLO object detection, as seen below.
```txt
<object-class> <x> <y> <width> <height>
```
Each line in the txt file represents an annotation for the corresponding image.

# Requirements

- [Node.js](https://nodejs.org)

# Installation & Usage

1. Clone the repo and run `npm install`.
2. Run the app: `node app.js /path/to/images object-class`. The generated txt files will be placed in the same folder as your images and will have the same name as the corresponding image files.

# Notes

For compatibility, this tool uses the base `@tensorflow/tfjs` package. For increased performance, install `@tensorflow/tfjs-node` or `@tensorflow/tfjs-node-gpu`. Both of these require Python to be installed (and CUDA for the latter). You should also change the first line in `annotate.js` to require one of these packages.
