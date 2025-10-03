import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import mammoth from 'mammoth';
import { askAI } from '../utils/ai.js';
import PDFParser from 'pdf2json';

const router = express.Router();

// Configure multer for file uploads (use /tmp for Vercel)
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Use /tmp directory for Vercel serverless functions
    const uploadDir = process.env.VERCEL ? '/tmp' : 'uploads/';
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are allowed.'));
    }
  }
});

// Store file content in memory mapped by user ID
const fileContents = new Map();

// Test route to check if file routes are working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'File routes are working!', 
    timestamp: new Date().toISOString() 
  });
});

// ------------------ Upload Route ------------------
router.post('/upload', upload.single('file'), async (req, res) => {
  const userId = req.user.uid; // Get user ID from the authenticated request
  try {
    const file = req.file;
    console.log('📥 Received file:', file?.originalname);

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Clean up function for temporary files
    const cleanupFile = async (filePath) => {
      try {
        await fs.unlink(filePath);
        console.log('🧹 Cleaned up temporary file:', filePath);
      } catch (error) {
        console.error('❌ Error cleaning up file:', error);
      }
    };

    // 📝 PDF file
    if (file.mimetype === 'application/pdf') {
      const pdfParser = new PDFParser(null, {
        typeScriptDebug: true,  // Enable debug logging
        skipHtmlRender: true    // Skip HTML rendering since we only need text
      });
      
      try {
        console.log("🔄 Loading PDF file:", file.path);
        const text = await new Promise((resolve, reject) => {
          pdfParser.on("pdfParser_dataError", (error) => {
            console.error("PDF parsing error:", error);
            reject(error);
          });

          pdfParser.on("pdfParser_dataReady", () => {
            try {
              // Get the raw PDF data
              const pdfData = pdfParser.getRawTextContent();
              console.log("📄 Raw PDF data length:", pdfData.length);
              
              // Clean up the text
              const cleanText = pdfData
                .replace(/\r\n/g, '\n') // Normalize line endings
                .replace(/\s+/g, ' ')   // Normalize whitespace
                .trim();
              
              console.log("📄 Cleaned text length:", cleanText.length);
              
              if (!cleanText || cleanText.length === 0) {
                reject(new Error("PDF text extraction yielded empty content"));
              } else {
                resolve(cleanText);
              }
            } catch (err) {
              console.error("PDF text extraction error:", err);
              reject(err);
            }
          });

          pdfParser.loadPDF(file.path);
        });

        if (!text || text.trim().length === 0) {
          throw new Error("No text content extracted from PDF");
        }

        console.log(`📄 Extracted ${text.length} characters of text`);
        fileContents.set(userId, text);
        console.log(`📝 Stored ${text.length} characters for user ${userId}`);
        await cleanupFile(file.path);
        console.log('✅ PDF processed successfully');
        return res.json({ message: "PDF uploaded and processed" });
      } catch (error) {
        console.error('❌ PDF processing error:', error.message);
        console.error('Stack trace:', error.stack);
        await cleanupFile(file.path);
        return res.status(500).json({ 
          error: "Failed to process PDF file",
          details: error.message
        });
      }

    // 📝 DOCX file
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const result = await mammoth.extractRawText({ path: file.path });
        fileContents.set(userId, result.value);
        console.log(`📝 Stored ${result.value.length} characters for user ${userId}`);
        await cleanupFile(file.path);
        console.log('✅ DOCX processed successfully');
        return res.json({ message: "DOCX uploaded and processed" });
      } catch (error) {
        console.error('❌ DOCX processing error:', error);
        await cleanupFile(file.path);
        return res.status(500).json({ error: "Failed to process DOCX file" });
      }
    } else if (file.mimetype === 'text/plain') {
      try {
        const content = await fs.readFile(file.path, 'utf8');
        fileContents.set(userId, content);
        console.log(`📝 Stored ${content.length} characters for user ${userId}`);
        await cleanupFile(file.path);
        console.log('✅ Text file processed successfully');
        return res.json({ message: "Text file uploaded and processed" });
      } catch (error) {
        console.error('❌ Text file processing error:', error);
        await cleanupFile(file.path);
        return res.status(500).json({ error: "Failed to process text file" });
      }
    } else {
      await cleanupFile(file.path);
      console.log('❌ Unsupported file format:', file.mimetype);
      return res.status(400).json({ error: "Unsupported file format. Please upload a PDF, DOCX, or TXT file." });
    }

  } catch (err) {
    console.error('❌ Upload handler crashed:', err);
    res.status(500).json({ error: 'File processing failure' });
  }
});

// ------------------ Ask Route ------------------
router.post('/ask', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { question } = req.body;
    console.log('📝 Received question:', question);
    
    const userContent = fileContents.get(userId);
    console.log('📄 Stored content length for user', userId + ':', userContent?.length || 0);

    if (!question?.trim()) {
      console.log('❌ No question provided');
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!userContent?.trim()) {
      console.log('❌ No file content stored for user', userId);
      return res.status(400).json({ error: 'Please upload a file first' });
    }

    // Truncate content if it's too long
    const maxContentLength = 15000;
    let contentToUse = userContent;
    if (contentToUse.length > maxContentLength) {
      contentToUse = contentToUse.substring(0, maxContentLength) + '...';
      console.log(`⚠️ Content truncated from ${userContent.length} to ${maxContentLength} characters`);
    }

    const prompt = `You are an intelligent assistant analyzing a document. Based on the following content, please answer the user's question accurately and concisely.

Content: "${contentToUse}"

Question: "${question}"

Answer:`;

    const answer = await askAI(prompt);
    console.log('✅ Answer generated successfully');
    res.json({ answer });

  } catch (err) {
    console.error('❌ Ask error:', err);
    res.status(500).json({ 
      error: 'Failed to generate answer', 
      details: err.response?.data?.error || err.message 
    });
  }
});

export { router };