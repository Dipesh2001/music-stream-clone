const User = require('../src/modules/users/user.model');

const seedUsers = async () => {
    try {
        await User.deleteMany({});
        console.log('Cleared existing users');

        const usersData = [
            {
                email: 'admin@musicapp.com',
                password: 'password123',
                name: 'Admin User',
                role: 'admin',
                isActive: true,
                avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=random'
            },
            {
                email: 'user@musicapp.com',
                password: 'password123',
                name: 'Test User',
                role: 'user',
                isActive: true,
                avatar: 'https://ui-avatars.com/api/?name=Test+User&background=random'
            },
            {
                email: 'inactive@musicapp.com',
                password: 'password123',
                name: 'Inactive User',
                role: 'user',
                isActive: false,
                avatar: 'https://ui-avatars.com/api/?name=Inactive+User&background=random'
            }
        ];

        const createdUsers = await User.create(usersData);
        console.log(`Successfully seeded ${createdUsers.length} users`);
        return createdUsers;
    } catch (error) {
        console.error('Error seeding users:', error);
        throw error;
    }
};

module.exports = seedUsers;
