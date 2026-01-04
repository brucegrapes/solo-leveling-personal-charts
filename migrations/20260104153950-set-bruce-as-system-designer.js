module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    // Check if users collection has any documents first
    const userCount = await db.collection('users').countDocuments({});
    
    if (userCount === 0) {
      console.log('⚠️  Users collection is empty. Please register users first.');
      console.log('   1. Start the app: npm run dev');
      console.log('   2. Register at: http://localhost:3001/auth/register');
      console.log('   3. Rerun this migration: npm run db:migrate:down && npm run db:migrate');
      return;
    }

    // Set bruce user as System Designer
    const result = await db.collection('users').updateOne(
      { username: 'bruce' },
      { $set: { role: 'System Designer' } }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Successfully set bruce as System Designer');
    } else if (result.matchedCount > 0) {
      console.log('ℹ️  bruce already has System Designer role');
    } else {
      console.log('⚠️  User bruce not found. Available users:');
      const users = await db.collection('users').find({}, { projection: { username: 1 } }).toArray();
      users.forEach(user => console.log(`   - ${user.username}`));
      console.log('\n   Please ensure user "bruce" exists, then rerun: npm run db:migrate:down && npm run db:migrate');
    }
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    // Rollback: Set bruce back to Player role
    const result = await db.collection('users').updateOne(
      { username: 'bruce' },
      { $set: { role: 'Player' } }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Successfully reverted bruce to Player role');
    } else {
      console.log('ℹ️  No changes made');
    }
  }
};
