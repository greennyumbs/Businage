import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function updateTradeIn(size) {

  // Extract size_ids as an array of numbers
  const sizeIds = size.map(item => item.size_id);

  // Fetch existing quantities for the provided size_ids
  const { data: existingQuantities, error } = await supabase
    .from('Trade_in_stock')
    .select('size_id, quantity')
    .in('size_id', sizeIds); // Use .in() for multiple values

  if (error) {
    console.error('Error fetching existing quantities:', error);
    return; // Handle error appropriately
  }

  // Efficiently update quantities in a single database call
  const updatePromises = size.map(item => {
    const existingQuantity = existingQuantities.find(
      existingItem => existingItem.size_id === parseInt(item.size_id)
    );

    if (existingQuantity) {
      const updatedQuantity = parseInt(existingQuantity.quantity) - parseInt(item.quantity);
      return supabase
        .from('Trade_in_stock')
        .update({ quantity: updatedQuantity })
        .eq('size_id', item.size_id);
    } else {
      // Handle missing size_id scenario (optional)
      console.warn(`Size ID ${item.size_id} not found in existing data. Ignoring update.`);
      return Promise.resolve(); // Resolve with no update
    }
  });

  await Promise.all(updatePromises); // Execute updates concurrently
}
