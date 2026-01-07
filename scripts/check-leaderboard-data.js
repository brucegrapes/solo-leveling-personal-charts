require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all users
    const users = await mongoose.connection.db.collection('users').find().toArray();
    console.log('👥 USERS:');
    users.forEach(user => {
      console.log(`  - ID: ${user._id}`);
      console.log(`    Username: ${user.username}`);
      console.log(`    Role: ${user.role}`);
      console.log('');
    });

    // Get all players
    const players = await mongoose.connection.db.collection('players').find().toArray();
    console.log('\n🎮 PLAYERS:');
    players.forEach(player => {
      console.log(`  - userId: ${player.userId}`);
      console.log(`    XP: ${player.userStats?.experience || 0}`);
      console.log(`    Level: ${player.userStats?.level || 1}`);
      console.log(`    WeeklyXP: ${player.weeklyXP || 0}`);
      console.log(`    MonthlyXP: ${player.monthlyXP || 0}`);
      console.log('');
    });

    // Check if userId matches _id
    console.log('\n🔍 CHECKING ID MATCHES:');
    players.forEach(player => {
      const matchingUser = users.find(u => u._id.toString() === player.userId);
      if (matchingUser) {
        console.log(`  ✅ Player userId ${player.userId} matches user: ${matchingUser.username}`);
      } else {
        console.log(`  ❌ Player userId ${player.userId} has NO matching user`);
      }
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkData();
