const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { PythonShell } = require('python-shell');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.array('resumes', 5), async (req, res) => {
    try {
        const extractedData = [];

        for (const file of req.files) {
            const dataBuffer = fs.readFileSync(file.path);
            const data = await pdfParse(dataBuffer);
            extractedData.push({ filename: file.originalname, content: data.text });
        }

        // Send extracted text to Python for feature extraction and scaling
        PythonShell.run('process_resumes.py', { args: [JSON.stringify(extractedData)] }, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(JSON.parse(results[0]));
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
