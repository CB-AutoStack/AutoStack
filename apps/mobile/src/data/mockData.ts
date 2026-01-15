/**
 * Mock vehicle data for development and demos
 */

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  price: number;
  monthlyPayment: number;
  mileage: number;
  color: string;
  vin: string;
  imageUrl: string;
  features: string[];
  description: string;
}

export function getMockVehicles(): Vehicle[] {
  return [
    {
      id: '1',
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      trim: 'Long Range AWD',
      price: 45990,
      monthlyPayment: 689,
      mileage: 12500,
      color: 'Midnight Silver Metallic',
      vin: '5YJ3E1EB5KF123456',
      imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
      features: [
        'Autopilot',
        'Premium Interior',
        'Glass Roof',
        'Heated Seats',
        '18" Aero Wheels',
      ],
      description: 'Clean title, single owner. Excellent condition with full Tesla service history. Long range battery with 358 miles range.',
    },
    {
      id: '2',
      make: 'BMW',
      model: 'X5',
      year: 2022,
      trim: 'xDrive40i',
      price: 52900,
      monthlyPayment: 799,
      mileage: 18200,
      color: 'Alpine White',
      vin: '5UXCR6C08N9J12345',
      imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      features: [
        'Premium Package',
        'Panoramic Sunroof',
        'Navigation System',
        'Leather Seats',
        '20" M Sport Wheels',
      ],
      description: 'Luxury SUV in pristine condition. Loaded with premium features including Harman Kardon sound system and adaptive cruise control.',
    },
    {
      id: '3',
      make: 'Ford',
      model: 'F-150',
      year: 2023,
      trim: 'Lariat SuperCrew',
      price: 58750,
      monthlyPayment: 879,
      mileage: 8900,
      color: 'Iconic Silver',
      vin: '1FTFW1E85NFA12345',
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
      features: [
        '5.0L V8 Engine',
        '4WD',
        'FX4 Off-Road Package',
        'B&O Sound System',
        'Bed Liner',
      ],
      description: 'Like new F-150 with low miles. Perfect for work or play with powerful V8 engine and luxury interior appointments.',
    },
    {
      id: '4',
      make: 'Honda',
      model: 'Accord',
      year: 2023,
      trim: 'Sport',
      price: 32990,
      monthlyPayment: 495,
      mileage: 15600,
      color: 'Radiant Red Metallic',
      vin: '1HGCV1F36NA123456',
      imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
      features: [
        'Turbocharged Engine',
        'Sport Suspension',
        'Apple CarPlay',
        'Dual-Zone Climate',
        '19" Alloy Wheels',
      ],
      description: 'Sporty and reliable sedan with excellent fuel economy. Well maintained with all service records available.',
    },
    {
      id: '5',
      make: 'Porsche',
      model: 'Cayenne',
      year: 2022,
      trim: 'S',
      price: 79900,
      monthlyPayment: 1199,
      mileage: 22100,
      color: 'Carrara White Metallic',
      vin: 'WP1AB2A27NLA12345',
      imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
      features: [
        '2.9L Twin-Turbo V6',
        'Air Suspension',
        'Sport Chrono Package',
        'Bose Surround Sound',
        '21" Turbo Wheels',
      ],
      description: 'Performance luxury SUV with incredible handling and power. Certified pre-owned with extended warranty available.',
    },
    {
      id: '6',
      make: 'Chevrolet',
      model: 'Silverado 1500',
      year: 2023,
      trim: 'LT Crew Cab',
      price: 47890,
      monthlyPayment: 719,
      mileage: 11400,
      color: 'Shadow Gray Metallic',
      vin: '1GCUYDED3NZ123456',
      imageUrl: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800',
      features: [
        '5.3L V8',
        '4WD',
        'Z71 Off-Road Package',
        'Tow Package',
        'Backup Camera',
      ],
      description: 'Capable truck with low mileage. Perfect for towing and off-road adventures with plenty of modern technology.',
    },
  ];
}
