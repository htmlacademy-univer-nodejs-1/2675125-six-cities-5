export const CreateOfferValidationMessage = {
  title: {
    invalidFormat: 'Title must be a string',
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    invalidFormat: 'Description must be a string',
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  city: {
    invalid: 'City must be one of: Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf',
  },
  previewImage: {
    invalidFormat: 'Preview image must be a valid URL',
  },
  images: {
    invalidFormat: 'Images must be an array',
    invalidItems: 'Each image must be a valid URL',
    minSize: 'Must be exactly 6 images',
    maxSize: 'Must be exactly 6 images',
  },
  isPremium: {
    invalidFormat: 'isPremium must be a boolean',
  },
  type: {
    invalid: 'Type must be one of: apartment, house, room, hotel',
  },
  rooms: {
    invalidFormat: 'Rooms must be an integer',
    minValue: 'Minimum rooms count is 1',
    maxValue: 'Maximum rooms count is 8',
  },
  guests: {
    invalidFormat: 'Guests must be an integer',
    minValue: 'Minimum guests count is 1',
    maxValue: 'Maximum guests count is 10',
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100000',
  },
  features: {
    invalidFormat: 'Features must be an array',
    invalidItems: 'Each feature must be one of: Breakfast, Air conditioning, Laptop friendly workspace, Baby seat, Washer, Towels, Fridge',
  },
  userId: {
    invalidFormat: 'Author ID must be a string',
  },
  location: {
    latitude: {
      invalidFormat: 'Latitude must be a number',
      minValue: 'Minimum latitude is -90',
      maxValue: 'Maximum latitude is 90',
    },
    longitude: {
      invalidFormat: 'Longitude must be a number',
      minValue: 'Minimum longitude is -180',
      maxValue: 'Maximum longitude is 180',
    },
  },
} as const;
