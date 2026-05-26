import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Destination from './models/Destination.js';
import Booking from './models/Booking.js';
import ContactMessage from './models/ContactMessage.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();
connectDB();

const seedDatabase = async () => {
  try {
    // 1. Clear existing collections
    await User.deleteMany({});
    await Destination.deleteMany({});
    await Booking.deleteMany({});
    await ContactMessage.deleteMany({});
    console.log('Database cleared of existing records.');

    // 2. Create Default Admin
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@jetvoyager.com',
      password: 'adminpassword', // Will be hashed via pre-save hook
      phone: '0771122334',
      nic: 'ADMIN1002V',
      role: 'admin',
    });
    console.log('Default Admin Account created: admin@jetvoyager.com / adminpassword');

    // 3. Create Hotel Agent Partners
    const agentParis = await User.create({
      name: 'Hotel Agent Paris',
      email: 'agent.paris@jetvoyager.com',
      password: 'agentpassword',
      phone: '0772233445',
      nic: 'AGENT001',
      role: 'agent',
      hotelName: 'Hôtel Plaza Athénée',
      location: 'Paris, France',
      noOfRooms: 40,
      description: 'Stunning luxury Palace hotel located in the heart of Paris, featuring unmatched private dining, spa facilities, and Eiffel Tower balconies.',
      features: ['Free Wi-Fi', '24/7 Butler Service', 'Michelin Star Dining', 'Spa & Wellness'],
      images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'],
      roomTypes: [
        { name: 'Deluxe Suite', price: 450, capacity: 2, status: 'Available' },
        { name: 'Executive Penthouse', price: 950, capacity: 4, status: 'Available' },
        { name: 'Single Standard', price: 200, capacity: 1, status: 'Available' },
      ],
    });

    const agentKyoto = await User.create({
      name: 'Hotel Agent Kyoto',
      email: 'agent.kyoto@jetvoyager.com',
      password: 'agentpassword',
      phone: '0773344556',
      nic: 'AGENT002',
      role: 'agent',
      hotelName: 'Sowaka Imperial Ryokan',
      location: 'Kyoto, Japan',
      noOfRooms: 20,
      description: 'A restored traditional ryokan set in Kyotos historic Gion district, offering absolute serenity, luxury garden views, and tatami dining.',
      features: ['Free Wi-Fi', 'Garden Courtyards', 'Private Onsen', 'Traditional Kaiseki Breakfast'],
      images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'],
      roomTypes: [
        { name: 'Tatami Deluxe Room', price: 320, capacity: 2, status: 'Available' },
        { name: 'Garden View Ryokan Suite', price: 680, capacity: 4, status: 'Available' },
      ],
    });

    const agentRome = await User.create({
      name: 'Hotel Agent Rome',
      email: 'agent.rome@jetvoyager.com',
      password: 'agentpassword',
      phone: '0774455667',
      nic: 'AGENT003',
      role: 'agent',
      hotelName: 'The Roma Splendour Inn',
      location: 'Rome, Italy',
      noOfRooms: 30,
      description: 'Overlooking the Spanish Steps, this boutique lodging provides private terraces, classical Italian architecture, and private historical curators.',
      features: ['Free Wi-Fi', 'Rooftop Lounge', 'Colosseum Airport Transfer', 'Private Terrace'],
      images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80'],
      roomTypes: [
        { name: 'Classic Balcony Suite', price: 280, capacity: 2, status: 'Available' },
        { name: 'Imperial Roman Apartment', price: 580, capacity: 6, status: 'Available' },
      ],
    });
    console.log('Hotel Agent Partners created.');

    // 4. Create Initial Destinations
    await Destination.create([
      {
        name: 'Paris, France',
        location: 'Paris, France',
        description: 'Known as the City of Light, Paris is a global center for art, fashion, gastronomy, and culture. Stroll along the Seine, admire the architectural detail of the Eiffel Tower, and enjoy private viewings at the Louvre.',
        images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'],
      },
      {
        name: 'Kyoto, Japan',
        location: 'Kyoto, Japan',
        description: 'Kyoto, once the capital of Japan, is famous for its numerous classical Buddhist temples, gardens, imperial palaces, Shinto shrines, and traditional wooden ryokan homes. Experience authentic tea ceremonies and serene cherry blossom parks.',
        images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'],
      },
      {
        name: 'Rome, Italy',
        location: 'Rome, Italy',
        description: 'A sprawling, cosmopolitan city with nearly 3,000 years of globally influential art, architecture, and culture. Ancient ruins such as the Colosseum and the Roman Forum evoke the power of the former Roman Empire.',
        images: ['https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80'],
      },
      {
        name: 'New York, USA',
        location: 'New York, USA',
        description: 'New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that’s among the world’s major commercial, financial and cultural centers.',
        images: ['https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80'],
      },
    ]);
    console.log('Initial travel destinations created.');

    console.log('Database successfully seeded with premium luxury items!');
    process.exit();
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
