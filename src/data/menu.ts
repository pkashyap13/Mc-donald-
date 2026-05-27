import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // burgers
  {
    id: 'b1',
    name: 'Supreme Golden Burger',
    description: 'Two 100% pure beef patties seasoned with a pinch of salt and pepper, melted cheddar cheese, crisp pickles, minced onions, and our signature secret house sauce on a toasted sesame seed bun.',
    price: 6.99,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop',
    tags: ['Best Seller', 'Double Beef'],
    calories: 590,
    customizations: {
      sizes: [
        { id: 's1', name: 'Regular', price: 0 },
        { id: 's2', name: 'Double Patty Deluxe', price: 2.49 },
        { id: 's3', name: 'Triple Patty Mega', price: 4.49 }
      ],
      addOns: [
        { id: 'a1', name: 'Extra Cheddar Cheese', price: 0.79 },
        { id: 'a2', name: 'Crispy Bacon Strips', price: 1.49 },
        { id: 'a3', name: 'Sliced Jalapeños', price: 0.50 },
        { id: 'a4', name: 'Sunny-Side Up Egg', price: 1.25 }
      ]
    }
  },
  {
    id: 'b2',
    name: 'Spicy Crispy Chicken Legend',
    description: 'Crispy whole-muscle chicken breast fillet seasoned with a fiery pepper blend, layered with shredded leaf lettuce, tomato, and creamy spicy mayo on a toasted potato roll.',
    price: 5.49,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?q=80&w=600&auto=format&fit=crop',
    tags: ['Spicy', 'Popular'],
    calories: 510,
    customizations: {
      sizes: [
        { id: 'cs1', name: 'Single Fillet', price: 0 },
        { id: 'cs2', name: 'Double Chicken Fillet', price: 2.29 }
      ],
      addOns: [
        { id: 'a1', name: 'Extra Cheddar Cheese', price: 0.79 },
        { id: 'a5', name: 'Pickle Slices', price: 0.30 },
        { id: 'a6', name: 'Extra Spicy Mayo', price: 0.40 }
      ]
    }
  },
  {
    id: 'b3',
    name: 'BBQ Bacon Big Cheddar',
    description: 'A thick, juicy 100% Angus beef patty topped with smoked applewood bacon, real cheddar cheese melted to perfection, tangy sweet BBQ sauce, and golden crispy onions.',
    price: 7.49,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1542152885-dd0e118aecc7?q=80&w=600&auto=format&fit=crop',
    tags: ['Smoked BBQ'],
    calories: 720,
    customizations: {
      sizes: [
        { id: 'bs1', name: 'Standard (Quarter Pounder)', price: 0 },
        { id: 'bs2', name: 'King Size (Half Pounder)', price: 2.99 }
      ],
      addOns: [
        { id: 'a1', name: 'Extra Cheddar Cheese', price: 0.79 },
        { id: 'a2', name: 'Crispy Bacon Strips', price: 1.49 },
        { id: 'a7', name: 'Sauteed Mushrooms', price: 0.99 }
      ]
    }
  },

  // chicken
  {
    id: 'c1',
    name: 'Golden Mega Nuggets (10 Pcs)',
    description: 'Tender, juicy, white meat chicken nuggets on the inside, fried to a golden crunch on the outside. Comes with your choice of two signature dipping sauces.',
    price: 5.99,
    category: 'chicken',
    image: 'https://images.unsplash.com/photo-1562967914-1432f831341c?q=80&w=600&auto=format&fit=crop',
    tags: ['Crispy Snacks'],
    calories: 440,
    customizations: {
      sizes: [
        { id: 'n1', name: '10 Pieces', price: 0 },
        { id: 'n2', name: '20 Pieces Family Pack', price: 4.99 }
      ],
      addOns: [
        { id: 'a8', name: 'Sweet BBQ Dip', price: 0.25 },
        { id: 'a9', name: 'Honey Mustard Dip', price: 0.25 },
        { id: 'a10', name: 'Creamy Ranch Dip', price: 0.25 }
      ]
    }
  },
  {
    id: 'c2',
    name: 'Crispy Fire Wings (6 Pcs)',
    description: 'Aromatic, spicy fried chicken wings glazed with a fiery buffalo glaze. Extremely crispy skin and tender meat.',
    price: 6.49,
    category: 'chicken',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=600&auto=format&fit=crop',
    tags: ['Hot & Spicy'],
    calories: 530,
    customizations: {
      sizes: [
        { id: 'w1', name: '6 Wings', price: 0 },
        { id: 'w2', name: '12 Wings Combo', price: 5.49 }
      ],
      addOns: [
        { id: 'a11', name: 'Extra Buffalo Sauce', price: 0.40 },
        { id: 'a10', name: 'Creamy Ranch Dip', price: 0.25 }
      ]
    }
  },

  // sides
  {
    id: 's_fries',
    name: 'Golden Premium Fries',
    description: 'Our world-famous, signature French Fries. Thin cut, crisp on the outside, soft-baked inside, lightly seasoned to perfection with fine sea salt.',
    price: 2.49,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop',
    tags: ['All-Time Fav'],
    calories: 320,
    customizations: {
      sizes: [
        { id: 'sf1', name: 'Small', price: -0.50 },
        { id: 'sf2', name: 'Medium (Standard)', price: 0 },
        { id: 'sf3', name: 'Large Bucket', price: 1.19 }
      ],
      addOns: [
        { id: 'a12', name: 'Cheese Sauce Dip', price: 0.75 },
        { id: 'a13', name: 'Seasoning Dust', price: 0.30 }
      ]
    }
  },
  {
    id: 's_rings',
    name: 'Glazed Onion Rings',
    description: 'Thick, sweet yellow onions double-dipped in premium beer batter and deep-fried until perfectly crunchy and colored dark golden.',
    price: 2.99,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?q=80&w=600&auto=format&fit=crop',
    calories: 280,
    customizations: {
      sizes: [
        { id: 'or1', name: 'Regular Portion', price: 0 },
        { id: 'or2', name: 'Double Sharing Saver', price: 2.20 }
      ],
      addOns: [
        { id: 'a8', name: 'Sweet BBQ Dip', price: 0.25 }
      ]
    }
  },

  // drinks
  {
    id: 'd1',
    name: 'Iced Coca-Cola',
    description: 'Crisp, cold, signature sparkling Coca-Cola poured fresh over crushed glacier ice for ultimate hydration and fizzy refreshment.',
    price: 1.99,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop',
    calories: 140,
    customizations: {
      sizes: [
        { id: 'sd1', name: 'Small', price: -0.40 },
        { id: 'sd2', name: 'Medium', price: 0 },
        { id: 'sd3', name: 'Large Super-Size', price: 0.60 }
      ],
      addOns: [
        { id: 'a14', name: 'Lemon Slices', price: 0.25 },
        { id: 'a15', name: 'Extra Ice Cubes', price: 0 }
      ]
    }
  },
  {
    id: 'd2',
    name: 'Chilled Lemon Sparkling Tea',
    description: 'Premium black tea brewed fresh daily, sweetened lightly, and infused with freshly squeezed native lemon juice and a hint of mint.',
    price: 2.29,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&auto=format&fit=crop',
    calories: 90,
    customizations: {
      sizes: [
        { id: 'st1', name: 'Standard Medium', price: 0 },
        { id: 'st2', name: 'Big Jug', price: 0.80 }
      ],
      addOns: [
        { id: 'a16', name: 'Fresh Mint Sprigs', price: 0.25 }
      ]
    }
  },

  // desserts
  {
    id: 'de1',
    name: 'Strawberry Velvet Sundae',
    description: 'Premium vanilla soft-serve ice cream churned thick, drenched in rich strawberry syrup glaze, and punctuated with freeze-dried strawberry bits.',
    price: 3.49,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=600&auto=format&fit=crop',
    tags: ['Sweet Spot'],
    calories: 290,
    customizations: {
      sizes: [
        { id: 'sn1', name: 'Standard', price: 0 },
        { id: 'sn2', name: 'Double Syrup Sundae Cup', price: 0.99 }
      ],
      addOns: [
        { id: 'a17', name: 'Extra Whipped Cream', price: 0.50 },
        { id: 'a18', name: 'Crushed Oreo Crumbs', price: 0.60 }
      ]
    }
  },
  {
    id: 'de2',
    name: 'Warm Apple Turnover Pie',
    description: 'Flaky puff pastry baked golden and crisp, filled with caramelized native apple bits, warm cinnamon sauce, and sweet vanilla powder.',
    price: 2.99,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=600&auto=format&fit=crop',
    tags: ['Warm Treat'],
    calories: 340,
    customizations: {
      sizes: [
        { id: 'ap1', name: 'Single Pie Pocket', price: 0 },
        { id: 'ap2', name: 'Double Pie Pack', price: 2.20 }
      ],
      addOns: [
        { id: 'a19', name: 'Vanilla Ice Cream Side', price: 1.20 }
      ]
    }
  }
];

export const COUPONS = [
  { code: 'MCDELIGHT', discount: 15, description: '15% Off Your Entire Order (Min. Spend $10)' },
  { code: 'BURGERHEAVEN', discount: 5, description: 'Flat $5.00 Off (Min. Spend $15)' },
  { code: 'FREEFRIES', discount: 2.5, description: 'Save $2.50 off your snacks' }
];
