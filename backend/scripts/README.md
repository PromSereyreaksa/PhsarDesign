# Database Resync & Seeding Scripts

This directory contains scripts to completely reset and populate your ArtLink database with realistic test data.

## ⚠️ Important Warning

**These scripts will DROP ALL EXISTING DATA** in your database and recreate all tables from scratch. Only use this in development environments!

## 🚀 Quick Start

### Method 1: Using npm scripts (Recommended)
```bash
# Navigate to backend directory
cd backend

# Run the resync and seed process
npm run resync
# or
npm run seed
```

### Method 2: Direct execution
```bash
# Navigate to backend directory
cd backend

# Run directly
node scripts/runSeed.js
```

## 📊 What Gets Created

The script creates **100 records** for each of the following:

### Users (100 total)
- **50 Artists** (user1@example.com to user50@example.com)
- **50 Clients** (user51@example.com to user100@example.com)
- All passwords: `password123`

### Core Data
- **100 Availability Posts** - Services offered by artists
- **100 Job Posts** - Jobs posted by clients  
- **100 Projects** - Active and completed projects
- **100 Applications** - Mix of artist-to-job and client-to-service applications

### Supporting Data
- **100 Portfolio Items** - Artist portfolio pieces
- **100 Reviews** - Project reviews and ratings
- **100 Messages** - User-to-user communications
- **100 Notifications** - System notifications
- **100 Analytics Records** - User interaction tracking

## 🔧 Generated Data Features

### Realistic Relationships
- Artists have skills, specialties, and hourly rates
- Clients have organizations and contact information
- Applications link artists to jobs and clients to services
- Projects are properly associated with clients and artists
- Reviews are linked to completed projects

### Categories & Skills
- **Categories**: illustration, design, photography, writing, video, music, animation, web-development, other
- **Skills**: Over 20 different creative skills randomly assigned
- **Pricing**: Realistic price ranges for different service types

### Statuses & States
- **Projects**: open, in_progress, completed, cancelled
- **Applications**: pending, accepted, rejected, converted_to_project
- **Availability Posts**: active, paused, closed
- **Job Posts**: open, in_progress, completed, closed

## 🧪 Test Data Details

### Login Credentials
```
Artist Accounts:
- Email: user1@example.com to user50@example.com
- Password: password123
- Role: artist

Client Accounts:  
- Email: user51@example.com to user100@example.com
- Password: password123
- Role: client
```

### Sample Data Includes
- **Random Names**: Realistic first and last names
- **Company Names**: Varied organization names for clients
- **Descriptions**: Contextual text for posts and projects
- **Images**: Placeholder images via picsum.photos
- **Dates**: Realistic creation and update timestamps
- **Ratings**: 1-5 star ratings with tendency toward positive

## 🔍 Data Verification

After running the script, you can verify the data:

```sql
-- Check record counts
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'artists', COUNT(*) FROM artists  
UNION ALL
SELECT 'clients', COUNT(*) FROM clients
UNION ALL
SELECT 'availability_posts', COUNT(*) FROM availability_posts
UNION ALL
SELECT 'job_posts', COUNT(*) FROM job_posts
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
UNION ALL
SELECT 'applications', COUNT(*) FROM applications;

-- Check application types
SELECT applicationType, COUNT(*) 
FROM applications 
GROUP BY applicationType;

-- Check project statuses
SELECT status, COUNT(*) 
FROM projects 
GROUP BY status;
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```
   Error: Connection refused
   ```
   - Ensure PostgreSQL is running
   - Check database credentials in `.env` file
   - Verify database exists

2. **Permission Errors**
   ```
   Error: permission denied
   ```
   - Check database user permissions
   - Ensure user can CREATE/DROP tables

3. **Missing Environment Variables**
   ```
   Error: DB_NAME is not defined
   ```
   - Create `.env` file in backend directory
   - Add required database configuration

### Required Environment Variables
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=artlink
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

## 📝 Script Structure

- **`resyncAndSeed.js`** - Main seeding logic with data generation
- **`runSeed.js`** - Runner script with environment setup and error handling
- **`README.md`** - This documentation file

## 🛠️ Customization

To modify the seeding behavior:

1. **Change record counts**: Edit the loop limits in `resyncAndSeed.js`
2. **Add new data types**: Create new sections following existing patterns
3. **Modify relationships**: Adjust the foreign key assignments
4. **Custom categories**: Update the `categories` array

## 📈 Performance

- **Execution Time**: ~30-60 seconds depending on your system
- **Database Size**: ~10-20MB after completion
- **Memory Usage**: Minimal, uses bulk inserts for efficiency

## 🔒 Security Notes

- Generated passwords are hashed with bcrypt
- Email addresses use safe example.com domain
- No real personal information is generated
- Placeholder images are safe external URLs

## 📞 Support

If you encounter issues:

1. Check PostgreSQL is running: `pg_ctl status`
2. Verify database exists: `psql -l`
3. Test connection: `psql -h localhost -U username -d artlink`
4. Review error logs in the console output

---

**Happy coding! 🎨✨**