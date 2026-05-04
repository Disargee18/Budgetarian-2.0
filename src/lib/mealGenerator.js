// Mock Data for meals
const MEAL_DATABASE = [
  { name: 'Oatmeal with Berries', type: 'Breakfast', cals: 300, protein: 10, cost: 40, tags: ['Vegetarian', 'Vegan', 'Dairy-Free'], description: 'Rolled oats topped with fresh berries and chia seeds.' },
  { name: 'Scrambled Eggs on Toast', type: 'Breakfast', cals: 350, protein: 18, cost: 35, tags: ['Vegetarian'], description: 'Two eggs scrambled on whole wheat toast.' },
  { name: 'Protein Smoothie', type: 'Breakfast', cals: 280, protein: 25, cost: 60, tags: ['Vegetarian', 'Gluten-Free'], description: 'Whey or plant protein blended with banana and almond milk.' },
  { name: 'Avocado Toast', type: 'Breakfast', cals: 320, protein: 8, cost: 50, tags: ['Vegetarian', 'Vegan', 'Dairy-Free'], description: 'Mashed avocado with a sprinkle of chili flakes on sourdough.' },
  
  { name: 'Grilled Chicken Salad', type: 'Lunch', cals: 450, protein: 35, cost: 90, tags: ['Gluten-Free', 'Low-Carb'], description: 'Mixed greens with grilled chicken breast and vinaigrette.' },
  { name: 'Tofu Stir-fry', type: 'Lunch', cals: 400, protein: 20, cost: 75, tags: ['Vegetarian', 'Vegan', 'Asian', 'Dairy-Free'], description: 'Tofu cubes stir-fried with broccoli and bell peppers in soy sauce.' },
  { name: 'Quinoa Bowl', type: 'Lunch', cals: 500, protein: 15, cost: 85, tags: ['Vegetarian', 'Vegan', 'Gluten-Free'], description: 'Quinoa with roasted sweet potatoes, black beans, and salsa.' },
  { name: 'Turkey Wrap', type: 'Lunch', cals: 480, protein: 28, cost: 70, tags: ['Dairy-Free'], description: 'Sliced turkey, spinach, and hummus in a whole wheat tortilla.' },
  
  { name: 'Salmon with Asparagus', type: 'Dinner', cals: 550, protein: 40, cost: 150, tags: ['Gluten-Free', 'Keto', 'Pescatarian'], description: 'Baked salmon fillet with garlic roasted asparagus.' },
  { name: 'Lentil Curry', type: 'Dinner', cals: 480, protein: 22, cost: 65, tags: ['Vegetarian', 'Vegan', 'Asian', 'Dairy-Free'], description: 'Hearty lentil curry served with a small portion of brown rice.' },
  { name: 'Beef Stir-fry', type: 'Dinner', cals: 600, protein: 35, cost: 120, tags: ['Asian', 'Dairy-Free'], description: 'Thinly sliced beef with snap peas and carrots in oyster sauce.' },
  { name: 'Pasta Primavera', type: 'Dinner', cals: 520, protein: 15, cost: 80, tags: ['Vegetarian'], description: 'Whole wheat pasta tossed with seasonal vegetables and olive oil.' },
  
  { name: 'Greek Yogurt with Honey', type: 'Snack', cals: 150, protein: 12, cost: 30, tags: ['Vegetarian', 'Gluten-Free'], description: 'Plain Greek yogurt drizzled with honey.' },
  { name: 'Apple and Almonds', type: 'Snack', cals: 200, protein: 5, cost: 25, tags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'], description: 'One medium apple with a handful of raw almonds.' },
  { name: 'Boiled Egg', type: 'Snack', cals: 70, protein: 6, cost: 15, tags: ['Vegetarian', 'Gluten-Free', 'Keto'], description: 'One hard-boiled egg.' },
  { name: 'Carrot Sticks with Hummus', type: 'Snack', cals: 180, protein: 4, cost: 35, tags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'], description: 'Fresh carrot sticks dipped in classic hummus.' }
];

export const calculateTDEE = (weight, height, age, gender, activityLevel) => {
  // Simple Mifflin-St Jeor Equation
  let bmr;
  if (gender === 'Male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  const multipliers = {
    'Sedentary': 1.2,
    'Lightly Active': 1.375,
    'Moderately Active': 1.55,
    'Very Active': 1.725,
    'Extra Active': 1.9
  };
  
  return Math.round(bmr * (multipliers[activityLevel] || 1.2));
};

export const adjustCaloriesForGoal = (tdee, goal) => {
  if (goal === 'Lose Weight') return tdee - 500;
  if (goal === 'Gain Weight' || goal === 'Build Muscle') return tdee + 300;
  return tdee;
};

// Generates a mock 7-day plan
export const generateWeeklyPlan = (context) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const plan = {};
  
  let targetCalories = 2000;
  if (context.metrics) {
    const tdee = calculateTDEE(
      context.metrics.weight, 
      context.metrics.height, 
      context.profile.age, 
      context.profile.gender, 
      context.metrics.activity
    );
    targetCalories = adjustCaloriesForGoal(tdee, context.metrics.goal);
  }

  // Very naive random selection without strict calorie matching for demonstration
  const getMeal = (type) => {
    const meals = MEAL_DATABASE.filter(m => m.type === type);
    return meals[Math.floor(Math.random() * meals.length)];
  };

  days.forEach(day => {
    plan[day] = {
      Breakfast: { ...getMeal('Breakfast'), eaten: false },
      Lunch: { ...getMeal('Lunch'), eaten: false },
      Dinner: { ...getMeal('Dinner'), eaten: false },
      Snacks: { ...getMeal('Snack'), eaten: false }
    };
  });

  return {
    plan,
    targetCalories
  };
};
