#!/bin/bash

# ArtLink Backend Setup Script
echo "🎨 ArtLink Backend - Cloudinary Setup"
echo "====================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your actual credentials."
    echo ""
    echo "🔑 Required Cloudinary credentials:"
    echo "   - CLOUDINARY_CLOUD_NAME"
    echo "   - CLOUDINARY_API_KEY" 
    echo "   - CLOUDINARY_API_SECRET"
    echo ""
    echo "📚 Get these from: https://cloudinary.com/console"
    echo ""
    read -p "Press Enter to continue after setting up .env file..."
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed."
fi

# Create uploads directory
if [ ! -d uploads ]; then
    echo "📁 Creating uploads directory..."
    mkdir uploads
    echo "✅ Uploads directory created."
fi

# Create test directory if it doesn't exist
if [ ! -d test ]; then
    mkdir test
fi

echo ""
echo "🚀 Setup complete! Next steps:"
echo ""
echo "1. Edit .env file with your Cloudinary credentials"
echo "2. Start the server:"
echo "   npm start"
echo ""
echo "3. Test the API endpoints:"
echo "   - Open test/cloudinary-test.html in your browser"
echo "   - Or run: node test/cloudinary-test.js"
echo ""
echo "4. API will be available at: http://localhost:3000"
echo "   - Upload endpoints: /api/upload/*"
echo "   - Health check: /health"
echo ""
echo "📖 For detailed documentation, see:"
echo "   - CLOUDINARY_CRUD_GUIDE.md"
echo "   - DEVELOPER_DOCUMENTATION.md"
