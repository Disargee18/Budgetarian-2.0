export async function sendChatMessage(messages, userContext = {}) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Budgetarian',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: `You are a helpful meal planning and nutrition assistant for Budgetarian, a budget meal planning app.
            
User Context:
- Name: ${userContext.profile?.name || 'User'}
- Age: ${userContext.profile?.age || 'Not set'}
- Gender: ${userContext.profile?.gender || 'Not set'}
- Height: ${userContext.metrics?.height || 'Not set'} cm
- Weight: ${userContext.metrics?.weight || 'Not set'} kg
- Activity Level: ${userContext.metrics?.activity || 'Not set'}
- Health Goal: ${userContext.metrics?.goal || 'Not set'}
- Weekly Budget: ${userContext.budget?.currency || '₱'}${userContext.budget?.weekly || 'Not set'}
- Dietary Preferences: ${userContext.preferences?.length > 0 ? userContext.preferences.join(', ') : 'None specified'}
- Allergies: ${userContext.allergies || 'None'}
- Health Conditions: ${userContext.healthConditions || 'None'}

Current Meal Plan Summary:
${userContext.mealPlan && Object.keys(userContext.mealPlan).length > 0 
  ? Object.entries(userContext.mealPlan).map(([day, meals]) => 
      `${day}: ${Object.entries(meals).map(([type, meal]) => `${type}: ${meal.name} (${meal.cals}kcal, ${userContext.budget?.currency || '₱'}${meal.cost})`).join(', ')}`
    ).join('\n')
  : 'No meal plan generated yet'}

Special Capabilities:
You can trigger app actions by including special tags at the END of your response. 
- To navigate: [ACTION:NAVIGATE:/route] (Routes: /dashboard, /overview, /stats, /settings)
- To change profile picture: [ACTION:UPDATE_AVATAR:avatar_src] (Sources: /avatars/chef.png, /avatars/cat.png, /avatars/panda.png, /avatars/fox.png, /avatars/astronaut.png, /avatars/owl.png, /avatars/robot.png, /avatars/bear.png)

Example: "Sure, let's head to your settings. [ACTION:NAVIGATE:/settings]" or "I've updated your avatar to the bear for you! [ACTION:UPDATE_AVATAR:/avatars/bear.png]"

You have full access to the user's data. Use it for personalized advice. Keep responses concise and helpful.`
          },
          ...messages
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Robust JSON parsing: strip markdown code blocks if present
    const cleanJson = aiResponse.replace(/```json|```/g, '').trim();
    return cleanJson;
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw error;
  }
}
export async function generateMealPlanAI(userContext) {
  try {
    const prompt = `Generate a personalized 7-day meal plan for ${userContext.profile?.name || 'the user'} based on the following:
- Weekly Budget: ${userContext.budget?.currency}${userContext.budget?.weekly}
- Health Goal: ${userContext.metrics?.goal}
- Dietary Preferences: ${userContext.preferences?.join(', ') || 'None'}
- Allergies: ${userContext.allergies || 'None'}
- Health Conditions: ${userContext.healthConditions || 'None'}
- Activity Level: ${userContext.metrics?.activity}
- Weight: ${userContext.metrics?.weight}kg, Height: ${userContext.metrics?.height}cm

The output MUST be a valid JSON object matching this structure:
{
  "Monday": {
    "Breakfast": { "name": "...", "cals": 0, "cost": 0, "description": "..." },
    "Lunch": { "name": "...", "cals": 0, "cost": 0, "description": "..." },
    "Dinner": { "name": "...", "cals": 0, "cost": 0, "description": "..." },
    "Snacks": { "name": "...", "cals": 0, "cost": 0, "description": "..." }
  },
  ... (rest of the days)
}

Ensure the total weekly cost is within the budget and meals are appropriate for the health goals and conditions. Return ONLY the JSON object.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Budgetarian',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: 'You are a professional nutritionist and budget meal planner. You only respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const cleanJson = content.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Failed to generate AI meal plan:', error);
    throw error;
  }
}

export async function generateDailyMealPlanAI(userContext, day) {
  try {
    const prompt = `Generate a personalized 1-day meal plan for ${day} for ${userContext.profile?.name || 'the user'} based on the following:
- Weekly Budget: ${userContext.budget?.currency}${userContext.budget?.weekly}
- Health Goal: ${userContext.metrics?.goal}
- Dietary Preferences: ${userContext.preferences?.join(', ') || 'None'}
- Allergies: ${userContext.allergies || 'None'}
- Health Conditions: ${userContext.healthConditions || 'None'}
- Activity Level: ${userContext.metrics?.activity}
- Weight: ${userContext.metrics?.weight}kg, Height: ${userContext.metrics?.height}cm

The output MUST be a valid JSON object for this SPECIFIC DAY ONLY matching this structure:
{
  "Breakfast": { "name": "...", "cals": 0, "cost": 0, "description": "..." },
  "Lunch": { "name": "...", "cals": 0, "cost": 0, "description": "..." },
  "Dinner": { "name": "...", "cals": 0, "cost": 0, "description": "..." },
  "Snacks": { "name": "...", "cals": 0, "cost": 0, "description": "..." }
}

Ensure the cost is within a reasonable daily portion of the weekly budget and meals are appropriate. Return ONLY the JSON object.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Budgetarian',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: 'You are a professional nutritionist and budget meal planner. You only respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const cleanJson = content.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Failed to generate AI daily meal plan:', error);
    throw error;
  }
}

