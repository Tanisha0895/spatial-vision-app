# Spatial Vision AI - phone app (no laptop needed)

Everything runs on the phone: YOLOv8n (objects) + MiDaS Small (depth), same thresholds and alert
rules as the laptop system. Voice warnings, voice commands ("where am I", "pause", "resume",
"repeat", "help"), tap = "where am I", vibration for VERY CLOSE objects. Works offline after the first open.

Put this folder online once (free, GitHub Pages), then open the link on the phone in Chrome
and choose "Add to Home screen". Steps: see the guide you received with this folder.

| File | Role |
| --- | --- |
| index.html | The whole app (camera, AI, voice, screen) |
| models/ | yolov8n.onnx + midas_small.onnx (split in 3 parts, each under GitHub's 25 MB upload limit) |
| ort/ | ONNX Runtime Web 1.20.1 (runs the models in the browser) |
| sw.js | Offline use + multi-core speed-up |
| manifest.json, icon-*.png | "Add to Home screen" app icon |
