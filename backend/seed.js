import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Activity from './models/Activity.js';
import Booking from './models/Booking.js';
import ContactMessage from './models/ContactMessage.js';
import Trip from './models/Trip.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();
connectDB();

const seedDatabase = async () => {
  try {
    // 1. Clear existing collections
    await User.deleteMany({});
    await Activity.deleteMany({});
    await Booking.deleteMany({});
    await ContactMessage.deleteMany({});
    await Trip.deleteMany({});
    console.log('Database cleared of existing records.');

    // 2. Create Default Admin
    await User.create({
      name: 'System Admin',
      email: 'admin@jetvoyager.com',
      password: 'adminpassword', // Will be hashed via pre-save hook
      phone: '0771122334',
      nic: 'ADMIN1002V',
      role: 'admin',
    });
    console.log('Default Admin Account created: admin@jetvoyager.com / adminpassword');

    // 3. Create Hotel Agent Partners
    await User.create([
      {
        name: 'Hotel Agent Paris',
        email: 'agent.paris@jetvoyager.com',
        password: 'agentpassword',
        phone: '0772233445',
        nic: 'AGENT001',
        role: 'agent',
        approvalStatus: 'approved',
        hotelName: 'Hôtel Plaza Athénée',
        location: 'Paris, France',
        noOfRooms: 40,
        description: 'Stunning luxury Palace hotel located in the heart of Paris, featuring unmatched private dining, spa facilities, and Eiffel Tower balconies.',
        features: ['Free Wi-Fi', '24/7 Butler Service', 'Michelin Star Dining', 'Spa & Wellness'],
        thingsToDo: [
          'Private Eiffel Tower Terrace Dinner',
          'Luxury Dior Spa Treatments',
          'Michelin-starred Pastry Tasting',
          'Chauffeur-driven Seine River Excursion'
        ],
        images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'],
        roomTypes: [
          { name: 'Deluxe Suite', price: 450, capacity: 2, status: 'Available' },
          { name: 'Executive Penthouse', price: 950, capacity: 4, status: 'Available' },
          { name: 'Single Standard', price: 200, capacity: 1, status: 'Available' },
        ],
      },
      {
        name: 'Hotel Agent Kyoto',
        email: 'agent.kyoto@jetvoyager.com',
        password: 'agentpassword',
        phone: '0773344556',
        nic: 'AGENT002',
        role: 'agent',
        approvalStatus: 'approved',
        hotelName: 'Sowaka Ryokan',
        location: 'Kyoto, Japan',
        noOfRooms: 20,
        description: 'A restored traditional ryokan set in Kyotos historic Gion district, offering absolute serenity, luxury garden views, and tatami dining.',
        features: ['Free Wi-Fi', 'Garden Courtyards', 'Private Onsen', 'Kaiseki Dinner'],
        thingsToDo: [
          'Zen garden meditation with tea master',
          'Private Onsen thermal bath rituals',
          'Authentic multi-course Gion Kaiseki dining',
          'Historic Gion lantern night walking tour'
        ],
        images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'],
        roomTypes: [
          { name: 'Tatami Deluxe Room', price: 320, capacity: 2, status: 'Available' },
          { name: 'Garden View Ryokan Suite', price: 680, capacity: 4, status: 'Available' },
        ],
      },
      {
        name: 'Hotel Agent Rome',
        email: 'agent.rome@jetvoyager.com',
        password: 'agentpassword',
        phone: '0774455667',
        nic: 'AGENT003',
        role: 'agent',
        approvalStatus: 'approved',
        hotelName: 'The Roma Splendour Inn',
        location: 'Rome, Italy',
        noOfRooms: 30,
        description: 'Overlooking the Spanish Steps, this boutique lodging provides private terraces, classical Italian architecture, and private historical curators.',
        features: ['Free Wi-Fi', 'Rooftop Lounge', 'Colosseum Airport Transfer', 'Private Terrace'],
        thingsToDo: [
          'Vatican Museums early-access keys',
          'Private rooftop classic cocktail tasting',
          'VIP Colosseum gladiator arena tour',
          'Fendi private boutique shopping escort'
        ],
        images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80'],
        roomTypes: [
          { name: 'Classic Balcony Suite', price: 280, capacity: 2, status: 'Available' },
          { name: 'Imperial Roman Apartment', price: 580, capacity: 6, status: 'Available' },
        ],
      }
    ]);
    console.log('Hotel Agent Partners created.');

    // 4. Create Initial Activities (Granular address location properties)
    await Activity.create([
      {
        name: 'Private Louvre Museum Guided Tour',
        description: 'Skip the heavy lines and explore key historical artifacts like the Mona Lisa, Winged Victory of Samothrace, and Venus de Milo with a private museum curator.',
        images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'],
        duration: '3 hours',
        price: 150,
        location: {
          country: 'France',
          state: 'Île-de-France',
          city: 'Paris',
          postalCode: '75001',
          address: 'Rue de Rivoli',
          coordinates: { lat: 48.8606, lng: 2.3376 }
        }
      },
      {
        name: 'VIP Eiffel Tower Access & Champagne',
        description: 'Ascend to the highest summit deck of the Eiffel Tower with dedicated skip-the-line privileges. Toast the gorgeous view with fine French champagne at the summit lounge.',
        images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'],
        duration: '2 hours',
        price: 120,
        location: {
          country: 'France',
          state: 'Île-de-France',
          city: 'Paris',
          postalCode: '75007',
          address: 'Champ de Mars, 5 Avenue Anatole France',
          coordinates: { lat: 48.8584, lng: 2.2945 }
        }
      },
      {
        name: 'Traditional Gion Kaiseki Dining & Tea Ceremony',
        description: 'Savor an exquisite multi-course Kaiseki tasting dinner followed by an authentic Zen tea ceremony directed by a certified Japanese tea master inside a historic Gion tea house.',
        images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'],
        duration: '4 hours',
        price: 180,
        location: {
          country: 'Japan',
          state: 'Kyoto Prefecture',
          city: 'Kyoto',
          postalCode: '605-0074',
          address: 'Gionmachi Minamigawa',
          coordinates: { lat: 35.0037, lng: 135.7782 }
        }
      },
      {
        name: 'Golden Pavilion & Arashiyama Bamboo Forest Tour',
        description: 'Walk through the breathtaking green bamboo paths of Arashiyama and visit the historic Golden Pavilion (Kinkaku-ji) reflecting beautifully over Kyotos Kyoko-chi mirror pond.',
        images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'],
        duration: 'Full Day',
        price: 80,
        location: {
          country: 'Japan',
          state: 'Kyoto Prefecture',
          city: 'Kyoto',
          postalCode: '603-8361',
          address: '1 Kinkakujicho',
          coordinates: { lat: 35.0394, lng: 135.7292 }
        }
      },
      {
        name: 'Skip-the-Line Colosseum & Roman Forum VIP Entry',
        description: 'Gain direct skip-the-line access to the Gladiator arena floor of the Colosseum. Tour classical Roman columns and temples within the historical heart of the Forum ruins.',
        images: ['https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80'],
        duration: '3 hours',
        price: 95,
        location: {
          country: 'Italy',
          state: 'Lazio',
          city: 'Rome',
          postalCode: '00184',
          address: 'Piazza del Colosseo, 1',
          coordinates: { lat: 41.8902, lng: 12.4922 }
        }
      },
      {
        name: 'Vatican Museums & Sistine Chapel Private Tour',
        description: 'Explore the Vatican Museums before opening hours. Stand beneath Michelangelos Sistine Chapel frescos in complete privacy, accompanied by an art historian.',
        images: ['https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80'],
        duration: '4 hours',
        price: 210,
        location: {
          country: 'Italy',
          state: 'Lazio',
          city: 'Rome',
          postalCode: '00120',
          address: 'Viale Vaticano',
          coordinates: { lat: 41.9062, lng: 12.4544 }
        }
      }
    ]);
    console.log('Structured experience activities seeded successfully.');

    console.log('Database successfully seeded with premium luxury items!');
    process.exit();
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
