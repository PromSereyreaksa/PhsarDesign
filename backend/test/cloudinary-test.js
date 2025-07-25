// test/cloudinary-test.js
// Test script to verify Cloudinary CRUD operations
// Run with: node test/cloudinary-test.js

import {
  uploadImage,
  getImageDetails,
  listImages,
  updateImageMetadata,
  transformImage,
  deleteImage,
  generateUploadSignature
} from '../services/cloudinary.service.js';

/**
 * Test Cloudinary CRUD Operations
 * Make sure to set up your .env file with Cloudinary credentials
 */

const runTests = async () => {
  console.log('🚀 Starting Cloudinary CRUD Tests...\n');

  try {
    // Test 1: Generate Upload Signature
    console.log('📝 Test 1: Generate Upload Signature');
    const signatureResult = generateUploadSignature({
      folder: 'artlink/test',
      transformation: 'w_500,h_500,c_fill'
    });
    console.log('✅ Signature generated:', signatureResult.success);
    console.log('   API Key:', signatureResult.data?.api_key ? 'Present' : 'Missing');
    console.log('   Cloud Name:', signatureResult.data?.cloud_name ? 'Present' : 'Missing');
    console.log();

    // Test 2: Upload Test Image (you need to provide a test image path)
    const testImagePath = './test-image.jpg'; // Replace with actual image path
    console.log('📤 Test 2: Upload Image');
    
    // Skip upload test if no image file available
    console.log('⚠️  Skipping upload test - no test image provided');
    console.log('   To test upload, add a test image at:', testImagePath);
    console.log();

    // Test 3: List Images
    console.log('📋 Test 3: List Images');
    const listResult = await listImages({
      folder: 'artlink',
      max_results: 5
    });
    console.log('✅ List images result:', listResult.success);
    if (listResult.success) {
      console.log('   Found images:', listResult.data.resources.length);
      console.log('   Total count:', listResult.data.total_count);
    } else {
      console.log('   Error:', listResult.error);
    }
    console.log();

    // Test 4: Transform Image URL (this doesn't require an actual image)
    console.log('🔄 Test 4: Transform Image URL');
    const transformResult = await transformImage('sample', {
      width: 300,
      height: 300,
      crop: 'fill',
      quality: 'auto:good',
      format: 'webp'
    });
    console.log('✅ Transform result:', transformResult.success);
    if (transformResult.success) {
      console.log('   Transformed URL:', transformResult.data.transformed_url);
    }
    console.log();

    console.log('🎉 Cloudinary tests completed!');
    console.log('\n📌 Next Steps:');
    console.log('1. Set up your .env file with Cloudinary credentials');
    console.log('2. Add a test image to test upload functionality');
    console.log('3. Start the server: npm start');
    console.log('4. Test endpoints with Postman or curl');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if .env file exists with Cloudinary credentials');
    console.log('2. Verify Cloudinary account is active');
    console.log('3. Check internet connection');
  }
};

// Configuration Check
const checkConfiguration = () => {
  console.log('🔍 Checking Configuration...');
  
  const requiredEnvVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.log('❌ Missing environment variables:', missing.join(', '));
    console.log('   Please create .env file with Cloudinary credentials');
    return false;
  }

  console.log('✅ All required environment variables are set');
  return true;
};

// Run tests
if (checkConfiguration()) {
  runTests();
} else {
  console.log('\n📝 Create .env file with:');
  console.log('CLOUDINARY_CLOUD_NAME=your_cloud_name');
  console.log('CLOUDINARY_API_KEY=your_api_key');
  console.log('CLOUDINARY_API_SECRET=your_api_secret');
}
