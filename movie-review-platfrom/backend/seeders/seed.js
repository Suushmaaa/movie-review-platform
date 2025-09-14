const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const User = require('../models/User');
const Review = require('../models/Review');
require('dotenv').config();

const sampleMovies = [
    {
        title: "The Shawshank Redemption",
        overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        genres: ["Drama"],
        releaseYear: 1994,
        director: "Frank Darabont",
        cast: [
            { name: "Tim Robbins", character: "Andy Dufresne" },
            { name: "Morgan Freeman", character: "Ellis Boyd 'Red' Redding" }
        ],
        runtime: 142,
        posterUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        featured: true,
        trending: false
    },
    {
        title: "The Godfather",
        overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        genres: ["Crime", "Drama"],
        releaseYear: 1972,
        director: "Francis Ford Coppola",
        cast: [
            { name: "Marlon Brando", character: "Don Vito Corleone" },
            { name: "Al Pacino", character: "Michael Corleone" }
        ],
        runtime: 175,
        posterUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        featured: true,
        trending: true
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Clear existing data
        await Movie.deleteMany({});
        await User.deleteMany({});
        await Review.deleteMany({});
        
        // Create sample movies
        const movies = await Movie.create(sampleMovies);
        
        // Create admin user
        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@moviereview.com',
            password: 'password123',
            isAdmin: true
        });
        
        console.log('Database seeded successfully!');
        console.log(`Created ${movies.length} movies`);
        console.log('Admin user created - email: admin@moviereview.com, password: password123');
        
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();